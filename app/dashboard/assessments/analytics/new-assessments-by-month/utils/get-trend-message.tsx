export const getTrendMessage = ({
    previousMonth,
    currentMonth
}: {
    previousMonth: number,
    currentMonth: number
}) => {
    if (previousMonth === 0) {
        return {
            trendMessage: `Trending up by ${currentMonth} new ${currentMonth > 1 ? "assessments" : "assessment"} this month`,
            trendUp: true
        }
    }

    const percentChange = Math.round(((currentMonth - previousMonth) / previousMonth) * 100 * 10) / 10;

    return {
        trendMessage: `Trending ${percentChange < 0 ? "down" : "up"} by ${percentChange}% this month`,
        trendUp: percentChange < 0 ? false : true
    }
}