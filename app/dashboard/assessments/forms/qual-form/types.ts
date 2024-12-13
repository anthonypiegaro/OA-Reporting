import { z } from "zod";
import { 
    InsertAssessment, 
    InsertQualitativeScoreOption
} from "@/app/db/schema";

export type InsertQualitativeAssessment = 
    InsertAssessment & 
    { 
        qualitativeScoreOptions: InsertQualitativeScoreOption[]
    };

const qualitativeScoreOption = z.object({
    score: z.string().min(1, "Score is required"),
    description: z.string().min(1, "Description is required"),
    isPassing: z.boolean()
});

export const insertQualitativeAssessmentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string(),
    description: z.string(),
    url: z.string(),
    qualitativeScoreOptions: z.array(qualitativeScoreOption).min(1, "At least one option is required.")
});