import { redirect } from "next/navigation";

import EvaluationReportHeader from "./data-visualizations/evaluation-report-header/evaluation-report-header";
import EvaluationReportMetaData from "./evaluation-report-metadata/evaluation-report-metadata";
import OverallScore from "./data-visualizations/overall-score/overall-score";
import EvaluationReportTrainerNotes from "./evaluation-report-trainer-notes/evaluation-report-trainer-notes";
import QuantScore from "./data-visualizations/quant-score/quant-score";
import QualScore from "./data-visualizations/qual-score/qual-score";
import PdfScore from "./data-visualizations/pdf-score/pdf-score";

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
        <div className="flex flex-1 flex-col gap-y-8 max-w-full box-border">
            <EvaluationReportHeader>
                <EvaluationReportMetaData
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
            </EvaluationReportHeader>
            <div className="pb-4">
                <h2 className="font-semibold leading-none tracking-tight text-xl mb-4 pl-4">Assessments</h2>
                <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-4 w-full">
                    {
                        evaluationReportData.assessments.map(assessment => {
                            if (assessment.type === "quantitative") {
                                return (
                                    <QuantScore
                                        key={assessment.id}
                                        name={assessment.name}
                                        description={assessment.description}
                                        url={assessment.url}
                                        score={removeTrailingZeros(assessment.score)}
                                        standard={removeTrailingZeros(assessment.passingScore)}
                                        unit={assessment.unit}
                                        isPassing={assessment.isPassing}
                                        failDescription={assessment.failDescription}
                                        passDescription={assessment.passDescription}
                                    />
                                )
                            } else if (assessment.type === "qualitative") {
                                return (
                                    <QualScore
                                        key={assessment.id}
                                        name={assessment.name}
                                        url={assessment.url}
                                        description={assessment.description}
                                        score={assessment.score}
                                        isPassing={assessment.isPassing}
                                        scoreDescription={assessment.scoreDescription}
                                    />
                                )
                            } else if (assessment.type === "pdf") {
                                return (
                                    <PdfScore 
                                        key={assessment.id}
                                        name={assessment.name}
                                        description={assessment.description}
                                        url={assessment.pdfUrl}
                                    />
                                )
                            }
                        })
                    }
                </div>
            </div>
        </div>
    );
}