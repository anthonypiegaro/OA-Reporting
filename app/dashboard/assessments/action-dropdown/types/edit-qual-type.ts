import { z } from "zod";
import { SelectAssessment, SelectQualitativeScoreOption } from "@/app/db/schema";

// export type EditQualScoreOption = Partial<SelectQualitativeScoreOption>

// export type QualAssessment = SelectAssessment & { qualitativeScoreOptions: EditQualScoreOption[] };

// export type EditQualData = Pick<QualAssessment, "id"> & Partial<Omit<QualAssessment, "id">>;

export type EditQualScoreOption = Pick<SelectQualitativeScoreOption, "description" | "score" | "isPassing"> & { id: number | undefined };
export type EditQualScoreOptionCertain = Pick<SelectQualitativeScoreOption, "id" | "description" | "score" | "isPassing">;

export type ProcessedOption = {
    id: number,
    description?: string,
    score?: string,
    isPassing?: boolean
}

export type ProcessedOptionIdOptional = {
    id?: number,
    description?: string,
    score?: string,
    isPassing?: boolean
}

export type QualAssessmentBase = Pick<SelectAssessment, "id" | "name" | "description" | "url">
export type ProcessedQualAssessmentBase = {
    id: number,
    name?: string,
    description?: string,
    url?: string
}

export type QualAssessment = QualAssessmentBase & { qualitativeScoreOptions: EditQualScoreOption[] };

export type FullyProcessedQualitativeAssessment = ProcessedQualAssessmentBase & { options: ProcessedOptionIdOptional[] } & { deletedIds: number[] };

export type EditQualData = QualAssessment

const qualitativeScoreOption = z.object({
    id: z.optional(z.number()),
    score: z.string().min(1, "Score is required"),
    description: z.string().min(1, "Description is required"),
    isPassing: z.boolean()
});

export const editQualitativeAssessmentSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    url: z.string(),
    qualitativeScoreOptions: z.array(qualitativeScoreOption).min(1, "At least one option is required.")
});