import { string, z } from "zod";

const editTemplateAssessmentSchema = z.object({
    id: z.number(),
    name: z.string()
});

export const editTemplateSchema = z.object({
    id: z.number(),
    name: string().min(1, "Name is required"),
    description: z.string(),
    assessments: z.array(editTemplateAssessmentSchema)
});