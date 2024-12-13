"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, ExtractTablesWithRelations, inArray } from "drizzle-orm";
import { put } from "@vercel/blob";
import { db } from "@/app/db/db";
import { evaluations, evaluationScores, InsertQualitativeEvaluationScore, pdfEvaluationScores, qualitativeEvaluationScores, quantitativeEvaluationScores } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { EditEvalActionData, EditEvalEditedPdfScore, EditEvalEditedQualScore, EditEvalEditedQuantScore, EditEvalNewPdfScore, EditEvalNewQualScore, EditEvalNewQuantScore } from "../edit-evaluation-form/types";
import { VercelPgQueryResultHKT } from "drizzle-orm/vercel-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

const addNewQuantScores = async (
    { evalId, newQuantScores, tsx }: 
    {
        evalId: number,
        newQuantScores: EditEvalNewQuantScore[], 
        tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
    }) => {
        if (newQuantScores.length > 0) {
            const evaluationScoresValues = newQuantScores.map(score => ({
                evaluationId: evalId,
                assessmentId: score.assessmentId,
                type: score.type,
                orderNumber: score.orderNumber
            }));

            const createdEvalScores = await tsx
                .insert(evaluationScores)
                .values(evaluationScoresValues)
                .returning({
                    id: evaluationScores.id,
                    orderNumber: evaluationScores.orderNumber
                });

            const orderNumberToEvalScoreId = createdEvalScores.reduce((acc, score) => {
                acc[score.orderNumber] = score.id;

                return acc
            }, {} as Record<number, number>);

            const scoreValues = newQuantScores.map(score => ({
                evaluationScoreId: orderNumberToEvalScoreId[score.orderNumber] as number,
                score: score.score
            }));

            await tsx.insert(quantitativeEvaluationScores).values(scoreValues);
        }
}

const addNewQualScores = async (
    { evalId, newQualScores, tsx }: {
        evalId: number,
        newQualScores: EditEvalNewQualScore[], 
        tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
    }) => {
        if (newQualScores.length > 0) { 
            const evaluationScoresValues = newQualScores.map(score => ({
                evaluationId: evalId,
                assessmentId: score.assessmentId,
                type: score.type,
                orderNumber: score.orderNumber
            }));

            const createdEvalScores = await tsx
                .insert(evaluationScores)
                .values(evaluationScoresValues)
                .returning({
                    id: evaluationScores.id,
                    orderNumber: evaluationScores.orderNumber
                });
            
            const orderNumberToEvalScoreId = createdEvalScores.reduce((acc, score) => {
                acc[score.orderNumber] = score.id;
                
                return acc;
            }, {} as Record<number, number>);

            const scoreValues = newQualScores.map(score => ({
                evaluationScoreId: orderNumberToEvalScoreId[score.orderNumber],
                qualitativeScoreId: score.optionId,
                score: score.score,
                description: score.description,
                isPassing: score.isPassing
            }));

            await tsx.insert(qualitativeEvaluationScores).values(scoreValues);
        }
}

const addBlob = async ({ file, evaluationScoreId }: { file: File, evaluationScoreId: number }) => {
    const blob = await put(`eval_score_id_${evaluationScoreId}`, file,  { access: "public" });

    return {
        evaluationScoreId: evaluationScoreId,
        url: blob.url
    }
}

const addNewPdfScores = async (
    { evalId, newPdfScores, tsx }: 
    {
        evalId: number,
        newPdfScores: EditEvalNewPdfScore[], 
        tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
    }) => {
        if (newPdfScores.length > 0) {
            const evaluationScoreValues = newPdfScores.map(score => ({
                evaluationId: evalId,
                assessmentId: score.assessmentId,
                type: score.type,
                orderNumber: score.orderNumber
            }));

            const createdEvalScores = await tsx
                .insert(evaluationScores)
                .values(evaluationScoreValues)
                .returning({
                    id: evaluationScores.id,
                    orderNumber: evaluationScores.orderNumber
                });
            
            const orderNumberToEvaluationScoreId = createdEvalScores.reduce((acc, score) => {
                acc[score.orderNumber] = score.id;
                
                return acc;
            }, {} as Record<number, number>);

            const pdfScores = newPdfScores.map(score => ({
                ...score,
                evalId: evalId,
                evalScoreId: orderNumberToEvaluationScoreId[score.orderNumber] as number
            }));

            const processedPdfScores = await Promise.all(
                pdfScores.map(({ score: file, evalScoreId: evaluationScoreId }) => addBlob({ file, evaluationScoreId }))
            );

            await tsx.insert(pdfEvaluationScores).values(processedPdfScores);
        }
}

const editQuantScores = async (
    { editedQuantScores, tsx }: 
    {
        editedQuantScores: EditEvalEditedQuantScore[], 
        tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
    }) => {
        for (const editedScore of editedQuantScores) {
            if (editedScore.orderNumber !== undefined) {
                await tsx.update(evaluationScores).set({
                    orderNumber: editedScore.orderNumber
                }).where(eq(evaluationScores.id, editedScore.id))
            }

            if (editedScore.score) {
                await tsx.update(quantitativeEvaluationScores).set({
                    score: editedScore.score
                }).where(eq(quantitativeEvaluationScores.evaluationScoreId, editedScore.id));
            }
        }
}

const editQualScores = async (
    { editedQualScores, tsx }: 
    {
        editedQualScores: EditEvalEditedQualScore[], 
        tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
    }) => {
        for (const editedScore of editedQualScores) {
            if (editedScore.orderNumber !== undefined) {
                await tsx.update(evaluationScores).set({
                    orderNumber: editedScore.orderNumber
                }).where(eq(evaluationScores.id, editedScore.id))
            }

            const editedQualFields: Partial<InsertQualitativeEvaluationScore> = {};

            if (editedScore.optionId) editedQualFields.qualitativeScoreId = editedScore.optionId;
            if (editedScore.score) editedQualFields.score = editedScore.score;
            if (editedScore.description) editedQualFields.description = editedScore.description;
            if (editedScore.isPassing) editedQualFields.isPassing = editedScore.isPassing;
            
            if (Object.keys(editedQualFields).length > 0) {
                await tsx
                    .update(qualitativeEvaluationScores)
                    .set(editedQualFields)
                    .where(eq(qualitativeEvaluationScores.evaluationScoreId, editedScore.id));
            }
        }
}

const editPdfScores = async (
    { editedPdfScores, tsx }: 
    {
        editedPdfScores: EditEvalEditedPdfScore[], 
        tsx: PgTransaction<VercelPgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
    }) => {
        for (const editedScore of editedPdfScores) {
            if (editedScore.orderNumber !== undefined) {
                await tsx.update(evaluationScores).set({
                    orderNumber: editedScore.orderNumber
                }).where(eq(evaluationScores.id, editedScore.id))
            }
        }
}

export const editEvaluation = async (data: EditEvalActionData) => {
    console.log(data);

    const [client, userId] = await Promise.all([
        clerkClient(),
        auth().then(res => res.userId)
    ]);

    await validateTrainerAuthorization(client, userId);

    await db.transaction(async (tsx) => {
        const {
            topLevelData,
            deletedScoreIds,
            newQuantScores,
            newQualScores,
            newPdfScores,
            editedQuantScores,
            editedQualScores,
            editedPdfScores
        } = data;

        const { id: evalId, ...topData } = topLevelData;

        await tsx.update(evaluations).set(topData).where(eq(evaluations.id, evalId));

        await tsx.delete(evaluationScores).where(inArray(evaluationScores.id, deletedScoreIds));

        await addNewQuantScores({
            evalId: evalId,
            newQuantScores: newQuantScores,
            tsx: tsx
        });

        await addNewQualScores({
            evalId: evalId,
            newQualScores: newQualScores,
            tsx: tsx
        });

        await addNewPdfScores({
            evalId: evalId,
            newPdfScores: newPdfScores,
            tsx: tsx
        });

        await editQuantScores({
            editedQuantScores: editedQuantScores,
            tsx: tsx
        });

        await editQualScores({
            editedQualScores: editedQualScores,
            tsx: tsx
        });

        await editPdfScores({
            editedPdfScores: editedPdfScores,
            tsx: tsx
        });
    });

    revalidatePath("/dashboard/evaluations")
}