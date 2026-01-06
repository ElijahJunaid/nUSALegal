import { executiveOrders } from "../../data/executive-orders";

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
            statusCode: 500,
            message: "Failed to fetch executive orders",
        });
    }
});
