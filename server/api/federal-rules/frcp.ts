import { frcpRules } from "../../data/federal-rules-frcp";

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "federal-rules/frcp");

    try {
        return [
            {
                label: "Federal Rules of Civil Procedure",
                data: frcpRules.map((rule) => ({
                    title: rule.number,
                    subtitle: rule.title,
                    content: rule.description,
                    excerp: rule.description.substring(0, 200) + "...",
                })),
            },
        ];
    } catch (error) {
        console.error("Error fetching FRCP rules:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch FRCP rules",
        });
    }
});
