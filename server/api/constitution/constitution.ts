import { constitutionArticles } from "../../data/constitution";
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    console.log(
        "🔍 [DEBUG] Constitution API called (direct TypeScript import)"
    );

    try {
        console.log("🔐 [DEBUG] Validating API access...");
        validateApiAccess(event, "constitution/constitution");
        console.log("✅ [DEBUG] API access validated");

        const result = constitutionArticles.map((article) => ({
            title: article.title,
            description: article.summary,
            hasArticle: true,
            key: `article${article.number}`,
        }));

        console.log(
            "📊 [DEBUG] Returning",
            result.length,
            "constitution articles"
        );
        return result;
    } catch (error) {
        console.error("❌ [ERROR] Constitution API failed:", error);
        throw createError({
            status: 500,
            statusText: "Failed to fetch constitution articles",
            cause: error instanceof Error ? error.message : String(error),
        });
    }
});