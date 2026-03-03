import { validateApiToken } from "./apiTokens";
import type { H3Event } from "h3";
import { getHeader, createError } from "h3";

export function validateApiAccess(event: H3Event, endpoint: string) {
    console.log(" [DEBUG] Validating access for endpoint:", endpoint);

    const headers = event.node?.req?.headers;
    const authHeader = headers?.authorization;
    console.log(" [DEBUG] Auth header present:", !!authHeader);

    if (!authHeader) {
        throw createError({
            status: 401,
            statusText: "Authorization token required",
        });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

    const isValid = validateApiToken(token, endpoint);

    if (!isValid) {
        throw createError({
            status: 403,
            statusText: "Invalid or expired token",
        });
    }
}