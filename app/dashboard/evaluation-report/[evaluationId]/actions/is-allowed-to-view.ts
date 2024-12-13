"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { users, evaluations } from "@/app/db/schema";

const getEvaluationUser = async (evaluationId: number): Promise<number> => {
    const [data] = await db.select({ userId: evaluations.userId }).from(evaluations).where(eq(evaluations.id, evaluationId));

    return data.userId;
}

const getUserIdFromClerkId = async (clerkId: string): Promise<number> => {
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, clerkId));

    return user.id
}

export const isAllowedToView = async (evaluationId: number): Promise<boolean> => {
    const [client, clerkId, evaluationUserId] = await Promise.all([
        clerkClient(),
        auth().then(res => res.userId),
        getEvaluationUser(evaluationId)
    ]);

    if (!clerkId) {
        throw new Error("Forbidden: not signed in");
    }

    const user = await client.users.getUser(clerkId);

    const [userId, role] = await Promise.all([
        getUserIdFromClerkId(clerkId),
        user.privateMetadata.role
    ]);

    if (userId === evaluationUserId || role === "trainer") {
        return true;
    }

    return false;
} 