"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type Clerk } from "@clerk/backend";
import { db } from "@/app/db/db";
import { 
    assessments, 
    quantitativeAssessments, 
} from "@/app/db/schema";
import { FormData } from "./type";

const validateAuthorization = async (client: Clerk, callerId: string | null) => {
    if (!callerId) {
        throw new Error("Forbidden: not signed in");
    }

    const user = await client.users.getUser(callerId)
    const role = await user.privateMetadata.role

    if (role !== "trainer") {
        throw new Error("Forbidden: You do not have permission to add a Template");
    }
}

export const addQuantitativeAssessment = async (values: FormData) => {
    const { userId } = await auth();
    const client = await clerkClient();

    validateAuthorization(client, userId);

    await db.transaction(async (tsx) => {
        const [assessment] = await tsx.insert(assessments).values({
            name: values.name,
            type: "quantitative",
            description: values.description,
            url: values.url
        }).returning({ assessmentId: assessments.id });

        await tsx.insert(quantitativeAssessments).values({
            assessmentId: assessment.assessmentId,
            comparativeScore: values.comparativeScore,
            unit: values.unit,
            comparisonType: values.comparisonType,
            failDescription: values.failDescription,
            passDescription: values.passDescription
        });
    });

    revalidatePath("/dashboard/assessments");

    return { message: "Success" };
}