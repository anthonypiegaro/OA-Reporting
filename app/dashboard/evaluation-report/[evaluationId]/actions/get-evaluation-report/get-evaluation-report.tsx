"use server"

import Big from "big.js";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/app/db/db";
import { 
    assessments,
    evaluations,
    evaluationScores,
    pdfEvaluationScores,
    qualitativeEvaluationScores,
    quantitativeAssessments,
    quantitativeEvaluationScores,
    SelectQuantitativeAssessment,
    users
} from "@/app/db/schema";
import { Assessment, EvaluationReport } from "../../type";
import { 
    QuantData, 
    QualData, 
    PdfData,
    QuantDataInMap, 
    QualDataInMap, 
    PdfDataInMap,
    SpecificData
} from "./types";

const getQuantData = async (quantIds: number[]): Promise<QuantData[]> => await db
        .select({
            evaluationScoreId: quantitativeEvaluationScores.evaluationScoreId,
            score: quantitativeEvaluationScores.score,
            unit: quantitativeAssessments.unit,
            passingScore: quantitativeAssessments.comparativeScore,
            comparisonType: quantitativeAssessments.comparisonType,
            failDescription: quantitativeAssessments.failDescription,
            passDescription: quantitativeAssessments.passDescription
        })
        .from(quantitativeEvaluationScores)
        .leftJoin(evaluationScores, eq(evaluationScores.id, quantitativeEvaluationScores.evaluationScoreId))
        .innerJoin(quantitativeAssessments, eq(evaluationScores.assessmentId, quantitativeAssessments.assessmentId))
        .where(inArray(quantitativeEvaluationScores.evaluationScoreId, quantIds));

const getQualData = async (qualIds: number[]): Promise<QualData[]> => await db
        .select({
            evaluationScoreId: qualitativeEvaluationScores.evaluationScoreId,
            score: qualitativeEvaluationScores.score,
            scoreDescription: qualitativeEvaluationScores.description,
            isPassing: qualitativeEvaluationScores.isPassing
        })
        .from(qualitativeEvaluationScores)
        .where(inArray(qualitativeEvaluationScores.evaluationScoreId, qualIds));

const getPdfData = async (pdfIds: number[]): Promise<PdfData[]> => await db
        .select({
            evaluationScoreId: pdfEvaluationScores.id,
            pdfUrl: pdfEvaluationScores.url
        })
        .from(pdfEvaluationScores)
        .where(inArray(pdfEvaluationScores.evaluationScoreId, pdfIds));

const isQuantAssessmentPassing = ({ score, passingScore, comparisonType }: {
    score: string,
    passingScore: string,
    comparisonType: SelectQuantitativeAssessment["comparisonType"]
}): boolean => {
    const bigScore = new Big(score);
    const bigPassingScore = new Big(passingScore);

    if (comparisonType === "lt") {
        return bigScore.lt(bigPassingScore);
    } else if (comparisonType === "lte") {
        return bigScore.lte(bigPassingScore);
    } else if (comparisonType === "eq") {
        return bigScore.eq(bigPassingScore);
    } else if (comparisonType === "gte") {
        return bigScore.gte(bigPassingScore);
    } else {
        return bigScore.gt(bigPassingScore)
    }
}

export const getEvaluationReport = async (evaluationId: number): Promise<EvaluationReport> => {
    const [evaluation] = await db
            .select({
                id: evaluations.id,
                userId: evaluations.userId,
                userName: users.name,
                date: evaluations.date,
                evaluationName: evaluations.name,
                description: evaluations.description,
                notes: evaluations.notes
            })
            .from(evaluations)
            .leftJoin(users, eq(evaluations.userId, users.id))
            .where(eq(evaluations.id, evaluationId));
    
    const scores = await db
            .select({
                id: evaluationScores.id,
                assessmentId: evaluationScores.assessmentId,
                type: evaluationScores.type,
                orderNumber: evaluationScores.orderNumber,
                url: assessments.url,
                name: assessments.name,
                description: assessments.description
            })
            .from(evaluationScores)
            .leftJoin(assessments, eq(evaluationScores.assessmentId, assessments.id))
            .where(eq(evaluationScores.evaluationId, evaluationId))
            .orderBy(asc(evaluationScores.orderNumber));
    
    const quantIds: number[] = [];
    const qualIds: number[] = [];
    const pdfIds: number[] = [];

    scores.forEach(score => {
        if (score.type === "quantitative") {
            quantIds.push(score.id);
        } else if (score.type === "qualitative") {
            qualIds.push(score.id);
        } else if (score.type === "pdf") {
            pdfIds.push(score.id);
        }
    });

    const [quantData, qualData, pdfData] = await Promise.all([
        getQuantData(quantIds),
        getQualData(qualIds),
        getPdfData(pdfIds)
    ]);

    const quantDataWithIsPassing = quantData.map(assessment => ({
        ...assessment,
        isPassing: isQuantAssessmentPassing({
            score: assessment.score,
            passingScore: assessment.passingScore,
            comparisonType: assessment.comparisonType
        })
    }))

    const evaluationScoreIdToData = [...quantDataWithIsPassing, ...qualData, ...pdfData].reduce((acc, allData) => {
        const { evaluationScoreId, ...data } = allData;

        acc[evaluationScoreId] = data;

        return acc;
    }, {} as Record<number, QuantDataInMap | QualDataInMap | PdfDataInMap>);

    const fullAssessmentData: Assessment[] = scores.map(score => {
        const specificData: SpecificData = evaluationScoreIdToData[score.id];
        
        const assessmentDataCombined: Assessment = {
            ...score,
            ...specificData
        }

        return assessmentDataCombined;
    })

    return {
        ...evaluation,
        assessments: fullAssessmentData
    }
}