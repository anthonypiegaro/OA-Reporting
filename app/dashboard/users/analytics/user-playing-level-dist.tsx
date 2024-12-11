"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { SelectUser } from "@/app/db/schema"
import { distance } from "framer-motion"

const chartConfig = {
  count: {
    label: "Count",
  },
  "high school": {
    label: "High School",
    color: "hsl(var(--chart-6))",
  },
  college: {
    label: "College",
    color: "hsl(var(--chart-7))",
  },
  professional: {
    label: "Professional",
    color: "hsl(var(--chart-8))",
  },
} satisfies ChartConfig

type data = {
  playingLevel: SelectUser["playingLevel"],
  count: number,
}

interface UserPlayingLevelDistProps {
  data: data[];
  totalAthletes: number;
}

export default function UserPlayingLevelDist({ data, totalAthletes }: UserPlayingLevelDistProps) {
  // add colors
  const coloredData = data.map(dist => ({
    ...dist,
    fill: chartConfig[dist.playingLevel]?.color || "gray"
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Athlete Playing Level Distribution</CardTitle>
        <CardDescription>All Athletes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={coloredData}
              dataKey="count"
              nameKey="playingLevel"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAthletes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Athletes
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
