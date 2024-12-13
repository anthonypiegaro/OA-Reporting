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
        playingLevel: users.playingLevel,
        date: evaluations.date,
        updatedAt: evaluations.updatedAt,
        createdAt: evaluations.createdAt
    })
    .from(evaluations)
    .innerJoin(users, eq(users.id, evaluations.userId))
    .orderBy(desc(evaluations.createdAt));