import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getDashboardData } from "./actions/get-dashboard-data"
import { DashboardData } from "./types";


export default async function Page() {
    const {
        userId,
        userName,
        playingLevel,
        evaluations
    }: DashboardData= await getDashboardData();


    return (
        <div className="flex flex-col flex-1 gap-y-4 overflow-y-auto scrollbar-hide">
            <div className="flex flex-row justify-center flex-wrap gap-x-4 gap-y-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Name</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userName}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Playing Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{playingLevel}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Evaluations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{evaluations.length}</div>
                    </CardContent>
                </Card>
            </div>
            <DataTable columns={columns} data={evaluations} />
        </div>
    )
}
