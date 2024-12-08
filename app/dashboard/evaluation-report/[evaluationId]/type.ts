import { SelectQuantitativeAssessment } from "@/app/db/schema"

export type QuantitativeAssessment = {
    id: number,
    assessmentId: number,
    type: "quantitative",
    orderNumber: number
    url: string,
    name: string,
    description: string,
    score: string,
    unit: string,
    passingScore: string,
    comparisonType: SelectQuantitativeAssessment["comparisonType"],
    failDescription: string,
    passDescription: string,
    isPassing: boolean
}

export type QualitativeAssessment = {
    id: number,
    assessmentId: number,
    type: "qualitative",
    url: string,
    name: string,
    orderNumber: number,
    description: string,
    score: string,
    scoreDescription: string,
    isPassing: boolean
}

export type PdfAssessment = {
    id: number,
    assessmentId: number,
    type: "pdf",
    name: string,
    description: string,
    url: string,
    orderNumber: number
}

export type Assessment = QuantitativeAssessment | QualitativeAssessment | PdfAssessment;

export type EvaluationReport = {
    id: number,
    userId: number,
    userName: string | null,
    date: Date,
    evaluationName: string,
    description: string | null,
    notes: string | null,
    assessments: Assessment[]
}