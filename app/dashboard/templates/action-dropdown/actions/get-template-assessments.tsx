"use server"

import { asc, eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { assessments, templateAssessment } from "@/app/db/schema";
import { EditTemplateAssessmentType } from "../types";

export const getTemplateAssessments = async (id: number): Promise<EditTemplateAssessmentType[]> => {
    return await db
        .select({
            id: templateAssessment.assessmentId,
            name: assessments.name
        })
        .from(templateAssessment)
        .innerJoin(assessments, eq(templateAssessment.assessmentId, assessments.id))
        .where(eq(templateAssessment.templateId, id))
        .orderBy(asc(templateAssessment.orderNumber));
}