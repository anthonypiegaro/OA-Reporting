import { assessments, SelectQualitativeScoreOption } from "@/app/db/schema";

export type EvaluationsType = {
    id: number;
    name: string;
    description: string | null;
    userId: number;
    userName: string;
    date: Date;
    updatedAt: Date;
}

export type EvaluationPreFormType = {
    userId: number,
    date: Date,
    templateId: number | undefined
}

export type EvaluationBaseAssessment = {
    id: number,
    name: string,
    type: typeof assessments["type"]
}

export type EvaluationQualitativeAssessmentType = EvaluationBaseAssessment & {
    score: string,
    options: Pick<SelectQualitativeScoreOption, "id" | "score" | "description" | "isPassing">[]; 
}

export type EvaluationQuantitativeAssessmentType = EvaluationBaseAssessment & { score: number }

export type EvaluationFormType = {
    name: string,
    description: string,
    notes: string,
    userId: number,
    date: Date,
    assessments: (EvaluationQualitativeAssessmentType | EvaluationQuantitativeAssessmentType)[];
}