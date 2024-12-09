import { redirect } from "next/navigation";

import OverallScore from "./data-visualizations/overall-score/overall-score";
import EvaluationReportHeader from "./evaluation-report-header/evaluation-report-header";
import EvaluationReportTrainerNotes from "./evaluation-report-trainer-notes/evaluation-report-trainer-notes";
import QuantScore from "./data-visualizations/quant-score/quant-score";

import { isAllowedToView } from "./actions/is-allowed-to-view";
import { getEvaluationReport } from "./actions/get-evaluation-report/get-evaluation-report";
import { removeTrailingZeros } from "./data-visualizations/quant-score/utils/util";

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
        <div className="flex flex-1 flex-col p-1">
            <div className="flex flex-row justify-center items-start gap-x-4 gap-y-4 flex-wrap">
                <EvaluationReportHeader 
                    evaluationName={evaluationReportData.evaluationName}
                    userName={evaluationReportData.userName ?? ""}
                    playingLevel={evaluationReportData.playingLevel ?? ""}
                    description={evaluationReportData.description ?? ""}
                    date={evaluationReportData.date}
                />
                <EvaluationReportTrainerNotes 
                    notes={evaluationReportData.notes ?? ""}
                    lastUpdated={evaluationReportData.lastUpdated}
                />
                <OverallScore 
                    totalPassingAssessments={totalPassingAssessments}
                    totalScoredAssessments={totalScoredAssessments}
                />
            </div>
            <div className="flex flex-row gap-x-4 gap-y-4 flex-wrap">
                <QuantScore 
                    name="Max Bench Press"
                    description="The max bench press assesses the athletes upper body strength capacity. Correlated with fastabll velocity."
                    unit="lbs"
                    score={removeTrailingZeros("320.000")}
                    standard={removeTrailingZeros("315.000")}
                    isPassing={true}
                    failDescription="The athlete needs to improve upper body strength. This may be a point of focus if wanting to increase fastball velocity"
                    passDescription="The athlete has shown adequate upper body strength. Maintain and may want to focus on other aspects of training"
                />
                <QuantScore 
                    name="Max Bench Press"
                    description="The max bench press assesses the athletes upper body strength capacity. Correlated with fastabll velocity."
                    unit="lbs"
                    score={removeTrailingZeros("275.000")}
                    standard={removeTrailingZeros("315.000")}
                    isPassing={false}
                    failDescription="The athlete needs to improve upper body strength. This may be a point of focus if wanting to increase fastball velocity.
                    The athlete needs to improve upper body strength. This may be a point of focus if wanting to increase fastball velocity"
                    passDescription="The athlete has shown adequate upper body strength. Maintain and may want to focus on other aspects of training"
                />
                <QuantScore 
                    name="Max Bench Press"
                    description="The max bench press assesses the athletes upper body strength capacity. Correlated with fastabll velocity."
                    unit="lbs"
                    score={removeTrailingZeros("475.205")}
                    standard={removeTrailingZeros("315.000")}
                    isPassing={true}
                    failDescription="The athlete needs to improve upper body strength. This may be a point of focus if wanting to increase fastball velocity"
                    passDescription="The athlete has shown adequate upper body strength. Maintain and may want to focus on other aspects of training"
                />
            </div>
        </div>
    );
}