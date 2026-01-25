import { frcmpRules } from "../../data/federal-rules-frcmp";
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "federal-rules/frcmp");

    try {
        return [
            {
                label: "Federal Rules of Criminal Procedure",
                data: frcmpRules.map((rule) => ({
                    title: rule.number,
                    subtitle: rule.title,
                    content: rule.description,
                    excerp: rule.description.substring(0, 200) + "...",
                })),
            },
        ];
    } catch (error) {
        console.error("Error fetching FRCMP rules:", error);
        throw createError({
            status: 500,
            statusText: "Failed to fetch FRCMP rules",
        });
    }
});