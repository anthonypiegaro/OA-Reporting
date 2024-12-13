"use server"

import { eq, inArray } from "drizzle-orm";
import { db } from "@/app/db/db";
import {
    assessments,
    evaluations,
    evaluationScores,
    pdfEvaluationScores,
    qualitativeEvaluationScores,
    qualitativeScoreOptions,
    quantitativeAssessments,
    quantitativeEvaluationScores
} from "@/app/db/schema";
import { EditEvalForm } from "../edit-evaluation-form/types";

export const getEvaluation = async (id: number): Promise<EditEvalForm> => {
    const [evaluation] = await db.select({
        id: evaluations.id,
        userId: evaluations.userId,
        date: evaluations.date,
        name: evaluations.name,
        description: evaluations.description,
        notes: evaluations.notes
    })
    .from(evaluations)
    .where(eq(evaluations.id, id));

    const quants = await db.select({
        id: evaluationScores.id,
        assessmentId: assessments.id,
        name: assessments.name,
        score: quantitativeEvaluationScores.score,
        orderNumber: evaluationScores.orderNumber,
        unit: quantitativeAssessments.unit,
        type: assessments.type
    })
    .from(quantitativeEvaluationScores)
    .leftJoin(evaluationScores, eq(evaluationScores.id, quantitativeEvaluationScores.evaluationScoreId))
    .leftJoin(assessments, eq(assessments.id, evaluationScores.assessmentId))
    .leftJoin(quantitativeAssessments, eq(assessments.id, quantitativeAssessments.assessmentId))
    .where(eq(evaluationScores.evaluationId, id));

    const quals = await db.select({
        id: evaluationScores.id,
        assessmentId: assessments.id,
        name: assessments.name,
        type: assessments.type,
        optionId: qualitativeEvaluationScores.qualitativeScoreId,
        score: qualitativeEvaluationScores.score,
        description: qualitativeEvaluationScores.description,
        isPassing: qualitativeEvaluationScores.isPassing,
        orderNumber: evaluationScores.orderNumber
    })
    .from(qualitativeEvaluationScores)
    .leftJoin(evaluationScores, eq(evaluationScores.id, qualitativeEvaluationScores.evaluationScoreId))
    .leftJoin(assessments, eq(assessments.id, evaluationScores.assessmentId))
    .where(eq(evaluationScores.evaluationId, id));

    const optionIds = quals.map(qual => qual.assessmentId as number);

    const options = await db.select({
        id: qualitativeScoreOptions.id,
        assessmentId: qualitativeScoreOptions.assessmentId,
        score: qualitativeScoreOptions.score,
        description: qualitativeScoreOptions.description,
        isPassing: qualitativeScoreOptions.isPassing
    })
    .from(qualitativeScoreOptions)
    .where(inArray(qualitativeScoreOptions.assessmentId, optionIds))

    const optionsByAssessment = options.reduce((acc, option) => {
        if (!acc[option.assessmentId]) {
            acc[option.assessmentId] = [];
        }

        acc[option.assessmentId].push({
            id: option.id,
            score: option.score,
            description: option.description,
            isPassing: option.isPassing
        });

        return acc
    }, {} as Record<number, {
        id: number,
        score: string,
        description: string,
        isPassing: boolean
    }[]>);

    const qualFull = quals.map(assessment => ({
        ...assessment,
        options: optionsByAssessment[assessment.assessmentId as number]
    }))

    const pdfs = await db.select({
        id: evaluationScores.id,
        assessmentId: assessments.id,
        name: assessments.name,
        type: assessments.type,
        orderNumber: evaluationScores.orderNumber,
        score: pdfEvaluationScores.url
    })
    .from(pdfEvaluationScores)
    .leftJoin(evaluationScores, eq(evaluationScores.id, pdfEvaluationScores.evaluationScoreId))
    .leftJoin(assessments, eq(assessments.id, evaluationScores.assessmentId))
    .where(eq(evaluationScores.evaluationId, id));

    const fullAssessments = [...quants, ...qualFull, ...pdfs].sort((a, b) => a.orderNumber - b.orderNumber)

    return {
        ...evaluation,
        assessments: fullAssessments
    }
}