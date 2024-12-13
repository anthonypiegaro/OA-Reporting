"use server"

import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/app/db/db";
import { 
    assessments,
    qualitativeScoreOptions,
    templates, 
    templateAssessment,
    quantitativeAssessments
} from "@/app/db/schema";
import { ActionEvaluationForm } from "../add-evaluation-form/types";

export const getTemplateData = async (id: number): Promise<ActionEvaluationForm> => {
    const [templateData] = await db
        .select({
            name: templates.name,
            description: templates.description
        })
        .from(templates).where(eq(templates.id, id));
    
    const assessmentsInTemplate = await db
        .select({
            assessmentId: assessments.id,
            name: assessments.name,
            type: assessments.type,
            orderNumber: templateAssessment.orderNumber
        })
        .from(templateAssessment)
        .innerJoin(assessments, eq(templateAssessment.assessmentId, assessments.id))
        .where(eq(templateAssessment.templateId, id))
        .orderBy(asc(templateAssessment.orderNumber));
    
    // get all qualitative score options for all qualitative assessments

    const qualitativeAssessmentIds = assessmentsInTemplate
        .filter(assess => assess.type === "qualitative")
        .map(qualAssess => qualAssess.assessmentId);
    
    const options = await db
        .select({
            id: qualitativeScoreOptions.id,
            assessmentId: qualitativeScoreOptions.assessmentId,
            score: qualitativeScoreOptions.score,
            description: qualitativeScoreOptions.description,
            isPassing: qualitativeScoreOptions.isPassing
        })
        .from(qualitativeScoreOptions)
        .where(inArray(qualitativeScoreOptions.assessmentId, qualitativeAssessmentIds));
    
    const optionsByAssessment = options.reduce((acc, option) => {
        if (!acc[option.assessmentId]) {
            acc[option.assessmentId] = [];
        }

        const { assessmentId, ...rest } = option

        acc[assessmentId].push(rest);

        return acc;
    }, {} as Record<number, { id: number, score: string, description: string, isPassing: boolean }[]>);

    const quantIds = assessmentsInTemplate
        .filter(assess => assess.type === "quantitative")
        .map(quantAssess => quantAssess.assessmentId);

    const units = await db
        .select({
            assessmentId: quantitativeAssessments.assessmentId,
            unit: quantitativeAssessments.unit
        })
        .from(quantitativeAssessments)
        .where(inArray(quantitativeAssessments.assessmentId, quantIds));

    const unitsHashmap = units.reduce((acc, assessment) => {
        acc[assessment.assessmentId] = assessment.unit;

        return acc;
    }, {} as Record<number, string>);

    const assessmentsWithOptions = assessmentsInTemplate.map(assessment => {
        if (assessment.type === "qualitative") {
            return {
                ...assessment,
                options: optionsByAssessment[assessment.assessmentId]
            }
        } else if (assessment.type === "quantitative") {
            return {
                ...assessment,
                unit: unitsHashmap[assessment.assessmentId]
            }
        }

        return assessment;
    });

    return {
        ...templateData,
        assessments: assessmentsWithOptions
    }
}