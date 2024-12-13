"use server"

import { asc } from "drizzle-orm";
import { db } from "@/app/db/db";
import { users } from "@/app/db/schema";

export const getUsers = async () => await db.select({ id: users.id, name: users.name }).from(users).orderBy(asc(users.name));