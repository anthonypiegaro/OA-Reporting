"use server"

import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { quantitativeAssessments } from "@/app/db/schema";

export const getQuantitativeAssessment = async (assessmentId: number) => {
    const data = await db.select()
        .from(quantitativeAssessments)
        .where(eq(quantitativeAssessments.assessmentId, assessmentId));
    
    if (data.length === 0) {
        throw new Error("Assessment does not exist");
    }

    console.log("Called get quant assessment");
    return data[0];
}