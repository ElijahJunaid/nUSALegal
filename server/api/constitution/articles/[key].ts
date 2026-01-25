import { articles } from "../../../data/constitution";
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { validateApiAccess } from '../../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    console.log("🔍 [DEBUG] Constitution Articles API called (static data)");

    try {
        console.log("🔐 [DEBUG] Validating API access...");
        validateApiAccess(event, "constitution/articles");
        console.log("✅ [DEBUG] API access validated");

        const key = getRouterParam(event, "key");

        if (!key) return [];

        if (!Object.hasOwn(articles, key)) return [];

        console.log("📊 [DEBUG] Returning article:", key);
        return articles[key];
    } catch (error) {
        console.error("❌ [ERROR] Constitution Articles API failed:", error);
        throw createError({
            status: 500,
            statusText: "Failed to fetch constitution article",
            cause: error instanceof Error ? error.message : String(error),
        });
    }
});