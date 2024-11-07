"use server"
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { users, InsertUser } from "@/app/db/schema";

export const AddUserAction = async (values: InsertUser, req: Request) => {
    const { userId } = await auth();

    if (!userId) {
        return new Error("Forbudden: not signed in");
    }

    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const userRole = clerkUser.privateMetadata.role;

    if (userRole !== "trainer") {
        throw new Error("Forbidden: You do not have persmission to create users.");
    }

    await db.transaction(async (tsx) => {
        const [user] = await tsx.insert(users).values(values).returning({
            userId: users.id,
            userName: users.name,
            userEmail: users.email,
            playingLevel: users.playingLevel,
            role: users.role
        });

        const clerkUser = await (await clerkClient()).users.createUser({
            emailAddress: [user.userEmail],
            password: "OptimumAthlete*123",
            publicMetadata: {
                name: user.userName,
                playingLevel: user.playingLevel,
                needsToResetPassword: true
            },
            privateMetadata: {
                role: user.role
            }
        }).catch(error => {
            console.error('Clerk API error:', error.errors || error.message || error);
            throw new Error('Failed to create Clerk user');
        })

        await tsx.update(users).set({ clerkId: clerkUser.id }).where(eq(users.id, user.userId));
    });
    const data = { 
        message: "User added successfully",
    };
    return data;
}