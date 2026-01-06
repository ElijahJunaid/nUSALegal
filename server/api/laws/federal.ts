import { federalLaws } from "../../data/laws";

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "laws/federal");

    try {
        return federalLaws.map((law) => ({
            title: law.title,
            subtitle: law.title,
            content: law.description,
            excerp:
                law.description?.substring(0, 200) +
                (law.description && law.description.length > 200 ? "..." : ""),
        }));
    } catch (error) {
        console.error("Error fetching federal laws:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch federal laws",
        });
    }
});
