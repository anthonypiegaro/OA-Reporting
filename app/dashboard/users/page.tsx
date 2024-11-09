import { SelectUser } from "@/app/db/schema";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getUsers } from "@/app/db/queries/GetUsers/get-users";


async function getData(): Promise<SelectUser[]> {
    const users = await getUsers();
    return users;
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