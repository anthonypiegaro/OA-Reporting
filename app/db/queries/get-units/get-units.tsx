import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/app/db/db";
import { units } from "@/app/db/schema";

export const getUnits = async () => {
        const result = await db.select().from(units).where(eq(units.hidden, false));
        return result;
}