"use server"

import { eq, inArray } from "drizzle-orm";
import { db } from "@/app/db/db";
import { assessments, qualitativeScoreOptions, quantitativeAssessments } from "@/app/db/schema";
import { GetAssessmentsType } from "../types";

export const getAssessments = async (): Promise<GetAssessmentsType[]> => {
    console.log("called");
    const data = await db.
        select({
            id: assessments.id,
            name: assessments.name,
            type: assessments.type,
        })
        .from(assessments)
        .where(eq(assessments.hidden, false));
    
    const qualIds: number[] = data.reduce((acc, assessment) => {
        if (assessment.type === "qualitative") {
            acc.push(assessment.id);
        }
        return acc;
    }, [] as number[]);

    const quantIds: number[] = data.reduce((acc, assessment) => {
        if (assessment.type === "quantitative") {
            acc.push(assessment.id);
        }
        return acc;
    }, [] as number[]);

    const options = await db
        .select({
            id: qualitativeScoreOptions.id,
            assessmentId: qualitativeScoreOptions.assessmentId,
            score: qualitativeScoreOptions.score,
            description: qualitativeScoreOptions.description,
            isPassing: qualitativeScoreOptions.isPassing
        })
        .from(qualitativeScoreOptions)
        .where(inArray(qualitativeScoreOptions.assessmentId, qualIds));
    
    const units = await db
        .select({
            assessmentId: quantitativeAssessments.assessmentId,
            unit: quantitativeAssessments.unit
        })
        .from(quantitativeAssessments)
        .where(inArray(quantitativeAssessments.assessmentId, quantIds));
    
    const optionsHashmap = options.reduce((acc, option) => {
        if (!acc[option.assessmentId]) {
            acc[option.assessmentId] = [];
        }

        const { assessmentId, ...rest } = option;

        acc[option.assessmentId].push(rest);

        return acc;
    }, {} as Record<number, { id: number, score: string, description: string, isPassing: boolean }[]>);

    const unitsHashmap = units.reduce((acc, assessment) => {
        acc[assessment.assessmentId] = assessment.unit;

        return acc;
    }, {} as Record<number, string>);

    const processedAssessments = data.map(assessment => {
        if (assessment.type === "qualitative") {
            return {
                ...assessment,
                type: "qualitative" as "qualitative",
                options: optionsHashmap[assessment.id]
            }
        } else if (assessment.type === "quantitative") {
            return {
                ...assessment,
                unit: unitsHashmap[assessment.id]
            }
        } else {
            return assessment
        }
    });

    return processedAssessments;
}