"use client"

import { useState } from "react";
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
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import DropdownSelect from "./dropdown-select";
import { getTrendMessage } from "./utils/get-evaluation-trend-message";
import { MonthlyEvaluationData } from "./types";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-6))",
  },
  highSchool: {
    label: "High School",
    color: "hsl(var(--chart-7))",
  },
  college: {
    label: "College",
    color: "hsl(var(--chart-8))",
  },
  professional: {
    label: "Professional",
    color: "hsl(var(--chart-9))",
  },
} satisfies ChartConfig

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface NewEvaluationsByMonthProps {
  newEvaluationsByMonth: MonthlyEvaluationData[]
}

export function NewEvaluationsByMonth({ newEvaluationsByMonth }: NewEvaluationsByMonthProps) {
  const [showHighSchool, setShowHighSchool] = useState<Checked>(true);
  const [showCollege, setShowCollege] = useState<Checked>(true);
  const [showProfessional, setShowProfessional] = useState<Checked>(true);

  const processedData = newEvaluationsByMonth.map(monthData => {
    let total = 0;

    if (showHighSchool) total += monthData.highSchool;
    if (showCollege) total += monthData.college;
    if (showProfessional) total += monthData.professional;

    return {
      ...monthData,
      total: total
    }
  });

  const { trendMessage, trendUp } = getTrendMessage({
    includeHighSchool: showHighSchool as boolean,
    includeCollege: showCollege as boolean,
    includeProfessional: showProfessional as boolean,
    data: processedData.slice(-2)
  });

  const allAthleteLine = (
    <Line
      dataKey="total"
      type="natural"
      stroke="var(--color-total)"
      strokeWidth={2}
      dot={{
        fill: "var(--color-total)",
      }}
      activeDot={{
        r: 6,
      }}
    />
  );

  const highSchoolLine = (
    <Line
      dataKey="highSchool"
      type="natural"
      stroke="var(--color-highSchool)"
      strokeWidth={2}
      dot={{
        fill: "var(--color-highSchool)",
      }}
      activeDot={{
        r: 6,
      }}
    />
  );

  const collegeLine = (
    <Line
      dataKey="college"
      type="natural"
      stroke="var(--color-college)"
      strokeWidth={2}
      dot={{
        fill: "var(--color-college)",
      }}
      activeDot={{
        r: 6,
      }}
    />
  );

  const professionalLine = (
    <Line
      dataKey="professional"
      type="natural"
      stroke="var(--color-professional)"
      strokeWidth={2}
      dot={{
        fill: "var(--color-professional)",
      }}
      activeDot={{
        r: 6,
      }}
    />
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          Evaluations By Month
          <DropdownSelect 
            showHighSchool={showHighSchool}
            showCollege={showCollege}
            showProfessional={showProfessional}
            setShowHighSchool={setShowHighSchool}
            setShowCollege={setShowCollege}
            setShowProfessional={setShowProfessional}
          />
        </CardTitle>
        <CardDescription>{`${processedData[0].month} - ${processedData[11].month}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[150px] md:w-[500px] lg:w-[600px]">
          <LineChart
            accessibilityLayer
            data={processedData}
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
            {allAthleteLine}
            {showHighSchool && highSchoolLine}
            {showCollege && collegeLine}
            {showProfessional && professionalLine}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trendMessage} 
          {trendUp ? <TrendingUp className="h-4 w-4" /> :  <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing evaluations for the last year
        </div>
      </CardFooter>
    </Card>
  )
}
