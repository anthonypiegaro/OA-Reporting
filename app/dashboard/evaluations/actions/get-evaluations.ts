"use server"

import { desc, eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { evaluations, users } from "@/app/db/schema";
import { EvaluationsType } from "../types";

export const getEvaluations = async (): Promise<EvaluationsType[]> => await db
    .select({
        id: evaluations.id,
        name: evaluations.name,
        description: evaluations.description,
        userId: evaluations.userId,
        userName: users.name,
        date: evaluations.date,
        updatedAt: evaluations.updatedAt
    })
    .from(evaluations)
    .innerJoin(users, eq(users.id, evaluations.userId))
    .orderBy(desc(evaluations.createdAt));