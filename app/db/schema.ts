import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    playingLevel: text("playingLevel", { enum: ["high school", "college", "professional"] }).default("college"),
    role: text("role", { enum: ["athlete", "trainer"] }).default("athlete"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    clerkId: text("clerkId").unique()
});

const insertUser = createInsertSchema(users);
const selectUser = createSelectSchema(users);

export type InsertUser = z.infer<typeof insertUser>;
export type SelectUser = z.infer<typeof selectUser>;