"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { db } from "@/app/db/db";
import { InsertTemplateAssessment, templateAssessment, templates } from "@/app/db/schema";
import { AddTemplateType } from "./types";

export const addTemplate = async (data: AddTemplateType) => {
    const { userId } = await auth();
    const client = await clerkClient();

    await validateTrainerAuthorization(client, userId);

    await db.transaction(async (tsx) => {
        const [template] = await tsx.insert(templates).values({
            name: data.name,
            description: data.description
        }).returning({ templatesId: templates.id });
    
        const assessments: InsertTemplateAssessment[] = data.assessments.map((assessment, index) => ({
            templateId: template.templatesId,
            assessmentId: assessment.id,
            orderNumber: index
        }));

        await tsx.insert(templateAssessment).values(assessments);
    });

    revalidatePath("/dashboard/templates");
}