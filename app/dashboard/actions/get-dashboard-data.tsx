"use server"

import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { evaluations, users } from "@/app/db/schema";
import { DashboardData } from "../types";

export const getDashboardData = async (): Promise<DashboardData> => {
    const { userId: clerkId } = await auth();

    if (clerkId === null) {
        throw new Error("There was an issue connecting to your user. Please contact your admin.")
    }

    const [{ id, name, playingLevel }] = await db.select({
            id: users.id,
            name: users.name,
            playingLevel: users.playingLevel
        })
        .from(users)
        .where(eq(users.clerkId, clerkId as string));
    
    const userEvals = await db.select().from(evaluations).where(eq(evaluations.userId, id)).orderBy(desc(evaluations.date));

    return {
        userId: id,
        userName: name,
        playingLevel,
        evaluations: userEvals
    }
}