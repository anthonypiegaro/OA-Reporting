import { assessments, SelectUser, SelectQualitativeScoreOption } from "@/app/db/schema";

export type EvaluationsType = {
    id: number;
    name: string;
    description: string | null;
    userId: number;
    userName: string;
    playingLevel: SelectUser["playingLevel"],
    date: Date;
    updatedAt: Date;
    createdAt: Date;
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

export type GetAssessmentsType = (
    { 
        id: number; 
        name: string; 
        type: "quantitative" | "qualitative" | "pdf"; 
    } | { 
        type: "qualitative"; 
        options: { 
            id: number; 
            score: string; 
            description: string; 
            isPassing: boolean; 
        }[]; 
        id: number; 
        name: string; 
    } | {
        type: "quantitative"; 
        unit: string,
        id: number; 
        name: string; 
    }
)


// Types for the AddEvaluation Action

export type AddEvaluationBaseScore = {
    assessmentId: number,
    name: string,
    orderNumber: number
};

export type AddEvaluationQuantScore = AddEvaluationBaseScore & { type: "quantitative", score: string };

export type AddEvaluationQualScore = AddEvaluationBaseScore & {
    type: "qualitative"
    optionId: number,
    score: string,
    description: string,
    isPassing: boolean
}

export type AddEvaluationPdfScore = AddEvaluationBaseScore & { type: "pdf", score: File };

export type AddEvaluationAssessmentType = AddEvaluationQuantScore | AddEvaluationQualScore | AddEvaluationPdfScore;

export type AddEvaluationType = {
    userId: number,
    date: Date,
    name: string,
    description: string,
    notes: string,
    assessments: AddEvaluationAssessmentType[]
};

export type AddEvaluationProcessedQuantScore = {
    evaluationScoreId: number,
    score: string
}

export type AddEvaluationProcessedQualScore = {
    evaluationScoreId: number,
    qualitativeScoreId: number,
    score: string,
    description: string,
    isPassing: boolean
}

export type AddEvaluationProcessedPreUrlPdfScore = {
    evaluationScoreId: number,
    score: File
}

export type AddEvaluationProcessedPdfScore = {
    evaluationScoreId: number,
    url: string
}

export type AddEvaluationProcessedScores = AddEvaluationProcessedPreUrlPdfScore 
    | AddEvaluationProcessedQualScore 
    | AddEvaluationProcessedQuantScore;