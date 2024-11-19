import { string, z } from "zod";

const addTemplateAssessmentSchema = z.object({
    id: z.number(),
    name: z.string()
});

export const addTemplateSchema = z.object({
    name: string().min(1, "Name is required"),
    description: z.string(),
    assessments: z.array(addTemplateAssessmentSchema)
});