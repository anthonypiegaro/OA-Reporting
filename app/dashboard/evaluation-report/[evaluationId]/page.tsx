import { redirect } from "next/navigation";
import { isAllowedToView } from "./actions/is-allowed-to-view";

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

    return <div>{evaluationId}</div>
}