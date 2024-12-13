"use server"

import { asc } from "drizzle-orm";
import { db } from "@/app/db/db";
import { templates } from "@/app/db/schema";

export const getTemplates = async () => await db.select({ id: templates.id, name: templates.name }).from(templates).orderBy(asc(templates.name));