import { redirect } from "next/navigation";
import OverallScore from "./data-visualizations/overall-score/overall-score";
import { isAllowedToView } from "./actions/is-allowed-to-view";
import { getEvaluationReport } from "./actions/get-evaluation-report/get-evaluation-report";

export default async function Page({
    params
}: {
    params: Promise<{ evaluationId: number }>
}) {
    const evaluationId = (await params).evaluationId;
    const isAuthorized = await isAllowedToView(evaluationId);

    if (!isAuthorized) {
        redirect("/dashboard")
    }

    const evaluationReportData = await getEvaluationReport(evaluationId);

    const { totalScoredAssessments, totalPassingAssessments} = evaluationReportData.assessments.reduce((acc, assessment) => {
        if (assessment.type === "quantitative" || assessment.type === "qualitative") {
            acc.totalScoredAssessments += 1;

            if (assessment.isPassing) {
                acc.totalPassingAssessments += 1;
            }
        }

        return acc;
    }, {
        totalScoredAssessments: 0,
        totalPassingAssessments: 0
    });

    return (
        <div className="flex flex-1 flex-wrap flex-row justify-center items-start gap-x-4 gap-y-4 md:justify-start">
            <OverallScore 
                evaluationName={evaluationReportData.evaluationName}
                totalPassingAssessments={totalPassingAssessments}
                totalScoredAssessments={totalScoredAssessments}
            />
            <OverallScore 
                evaluationName={evaluationReportData.evaluationName}
                totalPassingAssessments={totalPassingAssessments}
                totalScoredAssessments={totalScoredAssessments}
            />
            <OverallScore 
                evaluationName={evaluationReportData.evaluationName}
                totalPassingAssessments={totalPassingAssessments}
                totalScoredAssessments={totalScoredAssessments}
            />
            <OverallScore 
                evaluationName={evaluationReportData.evaluationName}
                totalPassingAssessments={totalPassingAssessments}
                totalScoredAssessments={totalScoredAssessments}
            />
        </div>
    );
}