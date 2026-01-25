import { offices } from "../../data/offices";
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "resources/office");

    try {
        const grouped = offices.reduce((acc: any, office: any) => {
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
            status: 500,
            statusText: "Failed to fetch offices",
        });
    }
});