import { constitutionAmendments } from "../../data/constitution";
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    console.log(
        "🔍 [DEBUG] Constitution Amendments API called (direct TypeScript import)"
    );

    try {
        console.log("🔐 [DEBUG] Validating API access...");
        validateApiAccess(event, "constitution/constitution-amandments");
        console.log("✅ [DEBUG] API access validated");

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
            status: 500,
            statusText: "Failed to fetch constitution amendments",
            cause: error instanceof Error ? error.message : String(error),
        });
    }
});