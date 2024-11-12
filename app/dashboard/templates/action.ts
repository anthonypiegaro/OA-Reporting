"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type Clerk } from "@clerk/backend";
import { db } from "@/app/db/db";
import { templates, InsertTemplate } from "@/app/db/schema";
import { PgTransaction } from "drizzle-orm/pg-core";
import { VercelPgQueryResultHKT } from "drizzle-orm/vercel-postgres";

const validateAuthorization = async (client: Clerk, callerId: string | null) => {
    if (!callerId) {
        throw new Error("Forbidden: not signed in");
    }

    const user = await client.users.getUser(callerId)
    const role = await user.privateMetadata.role

    if (role !== "trainer") {
        throw new Error("Forbidden: You do not have permission to add a Template");
    }
}

const addTemplateBase = async (tsx: PgTransaction<VercelPgQueryResultHKT>, values: InsertTemplate) => {
    await tsx.insert(templates).values(values);
}

const validateInputLength = (name: string, value: string) => {
    if (value.length > 1000) {
        throw new Error(`Error: ${name} value is too long`);
    }
}

export const addTemplate = async (values: InsertTemplate) => {
    const { userId: callerId } = await auth();
    const client = await clerkClient();

    await validateAuthorization(client, callerId);

    validateInputLength("name", values.name);
    validateInputLength("description", values.description ?? "");


    await db.transaction(async (tsx) => {
        await addTemplateBase(tsx, values);
    });

    const data = {
        message: "Template created successfully"
    }
    revalidatePath("/dashboard/templates");   
    return data;
}