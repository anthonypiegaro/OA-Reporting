import { boolean, integer, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
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

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    hidden: boolean().default(false).notNull()
});

export const quantitativeComparisonTypeEnum = pgEnum("quantitativeComparisonType", [
    "lt",
    "lte",
    "eq",
    "gte",
    "gt"
]);

export const quantitativeAssessments = pgTable("quantitativeAssessments", {
    id: serial("id").primaryKey(),
    assessmentId: integer("assessmentId").notNull().unique().references(() => assessments.id),
    comparativeScore: numeric("comparativeScore", { precision: 7, scale: 3 }).notNull(),
    unit: varchar("unit", { length: 100 }).notNull().references(() => units.name),
    comparisonType: quantitativeComparisonTypeEnum().notNull(),
    failDescription: varchar("failDescription", { length: 5000 }),
    passDescription: varchar("passDescription", { length: 5000 })
});

export const qualitativeScoreOptions = pgTable("qualitativeScoreOptions", {
    id: serial("id").primaryKey(),
    assessmentId: integer("assessmentId").notNull().references(() => assessments.id),
    score: varchar("score", { length: 250 }).notNull(),
    description: varchar("description", { length: 5000 }).notNull(),
    isPassing: boolean("isPassing").notNull().default(false),
    hidden: boolean("hidden").notNull().default(false)
});

const insertUser = createInsertSchema(users);
const selectUser = createSelectSchema(users);

export type InsertUser = z.infer<typeof insertUser>;
export type SelectUser = z.infer<typeof selectUser>;

const insertTemplate = createInsertSchema(templates);
const selectTemplate = createSelectSchema(templates);

export type InsertTemplate = z.infer<typeof insertTemplate>;
export type SelectTemplate = z.infer<typeof selectTemplate>;

export const insertAssessment = createInsertSchema(assessments);
export const selectAssessment = createSelectSchema(assessments);

export type InsertAssessment = z.infer<typeof insertAssessment>;
export type SelectAssessment = z.infer<typeof selectAssessment>;

const insertUnit = createInsertSchema(units);
const selectUnit = createSelectSchema(units);

export type InsertUnit = z.infer<typeof insertUnit>;
export type SelectUnit = z.infer<typeof selectUnit>;

const insertQuantitativeAssessment = createInsertSchema(quantitativeAssessments);
const selectQuantitativeAssessment = createSelectSchema(quantitativeAssessments);

export type InsertQuantitativeAssessment = z.infer<typeof insertQuantitativeAssessment>;
export type SelectQuantitativeAssessment = z.infer<typeof selectQuantitativeAssessment>;

export const insertQualitativeScoreOption = createInsertSchema(qualitativeScoreOptions);
export const selectQualitativeScoreOption = createSelectSchema(qualitativeScoreOptions);

export type InsertQualitativeScoreOption = z.infer<typeof insertQualitativeScoreOption>;
export type SelectQualitativeScoreOption = z.infer<typeof selectQualitativeScoreOption>;

export type Schema = {
    users: typeof users;
    templates: typeof templates;
}