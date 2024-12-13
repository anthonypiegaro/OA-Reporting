"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/app/db/db";
import { assessments, qualitativeScoreOptions } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { InsertQualitativeAssessment } from "./types";

export const addQualitativeAssessment = async (data: InsertQualitativeAssessment) => {
    const { userId } = await auth();
    const client = await clerkClient();

    await validateTrainerAuthorization(client, userId);

    await db.transaction(async (tsx) => {
        const [assessment] = await tsx.insert(assessments).values({
            name: data.name,
            type: "qualitative",
            description: data.description,
            url: data.url
        }).returning({ assessmentId: assessments.id });

        // add the assessment id to every score option
        const options = data.qualitativeScoreOptions.map(option => ({
            ...option,
            assessmentId: assessment.assessmentId
        }));

        await tsx.insert(qualitativeScoreOptions).values(options);
    });

    revalidatePath("/dashboard/assessments");
}