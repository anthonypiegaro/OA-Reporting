import { z } from "zod";

export const pdfFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    type: z.string(),
    url: z.string()
});