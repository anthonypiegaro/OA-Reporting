import { redirect } from "next/navigation";
import { isAllowedToView } from "./actions/is-allowed-to-view";
import { getEvaluationReport } from "./actions/get-evaluation-report/get-evaluation-report";

export default async function Page({
    params
}: {
    params: Promise<{ evaluationId: number }>
}) {
    const evaluationId = (await params).evaluationId;
    const isAuthorized = await isAllowedToView(evaluationId);
    const evaluationReportData = await getEvaluationReport(evaluationId);

    if (!isAuthorized) {
        redirect("/dashboard")
    }

    return <div>{JSON.stringify(evaluationReportData)}</div>
}