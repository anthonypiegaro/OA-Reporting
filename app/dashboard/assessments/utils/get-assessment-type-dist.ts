import { SelectAssessment } from "@/app/db/schema";
import { AssessmentDistType } from "../analytics/assessment-type-dist";

export const getAssessmentTypeDist = (assessments: SelectAssessment[]): AssessmentDistType[] => {
    const assessmentTypeDist = assessments.reduce((acc, assessment) => {
            if (assessment.type === "quantitative") {
                acc[0].count += 1
            } else if (assessment.type === "qualitative") {
                acc[1].count += 1
            } else if (assessment.type === "pdf") {
                acc[2].count += 1
            }
    
            return acc;
        }, [
            { assessmentType: "quantitative", count: 0 },
            { assessmentType: "qualitative", count: 0 },
            { assessmentType: "pdf", count: 0 }
        ] as { assessmentType: SelectAssessment["type"], count: number }[]);

    return assessmentTypeDist;
}