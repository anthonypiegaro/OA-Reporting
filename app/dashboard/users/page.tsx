import { SelectUser, users } from "@/app/db/schema";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getUsers } from "@/app/db/queries/get-users/get-users";
import UserPlayingLevelDist from "./analytics/user-playing-level-dist";
import { NewUsersByMonth } from "./analytics/new-users-by-month/new-users-by-month";
import { getMonthlyUserData } from "./analytics/new-users-by-month/utils/get-new-users-by-month";

export default async function Page() {
    const data = await getUsers();

    const playingLevelDistData = data.reduce((acc, user) => {
        if (user.playingLevel === "high school") {
            acc[0].count += 1
        } else if (user.playingLevel === "college") {
            acc[1].count += 1
        } else if (user.playingLevel) {
            acc[2].count += 1
        }

        return acc;
    }, [
        { playingLevel: "high school", count: 0 },
        { playingLevel: "college", count: 0 },
        { playingLevel: "professional", count: 0 }
    ] as { playingLevel: SelectUser["playingLevel"], count: number }[]);

    const newUsersByMonthData = getMonthlyUserData(data);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-4 justify-center">
                <UserPlayingLevelDist data={playingLevelDistData} totalAthletes={data.length}/>
                <NewUsersByMonth newUsersByMonth={newUsersByMonthData}/>
            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}