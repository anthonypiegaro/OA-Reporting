import { SelectUser, users } from "@/app/db/schema";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getUsers } from "@/app/db/queries/GetUsers/get-users";
import UserPlayingLevelDist from "./analytics/user-playing-level-dist";


async function getData(): Promise<SelectUser[]> {
    const users = await getUsers();
    return users;
}

export default async function Page() {
    const data = await getData();

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
        { playingLevel: "profrssional", count: 0 }
    ] as { playingLevel: SelectUser["playingLevel"], count: number }[]);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-row">
                <UserPlayingLevelDist data={playingLevelDistData} totalAthletes={data.length}/>
            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}