import { SelectQuantitativeAssessment } from "@/app/db/schema"

export type QuantData = {
    evaluationScoreId: number,
    score: string,
    unit: string | null,
    passingScore: string,
    comparisonType: SelectQuantitativeAssessment["comparisonType"],
    failDescription: string | null,
    passDescription: string | null,
}

export type QualData = {
    evaluationScoreId: number,
    score: string,
    scoreDescription: string | null,
    isPassing: boolean
}

export type PdfData = {
    evaluationScoreId: number,
    pdfUrl: string
}

export type QuantDataInMap = {
    score: string,
    unit: string | null,
    passingScore: string,
    comparisonType: SelectQuantitativeAssessment["comparisonType"],
    failDescription: string | null,
    passDescription: string | null,
    isPassing: boolean
}

export type QualDataInMap = {
    score: string,
    scoreDescription: string | null,
    isPassing: boolean
}

export type PdfDataInMap = {
    pdfUrl: string
}

export type SpecificData = QuantDataInMap | QualDataInMap | PdfDataInMap; 
