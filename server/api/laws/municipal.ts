import { municipalLaws } from "../../data/municipal-laws";
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "laws/municipal");

    try {
        const grouped = municipalLaws.reduce((acc: any, law) => {
            const existing = acc.find((g: any) => g.label === law.category);
            if (existing) {
                existing.data.push({
                    title: law.code,
                    subtitle: law.title,
                    content: law.description,
                    excerp: law.description?.substring(0, 150) + "...",
                });
            } else {
                acc.push({
                    label: law.category,
                    data: [
                        {
                            title: law.code,
                            subtitle: law.title,
                            content: law.description,
                            excerp: law.description?.substring(0, 150) + "...",
                        },
                    ],
                });
            }
            return acc;
        }, []);

        return grouped;
    } catch (error) {
        console.error("Error fetching municipal laws:", error);
        throw createError({
            status: 500,
            statusText: "Failed to fetch municipal laws",
        });
    }
});