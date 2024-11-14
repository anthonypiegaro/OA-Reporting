"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { assessments, quantitativeAssessments } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { ProcessedEditQuantData } from "../types/edit-quant-type";

const assessmentFields = ["name", "description", "url"];
const quantFields = ["comparativeScore", "unit", "comparisonType", "failDescription", "passDescription"];

export const editQuantitativeAssessment = async (data: ProcessedEditQuantData) => {
    const { userId } = await auth();
    const client = await clerkClient();

    await validateTrainerAuthorization(client, userId);

    // split data into the two different models
    const assessmentData = {
        updatedAt: new Date()
    }

    for (const field of assessmentFields) {
        if (data?[field] : false) assessmentData[field] = data[field];
    }

    const quantData = {};

    for (const field of quantFields) {
        if (data?[field] : false) quantData[field] = data[field];
    }

    console.log("Assess:", assessmentData);
    console.log("Quant:", quantData);

    await db.transaction(async (tsx) => {
        await tsx.update(assessments).set(assessmentData).where(eq(assessments.id, data.id));

        await tsx.update(quantitativeAssessments).set(quantData).where(eq(quantitativeAssessments.id, data.quantitativeId));
    });

    revalidatePath("/dashboard/assessments");
}