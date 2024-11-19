"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { templates, templateAssessment, InsertTemplateAssessment } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { EditTemplateType } from "../types";

export const editTemplate = async (data: EditTemplateType) => {
    const { userId } = await auth();
    const cleint = await clerkClient();

    await validateTrainerAuthorization(cleint, userId);

    await db.transaction(async (tsx) => {
        await tsx.delete(templateAssessment).where(eq(templateAssessment.templateId, data.id));

        const assessments: InsertTemplateAssessment[] = data.assessments.map((assessment, index) => ({
            templateId: data.id,
            assessmentId: assessment.id,
            orderNumber: index
        }));

        await tsx.insert(templateAssessment).values(assessments);

        await tsx.update(templates).set({
            name: data.name,
            description: data.description,
            updatedAt: new Date()
        }).where(eq(templates.id, data.id))
    });

    revalidatePath("dashboard/templates");
}