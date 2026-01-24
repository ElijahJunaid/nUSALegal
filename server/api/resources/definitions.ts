import { definitions } from "../../data/definitions";

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "resources/definitions");

    try {
        return definitions;
    } catch (error) {
        console.error("Error fetching definitions:", error);
        throw createError({
            status: 500,
            statusText: "Failed to fetch definitions",
        });
    }
});