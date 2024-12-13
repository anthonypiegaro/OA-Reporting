"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { users } from "@/app/db/schema";
import { validateTrainerAuthorization } from "@/components/utility/athorization/validate-trainer";

export const deleteUser = async ({ id, clerkId }: { id: number, clerkId: string }) => {
    const [userId, client] = await Promise.all([
        auth().then(res => res.userId),
        clerkClient()
    ]);

    await validateTrainerAuthorization(client, userId);

    await db.transaction(async (tsx) => {
        await tsx.delete(users).where(eq(users.id, id));

        await client.users.deleteUser(clerkId);
    });

    revalidatePath("/dashboard/users");
}