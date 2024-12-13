"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { templates } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";

export const deleteTemplate = async (id: number) => {
    const { userId } = await auth();
    const client = await clerkClient();

    await validateTrainerAuthorization(client, userId);

    await db.delete(templates).where(eq(templates.id, id));

    revalidatePath("/dashboard/templates");
}