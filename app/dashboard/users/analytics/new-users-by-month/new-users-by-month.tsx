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
import { getTrendMessage } from "./utils/get-new-user-trend-data";
import { MonthlyUserData } from "./types";

const chartData = [
  { month: "Jun 23", highSchool: 90, college: 110, professional: 14 },
  { month: "Jul 23", highSchool: 80, college: 103, professional: 3 },
  { month: "Aug 23", highSchool: 130, college: 150, professional: 25 },
  { month: "Sep 23", highSchool: 90, college: 120, professional: 27 },
  { month: "Oct 23", highSchool: 50, college: 15, professional: 8 },
  { month: "Nov 23", highSchool: 90, college: 100, professional: 19 },
  { month: "Dec 23", highSchool: 95, college: 105, professional: 14 },
  { month: "Jan 24", highSchool: 75, college: 95, professional: 16 },
  { month: "Feb 24", highSchool: 120, college: 160, professional: 25 },
  { month: "Mar 24", highSchool: 85, college: 125, professional: 27 },
  { month: "Apr 24", highSchool: 45, college: 18, professional: 10 },
  { month: "May 24", highSchool: 85, college: 100, professional: 24 },
]
const chartConfig = {
  athletes: {
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

interface NewUsersByMonthProps {
  newUsersByMonth: MonthlyUserData[]
}

export function NewUsersByMonth({ newUsersByMonth }: NewUsersByMonthProps) {
  const [showHighSchool, setShowHighSchool] = useState<Checked>(true);
  const [showCollege, setShowCollege] = useState<Checked>(true);
  const [showProfessional, setShowProfessional] = useState<Checked>(true);

  const processedData = newUsersByMonth.map(monthData => {
    let athletes = 0;

    if (showHighSchool) athletes += monthData.highSchool;
    if (showCollege) athletes += monthData.college;
    if (showProfessional) athletes += monthData.professional;

    return {
      ...monthData,
      athletes: athletes
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
      dataKey="athletes"
      type="natural"
      stroke="var(--color-athletes)"
      strokeWidth={2}
      dot={{
        fill: "var(--color-athletes)",
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
          New Athletes
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
          Showing new athletes for the last year
        </div>
      </CardFooter>
    </Card>
  )
}
