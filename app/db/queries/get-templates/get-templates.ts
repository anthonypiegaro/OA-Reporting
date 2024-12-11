import { desc } from "drizzle-orm";
import { db } from "../../db";
import { templates } from "../../schema";

export const getTemplates = async () => await db.select().from(templates).orderBy(desc(templates.updatedAt));