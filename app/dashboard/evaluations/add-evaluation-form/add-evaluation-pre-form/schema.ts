import { z } from "zod";

export const evaluationPreFormSchema = z.object({
    userId: z.number(),
    date: z.date(),
    template: z.number().optional()
});