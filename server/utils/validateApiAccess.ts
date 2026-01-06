import { validateApiToken } from "./apiTokens";
import type { H3Event } from "h3";

export function validateApiAccess(event: H3Event, endpoint: string) {
    console.log("🔐 [DEBUG] Validating access for endpoint:", endpoint);

    const authHeader = getHeader(event, "authorization");
    console.log("🔐 [DEBUG] Auth header present:", !!authHeader);

    if (!authHeader) {
        throw createError({
            statusCode: 401,
            statusMessage: "Authorization token required",
        });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

    const isValid = validateApiToken(token, endpoint);

    if (!isValid) {
        throw createError({
            statusCode: 403,
            statusMessage: "Invalid or expired token",
        });
    }
}
