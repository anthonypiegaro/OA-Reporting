"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { assessments, InsertAssessment, InsertQuantitativeAssessment, quantitativeAssessments } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { ProcessedEditQuantData } from "../types/edit-quant-type";

const assessmentFields = ["name", "description", "url"];
const quantFields = ["comparativeScore", "unit", "comparisonType", "failDescription", "passDescription"];

export const editQuantitativeAssessment = async (data: ProcessedEditQuantData) => {
    const { userId } = await auth();
    const client = await clerkClient();

    await validateTrainerAuthorization(client, userId);

    // split data into the two different models
    const assessmentData: Partial<InsertAssessment> = {
        updatedAt: new Date()
    }

    if (data.name) assessmentData.name = data.name;
    if (data.description) assessmentData.description = data.description;
    if (data.url) assessmentData.url = data.url;

    const quantData: Partial<InsertQuantitativeAssessment> = {};

    if (data.comparativeScore) quantData.comparativeScore = data.comparativeScore;
    if (data.unit) quantData.unit = data.unit;
    if (data.comparisonType) quantData.comparisonType = data.comparisonType;
    if (data.failDescription) quantData.failDescription = data.failDescription;
    if (data.passDescription) quantData.passDescription = data.passDescription;

    console.log("Assess:", assessmentData);
    console.log("Quant:", quantData);

    await db.transaction(async (tsx) => {
        await tsx.update(assessments).set(assessmentData).where(eq(assessments.id, data.id));

        if (Object.keys(quantData).length > 0) {
            await tsx.update(quantitativeAssessments).set(quantData).where(eq(quantitativeAssessments.id, data.quantitativeId));
        }
    });

    revalidatePath("/dashboard/assessments");
}