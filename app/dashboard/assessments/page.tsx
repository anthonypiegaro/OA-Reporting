import { DataTable } from "./data-table";
import { columns } from "./columns";
import AssessmentTypeDist from "./analytics/assessment-type-dist";
import { NewAssessmentsByMonth } from "./analytics/new-assessments-by-month/new-assessments-by-month";
import { getAssessments } from "../actions";
import { getAssessmentTypeDist } from "./utils/get-assessment-type-dist";
import { getMonthlyAssessmentData } from "./utils/get-monthly-assessment-data";

export default async function Page() {
    const data = await getAssessments();

    const distData = getAssessmentTypeDist(data);

    const newAssessmentsByMonth = getMonthlyAssessmentData(data);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-4 justify-center">
                <AssessmentTypeDist data={distData} totalAssessments={data.length}/>
                <NewAssessmentsByMonth newAssessmentsByMonth={newAssessmentsByMonth}/>
            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}