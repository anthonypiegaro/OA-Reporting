"use server"

import { desc, eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { assessments } from "@/app/db/schema";

export const getAssessments = async () => {
    console.log("get assessments action ran")
    const data = await db
        .select()
        .from(assessments)
        .where(eq(assessments.hidden, false))
        .orderBy(desc(assessments.createdAt));
    return data;
}