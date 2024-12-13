"use server"

import { revalidatePath } from "next/cache";
import { db } from "@/app/db/db";
import { assessments, InsertAssessment } from "@/app/db/schema";

export const addPDFAssessment = async (data: InsertAssessment) => {
    await db.insert(assessments).values(data);
    revalidatePath("/dashboard/assessments");
}