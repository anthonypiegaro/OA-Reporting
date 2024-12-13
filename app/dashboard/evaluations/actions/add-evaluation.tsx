"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { db } from "@/app/db/db";
import { evaluations, evaluationScores, pdfEvaluationScores, qualitativeEvaluationScores, quantitativeEvaluationScores } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { 
    AddEvaluationProcessedPdfScore, 
    AddEvaluationProcessedPreUrlPdfScore, 
    AddEvaluationProcessedQualScore, 
    AddEvaluationProcessedQuantScore, 
    AddEvaluationType 
} from "../types";
import { PgTransaction } from "drizzle-orm/pg-core";
import { VercelPgQueryResultHKT } from "drizzle-orm/vercel-postgres";
import { ExtractTablesWithRelations } from "drizzle-orm";

const addBlob = async ({ file, evaluationScoreId }: { file: File, evaluationScoreId: number }) => {
    const blob = await put(`eval_score_id_${evaluationScoreId}`, file,  { access: "public" });

    return {
        evaluationScoreId: evaluationScoreId,
        url: blob.url
    }
}

const processPdfScores = async (preprocessedPdfFiles: AddEvaluationProcessedPreUrlPdfScore[]): Promise<AddEvaluationProcessedPdfScore[]> => {
    const processedPdfScores = await Promise.all(
        preprocessedPdfFiles.map(({ score: file, evaluationScoreId }) => addBlob({ file, evaluationScoreId }))
    )

    return processedPdfScores;
}

const createQuantScores = async ({ tsx, scores }: { tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>, scores: AddEvaluationProcessedQuantScore[] }) => {
    if (scores.length > 0) {
        await tsx.insert(quantitativeEvaluationScores).values(scores);
    }
}

const createQualScores = async ({ tsx, scores }: { tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>, scores: AddEvaluationProcessedQualScore[] }) => {
    if (scores.length > 0) {
        await tsx.insert(qualitativeEvaluationScores).values(scores);
    }
}

const createPdfScores = async ({ tsx, scores }: { tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>, scores: AddEvaluationProcessedPreUrlPdfScore[] }) => {
    if (scores.length > 0) {
        const pdfScores = await processPdfScores(scores);
        await tsx.insert(pdfEvaluationScores).values(pdfScores);
    }
}

export const addEvaluation = async (data: AddEvaluationType) => {
    const [client, userId] = await Promise.all([
        clerkClient(),
        auth().then(res => res.userId)
    ]);

    await validateTrainerAuthorization(client, userId);

    console.log(data);

    await db.transaction(async (tsx) => {
        const [evaluation] = await tsx.insert(evaluations).values({
            userId: data.userId,
            name: data.name,
            description: data.description,
            notes: data.notes,
            date: data.date
        }).returning({ evaluationId: evaluations.id });

        if (data.assessments.length < 1) {
            return
        }

        const evaluationId = evaluation.evaluationId;

        const evaluationScoreValues = data.assessments.map(assessment => ({
            evaluationId: evaluationId,
            assessmentId: assessment.assessmentId,
            type: assessment.type,
            orderNumber: assessment.orderNumber
        }));

        const scores = await tsx.insert(evaluationScores).values(evaluationScoreValues).returning({
            id: evaluationScores.id,
            orderNumber: evaluationScores.orderNumber
        });

        const orderNumberToEvaluationScoreId: Record<number, number> = {};
        scores.forEach(score => {
            orderNumberToEvaluationScoreId[score.orderNumber] = score.id;
        });

        console.log("orderNumberToEvaluationIds:", orderNumberToEvaluationScoreId);

        const quantitativeAssessments: AddEvaluationProcessedQuantScore[] = [];
        const qualitativeAssessments: AddEvaluationProcessedQualScore[] = [];
        const pdfAssessments: AddEvaluationProcessedPreUrlPdfScore[] = [];

        data.assessments.forEach(assessment => {
            if (assessment.type === "quantitative") {
                quantitativeAssessments.push({
                    evaluationScoreId: orderNumberToEvaluationScoreId[assessment.orderNumber],
                    score: assessment.score
                });
            } else if (assessment.type === "qualitative") {
                qualitativeAssessments.push({
                    evaluationScoreId: orderNumberToEvaluationScoreId[assessment.orderNumber],
                    qualitativeScoreId: assessment.optionId,
                    score: assessment.score,
                    description: assessment.description,
                    isPassing: assessment.isPassing
                });
            } else if (assessment.type === "pdf") {
                pdfAssessments.push({
                    evaluationScoreId: orderNumberToEvaluationScoreId[assessment.orderNumber],
                    score: assessment.score
                });
            } else {
                throw new Error("Data included incorrect type");
            }
        });

        console.log(qualitativeAssessments);

        await createQuantScores({ tsx: tsx, scores: quantitativeAssessments });
        await createQualScores({ tsx: tsx, scores: qualitativeAssessments });
        await createPdfScores({ tsx: tsx, scores: pdfAssessments });
    });

    revalidatePath("/dashboard/evaluations");
}