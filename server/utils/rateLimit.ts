interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

interface RateLimitConfig {
    windowMs: number;
    max: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (event: any) => string;
}

class RateLimiter {
    private store: RateLimitStore = {};
    private windowMs: number;
    private max: number;
    private message: string;
    private skipSuccessfulRequests: boolean;
    private keyGenerator: (event: any) => string;

    constructor(config: RateLimitConfig) {
        this.windowMs = config.windowMs;
        this.max = config.max;
        this.message =
            config.message || "Too many requests, please try again later.";
        this.skipSuccessfulRequests = config.skipSuccessfulRequests || false;
        this.keyGenerator = config.keyGenerator || this.defaultKeyGenerator;

        setInterval(() => this.cleanup(), 60000);
    }

    private defaultKeyGenerator(event: any): string {
        const headers = getHeaders(event);
        return (
            headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
            headers["x-real-ip"]?.toString() ||
            event.node.req.socket?.remoteAddress ||
            "unknown"
        );
    }

    private cleanup(): void {
        const now = Date.now();
        Object.keys(this.store).forEach((key) => {
            if (this.store[key].resetTime < now) {
                delete this.store[key];
            }
        });
    }

    async check(event: any): Promise<{
        allowed: boolean;
        limit: number;
        remaining: number;
        resetTime: number;
        retryAfter?: number;
        message?: string;
    }> {
        const key = this.keyGenerator(event);
        const now = Date.now();

        if (!this.store[key] || this.store[key].resetTime < now) {
            this.store[key] = {
                count: 0,
                resetTime: now + this.windowMs,
            };
        }

        const entry = this.store[key];
        entry.count++;

        const remaining = Math.max(0, this.max - entry.count);
        const retryAfter =
            entry.count > this.max
                ? Math.ceil((entry.resetTime - now) / 1000)
                : undefined;

        return {
            allowed: entry.count <= this.max,
            limit: this.max,
            remaining,
            resetTime: entry.resetTime,
            retryAfter,
            message: entry.count > this.max ? this.message : undefined,
        };
    }

    middleware() {
        return async (event: any) => {
            const result = await this.check(event);

            event.node.res.setHeader(
                "X-RateLimit-Limit",
                result.limit.toString()
            );
            event.node.res.setHeader(
                "X-RateLimit-Remaining",
                result.remaining.toString()
            );
            event.node.res.setHeader(
                "X-RateLimit-Reset",
                new Date(result.resetTime).toISOString()
            );

            if (!result.allowed) {
                if (result.retryAfter) {
                    event.node.res.setHeader(
                        "Retry-After",
                        result.retryAfter.toString()
                    );
                }

                throw createError({
                    statusCode: 429,
                    statusMessage: "Too Many Requests",
                    message: result.message,
                    data: {
                        limit: result.limit,
                        remaining: result.remaining,
                        resetTime: result.resetTime,
                        retryAfter: result.retryAfter,
                    },
                });
            }
        };
    }
}

export const defaultRateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});

export const strictRateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 100 : 200, // Limite alto mas seguro
    message: "Too many authentication attempts, please try again later.",
});

export const looseRateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Rate limit exceeded, please slow down.",
});

export const apiRateLimiter = new RateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: "API rate limit exceeded, please try again in a minute.",
});

export { RateLimiter };
export type { RateLimitConfig };
