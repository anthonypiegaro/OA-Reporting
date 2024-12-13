import { MonthlyEvaluationData } from "../analytics/new-evaluations-by-month/types";
import { EvaluationsType } from "../types";

export const getMonthlyEvaluationData = (evaluations: EvaluationsType[]): MonthlyEvaluationData[] => {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            month: date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear().toString().slice(-2),
            year: date.getFullYear(),
            monthIndex: date.getMonth()
        };
    }).reverse();

    const result: MonthlyEvaluationData[] = months.map(({ month }) => ({
        month,
        highSchool: 0,
        college: 0,
        professional: 0
    }));

    evaluations.forEach(evaluation => {
        if (evaluation.playingLevel && evaluation.createdAt) {
            const createdAtDate = new Date(evaluation.createdAt);

            const monthData = months.find(
                m => m.year === createdAtDate.getFullYear() && m.monthIndex === createdAtDate.getMonth()
            );

            if (monthData) {
                const index = months.indexOf(monthData);

                if (evaluation.playingLevel === "high school") {
                    result[index].highSchool++;
                } else if (evaluation.playingLevel === "college") {
                    result[index].college++;
                } else if (evaluation.playingLevel === "professional") {
                    result[index].professional++;
                }
            }
        }
    });

    return result;
}