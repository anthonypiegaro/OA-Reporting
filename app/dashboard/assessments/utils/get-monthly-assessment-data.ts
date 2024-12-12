import { SelectAssessment } from "@/app/db/schema";
import { MonthlyNewAssessments } from "../types";

export const getMonthlyAssessmentData = (assessments: SelectAssessment[]): MonthlyNewAssessments[] => {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            month: date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear().toString().slice(-2),
            year: date.getFullYear(),
            monthIndex: date.getMonth()
        };
    }).reverse();

    const result: MonthlyNewAssessments[] = months.map(({ month }) => ({
        month,
        count: 0
    }));

    assessments.forEach(assessment => {
        if (assessment.createdAt) {
            const createdAtDate = new Date(assessment.createdAt);

            const monthData = months.find(
                m => m.year === createdAtDate.getFullYear() && m.monthIndex === createdAtDate.getMonth()
            );

            if (monthData) {
                const index = months.indexOf(monthData);

                result[index].count += 1;
            }
        }
    });

    return result;
}