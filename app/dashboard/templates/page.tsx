import { DataTable } from "./data-table";
import { columns } from "./columns";
import { SelectTemplate } from "@/app/db/schema";
import { getTemplates } from "@/app/db/queries/get-templates/get-templates";


async function getData(): Promise<SelectTemplate[]> {
    const data = await getTemplates();
    return data;
}

export default async function Page() {
    const data = await getData();

    return (
        <div className="flex flex-col flex-1">
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}