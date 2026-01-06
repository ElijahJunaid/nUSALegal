import { courtProcedures } from "../../data/court-procedures";

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "resources/court-procedure");

    try {
        return courtProcedures.map((p) => p.description);
    } catch (error) {
        console.error("Error fetching court procedures:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch court procedures",
        });
    }
});
