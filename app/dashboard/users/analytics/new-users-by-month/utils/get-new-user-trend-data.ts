import { MonthlyUserData } from "../types"

export const getTrendMessage = ({
    includeHighSchool,
    includeCollege,
    includeProfessional,
    data
}: {
    includeHighSchool: boolean,
    includeCollege: boolean,
    includeProfessional: boolean,
    data: MonthlyUserData[]
}) => {
    let previousMonth = 0;
    let currentMonth = 0;

    if (includeHighSchool) {
        previousMonth += data[0].highSchool;
        currentMonth += data[1].highSchool;
    }
    if (includeCollege) {
        previousMonth += data[0].college;
        currentMonth += data[1].college;
    }
    if (includeProfessional) {
        previousMonth += data[0].professional;
        currentMonth += data[1].professional;
    }

    if (previousMonth === 0) {
        return {
            trendMessage: `Trending up by ${currentMonth} new ${currentMonth > 1 ? "athletes" : "athlete"} this month`,
            trendUp: true
        }
    }

    const percentChange = Math.round(((currentMonth - previousMonth) / previousMonth) * 100 * 10) / 10;

    return {
        trendMessage: `Trending ${percentChange < 0 ? "down" : "up"} by ${percentChange}% this month`,
        trendUp: percentChange < 0 ? false : true
    }
}