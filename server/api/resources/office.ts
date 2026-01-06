import { offices } from "../../data/offices";

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "resources/office");

    try {
        const grouped = offices.reduce((acc: any, office) => {
            const existing = acc.find((g: any) => g.label === office.category);
            if (existing) {
                existing.data.push({
                    title: office.name,
                    description: office.description,
                });
            } else {
                acc.push({
                    label: office.category,
                    data: [
                        {
                            title: office.name,
                            description: office.description,
                        },
                    ],
                });
            }
            return acc;
        }, []);

        return grouped;
    } catch (error) {
        console.error("Error fetching offices:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch offices",
        });
    }
});
