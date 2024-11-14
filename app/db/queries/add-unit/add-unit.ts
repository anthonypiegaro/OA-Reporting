import { db } from "@/app/db/db";
import { InsertUnit, units } from "@/app/db/schema";

export const addUnit = async (values: InsertUnit) => await db.insert(units).values(values);