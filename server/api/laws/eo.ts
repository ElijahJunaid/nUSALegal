import { executiveOrders } from "../../data/executive-orders";
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "laws/eo");

    try {
        return executiveOrders.map((eo) => ({
            title: eo.number,
            subtitle: eo.title,
            content: eo.description,
            excerp: eo.description,
        }));
    } catch (error) {
        console.error("Error fetching executive orders:", error);
        throw createError({
            status: 500,
            statusText: "Failed to fetch executive orders",
        });
    }
});