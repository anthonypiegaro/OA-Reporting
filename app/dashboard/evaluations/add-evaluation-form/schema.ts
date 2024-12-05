import { z } from "zod";

export const evaluationPreFormSchema = z.object({
    userId: z.number(),
    date: z.date(),
    templateId: z.number().optional()
});

const BaseAssessmentSchema = z.object({
    assessmentId: z.number(),
    name: z.string().min(1, "Name is required"),
    type: z.string(),
});
  
const QuantitativeAssessmentSchema = BaseAssessmentSchema.extend({
    score: z.string().min(1, "Score is required"),
    unit: z.string()
}).extend({ type: z.literal("quantitative") });

const QualitativeOptionSchema = z.object({
    id: z.number(),
    score: z.string().min(1, "Score is required"),
    description: z.string(),
    isPassing: z.boolean(),
});

const QualitativeAssessmentSchema = BaseAssessmentSchema.extend({
    qualitativeScoreId: z.number(),
    description: z.string(),
    score: z.string().min(1, "Score is required"),
    isPassing: z.boolean(),
    options: z.array(QualitativeOptionSchema),
}).extend({ type: z.literal("qualitative") });
  

const PdfOptionSchema = BaseAssessmentSchema.extend({
    score: z.instanceof(File)
        .refine((file) => file.size <= 4500000, 'File size must be less than 4.5MB')
        .refine(
          (file) => file.type === 'application/pdf',
          'Only PDF files are allowed'
        )
}).extend({ type: z.literal("pdf") });

const EvaluationAssessmentSchema = z.discriminatedUnion("type", [
    QuantitativeAssessmentSchema,
    QualitativeAssessmentSchema,
    PdfOptionSchema,
]);

export const EvaluationFormSchema = z.object({
    userId: z.number(),
    date: z.date(),
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    notes: z.string().optional(),
    assessments: z.array(EvaluationAssessmentSchema),
});