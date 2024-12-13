import { number, z } from "zod";

const editEvalFormBaseAssessment = z.object({
    id: z.number().optional(),
    assessmentId: z.number(),
    name: z.string(),
    orderNumber: z.number()
});

const editEvalFormQuantAssessment = editEvalFormBaseAssessment.extend({
    type: z.literal("quantitative"),
    score: z.string().min(1, "score is required"),
    unit: z.string()
});

const editEvalFormQualAssessmentOption = z.object({
    id: z.number(),
    score: z.string(),
    description: z.string(),
    isPassing: z.boolean()
});

const editEvalFormQualAssessment = editEvalFormBaseAssessment.extend({
    type: z.literal("qualitative"),
    optionId: z.number(),
    score: z.string().min(1, "Score is required"),
    description: z.string(),
    isPassing: z.boolean(),
    options: z.array(editEvalFormQualAssessmentOption)
});

const editEvalFormPdfAssesment = editEvalFormBaseAssessment.extend({
    type: z.literal("pdf"),
    score: z.union([
        z.string().min(1, "Score is required"),
        z.instanceof(File)
        .refine((file) => file.size <= 4500000, 'File size must be less than 4.5MB')
        .refine(
          (file) => file.type === 'application/pdf',
          'Only PDF files are allowed'
        )
    ])
});

const editEvalFormAssessment = z.discriminatedUnion("type", [
    editEvalFormQuantAssessment,
    editEvalFormQualAssessment,
    editEvalFormPdfAssesment
]);

export const editEvalForm = z.object({
    id: z.number(),
    userId: z.number(),
    date: z.date(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    notes: z.string().optional(),
    assessments: z.array(editEvalFormAssessment)
});