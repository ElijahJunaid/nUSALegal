// Importar dados diretamente de server/data
import { constitutionArticles } from "../../data/constitution";

export default defineEventHandler(async (event) => {
    console.log(
        "🔍 [DEBUG] Constitution API called (direct TypeScript import)"
    );

    try {
        console.log("🔐 [DEBUG] Validating API access...");
        validateApiAccess(event, "constitution/constitution");
        console.log("✅ [DEBUG] API access validated");

        // Formatar dados para o formato esperado pela API
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
            statusCode: 500,
            statusMessage: "Failed to fetch constitution articles",
            cause: error.message,
        });
    }
});
