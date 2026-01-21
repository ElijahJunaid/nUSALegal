import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: ["@pinia/nuxt"],
    srcDir: "app/",
    css: ["~/assets/css/main.css"],
    vite: {
        plugins: [tailwindcss()],
        build: {
            sourcemap: false,
        },
    },
    nitro: {
        preset: "netlify",
        devServer: {
            watch: [],
        },
        serverAssets: [
            {
                baseName: "prisma",
                dir: "prisma",
            },
        ],
    },

        app: {
        head: {
            meta: [
                {
                    "http-equiv": "X-Content-Type-Options",
                    content: "nosniff",
                },
                {
                    "http-equiv": "X-XSS-Protection",
                    content: "1; mode=block",
                },
            ],
        },
    },

    runtimeConfig: {
        tokenSecret: process.env.TOKEN_SECRET || "",
        tokenExpiry: process.env.TOKEN_EXPIRY || "5",
        allowedOrigins: process.env.ALLOWED_ORIGINS || "",
        openaiApiKey: process.env.OPENAI_API_KEY || "",
        vectorStoreId: process.env.VECTOR_STORE_ID || "",
        assistantId: process.env.ASSISTANT_ID || "",
        tavilyApiKey: process.env.TAVILY_API_KEY || "",
        trelloApiKey: process.env.TRELLO_API_KEY || "",
        trelloToken: process.env.TRELLO_TOKEN || "",
        nusaApiKey: process.env.NUSA_API_KEY || "",
        public: {
            isShutdown: false,
            shutdownPage: "/shutdown",
            sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || "",
            environment:
                process.env.NUXT_PUBLIC_ENVIRONMENT ||
                process.env.NODE_ENV ||
                "production",
            sentrySampleRate: parseFloat(
                process.env.NUXT_PUBLIC_SENTRY_SAMPLE_RATE || "1.0"
            ),
        },
    },
});
