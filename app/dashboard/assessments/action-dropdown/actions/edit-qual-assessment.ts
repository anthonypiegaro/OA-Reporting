"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/app/db/db";
import { assessments, InsertQualitativeScoreOption, qualitativeScoreOptions } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { FullyProcessedQualitativeAssessment } from "../types/edit-qual-type";

export const editQualitativeAssessment = async (data: FullyProcessedQualitativeAssessment) => {
    const { userId } = await auth();
    const client = await clerkClient();

    await validateTrainerAuthorization(client, userId);

    const { deletedIds, options, id, ...rest } = data;

    const processedOptions = options.map(option => ({
        ...option,
        assessmentId: id
    }));

    await db.transaction(async (tsx) => {
        await tsx.update(assessments).set({
            ...rest,
            updatedAt: new Date()
        }).where(eq(assessments.id, id));

        await tsx.delete(qualitativeScoreOptions).where(inArray(qualitativeScoreOptions.id, deletedIds));

        for (const option of processedOptions) {
            if (option.id) {
                await tsx.update(qualitativeScoreOptions).set(option).where(eq(qualitativeScoreOptions.id, option.id));
            } else {
                await tsx.insert(qualitativeScoreOptions).values(option as InsertQualitativeScoreOption);
            }
        }
    });
    revalidatePath("/dashboard/assessments");
}