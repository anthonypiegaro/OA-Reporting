"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getTrendMessage } from "./utils/get-trend-message";
import { MonthlyNewAssessments } from "../../types";

const chartConfig = {
  count: {
    label: "Total",
    color: "hsl(var(--chart-6))",
  }
} satisfies ChartConfig

interface NewAssessmentsByMonthProps {
  newAssessmentsByMonth: MonthlyNewAssessments[]
}

export function NewAssessmentsByMonth({ newAssessmentsByMonth }: NewAssessmentsByMonthProps) {

  const { trendMessage, trendUp } = getTrendMessage({
    previousMonth: newAssessmentsByMonth[newAssessmentsByMonth.length - 2].count,
    currentMonth: newAssessmentsByMonth[newAssessmentsByMonth.length - 1].count
  });

  const assessmentsLine = (
    <Line
      dataKey="count"
      type="natural"
      stroke="var(--color-count)"
      strokeWidth={2}
      dot={{
        fill: "var(--color-count)",
      }}
      activeDot={{
        r: 6,
      }}
    />
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          New Assessments By Month
        </CardTitle>
        <CardDescription>{`${newAssessmentsByMonth[0].month} - ${newAssessmentsByMonth[11].month}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[150px] md:w-[500px] lg:w-[600px]">
          <LineChart
            accessibilityLayer
            data={newAssessmentsByMonth}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {assessmentsLine}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trendMessage} 
          {trendUp ? <TrendingUp className="h-4 w-4" /> :  <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing new assessments for the last year
        </div>
      </CardFooter>
    </Card>
  )
}
