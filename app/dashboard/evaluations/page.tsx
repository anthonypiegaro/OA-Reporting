import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getEvaluations } from "./actions/get-evaluations";

export default async function Page() {
    const data = await getEvaluations();

    return (
        <div className="flex flex-col flex-1">
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}