import { SelectUser } from "@/app/db/schema";
import { MonthlyUserData } from "../types";

export const getMonthlyUserData = (users: SelectUser[]): MonthlyUserData[] => {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            month: date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear().toString().slice(-2),
            year: date.getFullYear(),
            monthIndex: date.getMonth()
        };
    }).reverse();

    const result: MonthlyUserData[] = months.map(({ month }) => ({
        month,
        highSchool: 0,
        college: 0,
        professional: 0
    }));

    users.forEach(user => {
        if (user.playingLevel && user.createdAt) {
            const createdAtDate = new Date(user.createdAt);

            const monthData = months.find(
                m => m.year === createdAtDate.getFullYear() && m.monthIndex === createdAtDate.getMonth()
            );

            if (monthData) {
                const index = months.indexOf(monthData);

                if (user.playingLevel === "high school") {
                    result[index].highSchool++;
                } else if (user.playingLevel === "college") {
                    result[index].college++;
                } else if (user.playingLevel === "professional") {
                    result[index].professional++;
                }
            }
        }
    });

    return result;
}