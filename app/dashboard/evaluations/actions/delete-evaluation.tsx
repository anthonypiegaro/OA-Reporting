"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { evaluations } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";

export const deleteEvaluation = async (id: number) => {
    const [client, userId] = await Promise.all([
        clerkClient(),
        auth().then(res => res.userId)
    ]);

    await validateTrainerAuthorization(client, userId);

    await db.delete(evaluations).where(eq(evaluations.id, id));

    revalidatePath("/dashboard/evaluations");
}