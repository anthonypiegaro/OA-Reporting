import { desc } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../schema";

export const getUsers = async () => await db.select().from(users).orderBy(desc(users.createdAt));