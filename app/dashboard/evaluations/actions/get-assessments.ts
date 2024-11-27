"use server"

import { eq, inArray } from "drizzle-orm";
import { db } from "@/app/db/db";
import { assessments, qualitativeScoreOptions } from "@/app/db/schema";
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
    
    const optionsHashmap = options.reduce((acc, option) => {
        if (!acc[option.assessmentId]) {
            acc[option.assessmentId] = [];
        }

        const { assessmentId, ...rest } = option;

        acc[option.assessmentId].push(rest);

        return acc;
    }, {} as Record<number, { id: number, score: string, description: string, isPassing: boolean }[]>);

    const processedAssessments = data.map(assessment => {
        if (assessment.type === "qualitative") {
            return {
                ...assessment,
                type: "qualitative" as "qualitative",
                options: optionsHashmap[assessment.id]
            }
        } else {
            return assessment
        }
    });

    return processedAssessments;
}