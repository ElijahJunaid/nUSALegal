import { congressBills } from "./bills/congress";
import { cityCouncilBills } from "./bills/city-council";
import { federalLaws } from "../data/laws";
import { definitions } from "../data/definitions";
import { executiveOrders } from "../data/executive-orders";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const searchTerm = (query.q as string) || "";
    const types = (query.types as string)?.split(",") || [];

    if (!searchTerm || searchTerm.length < 2) {
        return { results: [] };
    }

    try {
        const results: any[] = [];
        const searchLower = searchTerm.toLowerCase();

        if (!types.length || types.includes("bills")) {
            // Buscar em bills do congresso
            const congressResults = congressBills
                .filter(
                    (bill) =>
                        bill.number?.toLowerCase().includes(searchLower) ||
                        bill.description?.toLowerCase().includes(searchLower)
                )
                .slice(0, 10)
                .map((b) => ({
                    type: "bill",
                    id: b.number,
                    title: b.number,
                    description: b.description,
                    category: b.category,
                    data: b,
                }));
            results.push(...congressResults);

            // Buscar em bills do city council
            const cityCouncilResults = cityCouncilBills
                .filter(
                    (bill) =>
                        bill.number?.toLowerCase().includes(searchLower) ||
                        bill.description?.toLowerCase().includes(searchLower)
                )
                .slice(0, 10)
                .map((b) => ({
                    type: "bill",
                    id: b.number,
                    title: b.number,
                    description: b.description,
                    category: b.category,
                    data: b,
                }));
            results.push(...cityCouncilResults);
        }

        if (!types.length || types.includes("laws")) {
            const laws = federalLaws
                .filter(
                    (law) =>
                        law.title?.toLowerCase().includes(searchLower) ||
                        law.uscode?.toLowerCase().includes(searchLower) ||
                        law.description?.toLowerCase().includes(searchLower)
                )
                .slice(0, 10)
                .map((l) => ({
                    type: "law",
                    id: l.uscode || l.title,
                    title: l.title,
                    description: l.description,
                    data: l,
                }));
            results.push(...laws);
        }

        if (!types.length || types.includes("definitions")) {
            const defs = definitions
                .filter(
                    (def) =>
                        def.title?.toLowerCase().includes(searchLower) ||
                        def.description?.toLowerCase().includes(searchLower)
                )
                .slice(0, 10)
                .map((d) => ({
                    type: "definition",
                    id: d.title,
                    title: d.title,
                    description: d.description,
                    data: d,
                }));
            results.push(...defs);
        }

        if (!types.length || types.includes("eos")) {
            const eos = executiveOrders
                .filter(
                    (eo) =>
                        eo.number?.toLowerCase().includes(searchLower) ||
                        eo.title?.toLowerCase().includes(searchLower) ||
                        eo.description?.toLowerCase().includes(searchLower)
                )
                .slice(0, 10)
                .map((e) => ({
                    type: "executive-order",
                    id: e.number,
                    title: `${e.number}: ${e.title}`,
                    description: e.description,
                    data: e,
                }));
            results.push(...eos);
        }

        return { results, total: results.length };
    } catch (error) {
        console.error("Search error:", error);
        throw createError({
            statusCode: 500,
            message: "Search failed",
        });
    }
});
