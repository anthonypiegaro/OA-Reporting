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

export const templateAssessment = pgTable("templateAssessment", {
    id: serial("id").primaryKey(),
    templateId: integer("templateId").notNull().references(() => templates.id, { onDelete: "cascade" }),
    assessmentId: integer("assessmentId").notNull().references(() => assessments.id, { onDelete: "cascade" }),
    orderNumber: integer("orderNumber").notNull()
});

export const evaluations = pgTable("evaluations", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().references(() => users.id),
    name: varchar("name", { length: 1000}).notNull(),
    description: varchar("description", { length: 5000 }),
    notes: text("notes"),
    date: timestamp("date").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

export const evaluationScores = pgTable("evaluationScores", {
    id: serial("id").primaryKey(),
    evaluationId: integer("evaluationId").notNull().references(() => evaluations.id, { onDelete: "cascade" }),
    assessmentId: integer("assessmentId").notNull().references(() => assessments.id),
    type: assessmentTypeEnum().notNull(),
    orderNumber: integer("orderNumber").notNull()
});

export const quantitativeEvaluationScores = pgTable("quantitativeEvaluationScores", {
    id: serial("id").primaryKey(),
    evaluationScoreId: integer("evaluationScoreId").notNull().references(() => evaluationScores.id, { onDelete: "cascade" }),
    score: numeric("score", { precision: 7, scale: 3 }).notNull(),
});

export const qualitativeEvaluationScores = pgTable("qualitativeEvaluationScores", {
    id: serial("id").primaryKey(),
    evaluationScoreId: integer("evaluationScoreId").notNull().references(() => evaluationScores.id, { onDelete: "cascade" }),
    qualitativeScoreId: integer("qualitativeScoreId").notNull().references(() => qualitativeScoreOptions.id),
    score: varchar("score", { length: 250 }).notNull(),
    description: varchar("description", { length: 5000 }),
    isPassing: boolean("isPassing").default(false).notNull()
});

export const pdfEvaluationScores = pgTable("pdfEvaluationScores", {
    id: serial("id").primaryKey(),
    evaluationScoreId: integer("evaluationScoreId").notNull().references(() => evaluationScores.id, { onDelete: "cascade" }),
    url: text("url").notNull()
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

export const insertTemplateAssessment = createInsertSchema(templateAssessment);
export const selectTemplateAssessment = createSelectSchema(templateAssessment);

export type InsertTemplateAssessment = z.infer<typeof insertTemplateAssessment>;
export type SelectTemplateAssessment = z.infer<typeof selectTemplateAssessment>;

export const insertEvaluation = createInsertSchema(evaluations);
export const selectEvaluation = createSelectSchema(evaluations);

export type InsertEvaluation = z.infer<typeof insertEvaluation>;
export type SelectEvaluation = z.infer<typeof selectEvaluation>;

export const insertEvaluationScore = createInsertSchema(evaluationScores);
export const selectEvaluationScore = createSelectSchema(evaluationScores);

export type InsertEvaluationScore = z.infer<typeof insertEvaluationScore>;
export type SelectEvaluationScore = z.infer<typeof selectEvaluationScore>;

export const insertQuantitativeEvaluationScore = createInsertSchema(quantitativeEvaluationScores);
export const selectQuantitativeEvaluationScore = createSelectSchema(quantitativeEvaluationScores);

export type InsertQuantitativeEvaluationScore = z.infer<typeof insertQuantitativeEvaluationScore>;
export type SelectQuantitativeEvaluationScore = z.infer<typeof selectQuantitativeEvaluationScore>;

export const insertQualitativeEvaluationScore = createInsertSchema(qualitativeEvaluationScores);
export const selectQualitativeEvaluationScore = createSelectSchema(qualitativeEvaluationScores);

export type InsertQualitativeEvaluationScore = z.infer<typeof insertQualitativeEvaluationScore>;
export type SelectQualitativeEvaluationScore = z.infer<typeof selectQualitativeEvaluationScore>;

export const insertPdfEvaluationScore = createInsertSchema(pdfEvaluationScores);
export const selectPdfEvaluationScore = createSelectSchema(pdfEvaluationScores);

export type InsertPdfEvaluationScore = z.infer<typeof insertPdfEvaluationScore>;
export type SelectPdfEvaluationScore = z.infer<typeof selectPdfEvaluationScore>;

export type Schema = {
    users: typeof users;
    templates: typeof templates;
}