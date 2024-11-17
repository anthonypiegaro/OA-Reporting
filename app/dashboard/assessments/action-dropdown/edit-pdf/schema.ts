import { z } from "zod";

export const editPDFSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    url: z.string()
});