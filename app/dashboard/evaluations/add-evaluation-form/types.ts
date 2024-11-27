import { assessments, SelectAssessment } from "@/app/db/schema"

export type EvaluationPreFormType = {
    userId: number,
    date: Date,
    templateId: number | undefined
}

// types for the getTemplate action
export type ActionBaseAssessment = {
    assessmentId: number,
    name: string,
    type: SelectAssessment["type"],
    orderNumber: number
}

export type ActionQuantitativeAssessment = ActionBaseAssessment

type ActionQualitativeOption = {
    id: number,
    score: string,
    description: string,
    isPassing: boolean
}

export type ActionQualitativeAssessment = ActionBaseAssessment & {
    options: ActionQualitativeOption[]
}

export type ActionPdfAssessment = ActionBaseAssessment

export type ActionEvaluationAssessment = ActionQuantitativeAssessment | ActionQualitativeAssessment | ActionPdfAssessment;

export type ActionEvaluationForm = {
    name: string,
    description: string | null,
    assessments: ActionEvaluationAssessment[]
}

// the type that the add evaluation form will use
export type BaseAssessment = {
    assessmentId: number,
    name: string,
    type: SelectAssessment["type"],
}

export type QuantitativeAssessment = BaseAssessment & {
    score: string | null
}

export type QualitativeOption = {
    qualitativeScoreId: number
    score: string,
    description: string,
    isPassing: boolean
}

export type QualitativeAssessment = BaseAssessment & {
    score: string,
    qualitativeScoreId: number,
    description: string,
    isPassing: boolean,
    options: QualitativeOption[]
}

export type PdfAssessment = BaseAssessment & { 
    score: File | null
}

export type EvaluationAssessment = QuantitativeAssessment | QualitativeAssessment | PdfAssessment;

export type EvaluationForm = {
    userId: number,
    date: Date,
    name: string,
    description: string | null,
    notes: string | null,
    assessments: EvaluationAssessment[]
}