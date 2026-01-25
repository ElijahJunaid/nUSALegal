import { files } from "../../data/files";
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "resources/files");

    try {
        return files.map((file) => ({
            title: file.title,
            link: file.fileUrl,
        }));
    } catch (error) {
        console.error("Error fetching files:", error);
        throw createError({
            status: 500,
            statusText: "Failed to fetch files",
        });
    }
});