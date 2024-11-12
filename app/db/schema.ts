import { boolean, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
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

export const templates = pgTable("templates", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const assessmentTypeEnum = pgEnum("assessmentType", ["quantitative", "qualitative", "pdf"]);

export const assessments = pgTable("assessments", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    type: assessmentTypeEnum().notNull(),
    description: varchar("description", { length: 1000 }),
    url: varchar("url", { length: 1000 }),
    hidden: boolean().default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

const insertUser = createInsertSchema(users);
const selectUser = createSelectSchema(users);

export type InsertUser = z.infer<typeof insertUser>;
export type SelectUser = z.infer<typeof selectUser>;

const insertTemplate = createInsertSchema(templates);
const selectTemplate = createSelectSchema(templates);

export type InsertTemplate = z.infer<typeof insertTemplate>;
export type SelectTemplate = z.infer<typeof selectTemplate>;

export type Schema = {
    users: typeof users;
    templates: typeof templates;
}