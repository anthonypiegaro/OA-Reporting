import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAssessments } from "../actions";

export default async function Page() {
    const data = await getAssessments();

    return (
        <div className="flex flex-col flex-1">
            <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}