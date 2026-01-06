import { vips } from "../../data/vips";

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "resources/vips");

    try {
        return vips;
    } catch (error) {
        console.error("Error fetching VIPs:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch VIPs",
        });
    }
});
