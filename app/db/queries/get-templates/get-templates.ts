import { db } from "../../db";
import { templates } from "../../schema";

export const getTemplates = async () => await db.select().from(templates);