"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/app/db/db";
import { assessments } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";
import { EditPDFFormType } from "../types/edit-pdf-types";

export const editPDF = async (data: EditPDFFormType) => {
    const { userId } = await auth();
    const client = await clerkClient();

    await validateTrainerAuthorization(client, userId);

    const { id, ...rest } = data;

    const updatedData = {
        ...rest,
        updatedAt: new Date()
    }

    await db.update(assessments).set(updatedData).where(eq(assessments.id, data.id));

    revalidatePath("/dashboard/assessments");
}