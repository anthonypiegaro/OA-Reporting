"use server"

import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { qualitativeScoreOptions, SelectQualitativeScoreOption } from "@/app/db/schema";

export const getQualitativeAssessmentScoreOptions = async (assessmentId: number): Promise<SelectQualitativeScoreOption[]> => {
    return await db.select().from(qualitativeScoreOptions).where(eq(qualitativeScoreOptions.assessmentId, assessmentId));
}