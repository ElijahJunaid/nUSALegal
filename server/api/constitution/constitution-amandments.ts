// Importar dados diretamente de server/data
import { constitutionAmendments } from "../../data/constitution";

export default defineEventHandler(async (event) => {
    console.log(
        "🔍 [DEBUG] Constitution Amendments API called (direct TypeScript import)"
    );

    try {
        console.log("🔐 [DEBUG] Validating API access...");
        validateApiAccess(event, "constitution/constitution-amandments");
        console.log("✅ [DEBUG] API access validated");

        // Formatar dados para o formato esperado pela API
        const result = constitutionAmendments.map((amendment) => ({
            title: amendment.title,
            content: amendment.content,
            description: amendment.summary,
            hasArticle: false,
        }));

        console.log(
            "📊 [DEBUG] Returning",
            result.length,
            "constitution amendments"
        );
        return result;
    } catch (error) {
        console.error("❌ [ERROR] Constitution Amendments API failed:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch constitution amendments",
            cause: error.message,
        });
    }
});
