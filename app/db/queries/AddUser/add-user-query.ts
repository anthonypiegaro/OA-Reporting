import { PgTransaction } from "drizzle-orm/pg-core";

import { db } from "../../db";
import { users } from "../../schema";
import { InsertUser } from "../../schema";

export const addUser = async (values: InsertUser) => await db.insert(users).values(values).returning({
    userId: users.id,
    userEmail: users.email,
    playingLevel: users.playingLevel,
    role: users.role
});