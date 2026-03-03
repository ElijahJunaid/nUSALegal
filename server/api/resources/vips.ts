import { vips } from "../../data/vips";
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "resources/vips");

    try {
        return vips;
    } catch (error) {
        console.error("Error fetching VIPs:", error);
        throw createError({
            status: 500,
            statusText: "Failed to fetch VIPs",
        });
    }
});