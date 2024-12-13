import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getEvaluations } from "./actions/get-evaluations";
import { getEvaluationPlayingLevelDist } from "./utils/get-evaluation-playing-level-dist";
import EvaluationsPlayingLevelDist from "./analytics/evaluations-playing-level-dist";
import { NewEvaluationsByMonth } from "./analytics/new-evaluations-by-month/new-evaluations-by-month";
import { getMonthlyEvaluationData } from "./utils/get-evaluations-by-month";

export default async function Page() {
    const data = await getEvaluations();

    const evaluationsPlayingLevelDist = getEvaluationPlayingLevelDist(data);

    const newEvaluationsByMonth = getMonthlyEvaluationData(data);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-4 justify-center">
                <EvaluationsPlayingLevelDist data={evaluationsPlayingLevelDist} totalEvaluations={data.length} />
                <NewEvaluationsByMonth newEvaluationsByMonth={newEvaluationsByMonth} />
            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}