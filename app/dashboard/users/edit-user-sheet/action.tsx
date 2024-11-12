"use server"

import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { users } from "@/app/db/schema";

export type ActionData = {
    id: number;
    clerkId: string;
    name?: string;
    email?: string;
    playingLevel?: "high school" | "college" | "professional";
    role?: "athlete" | "trainer";
}

export async function editUser(values: ActionData) {
    const { userId } = await auth();

    if (!userId) {
        return new Error("Forbidden: not signed in");
    }

    const client = await clerkClient();

    const clerkUser = await client.users.getUser(userId);
    const userRole = clerkUser.privateMetadata.role;

    if (userRole !== "trainer") {
        throw new Error("Forbidden: You do not have persmission to edit users.");
    }

    await db.transaction(async (tsx) => {
        await tsx.update(users).set({...values, updatedAt: new Date()}).where(eq(users.id, values.id))
    });

    const publicMetadata: Partial<ActionData> = {};
    const privateMetadata: Pick<ActionData, "role"> = {};

    if (values.name) {
        publicMetadata.name = values.name;
    }
    if (values.playingLevel) {
        publicMetadata.playingLevel = values.playingLevel;
    }
    if (values.role) {
        privateMetadata.role = values.role;
    }

    await client.users.updateUserMetadata(values.clerkId, {
        publicMetadata,
        privateMetadata
    });

    if (values.email) {
        await client.emailAddresses.createEmailAddress({
            userId: values.clerkId,
            emailAddress: values.email
        });
    }

    revalidatePath("/dashboard/users");
    const data = { 
        message: "User edited successfully",
    };
    return data;
}