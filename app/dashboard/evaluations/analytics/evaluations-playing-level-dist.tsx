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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { SelectUser } from "@/app/db/schema"

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

interface EvaluationsPlayingLevelDistProps {
  data: data[];
  totalEvaluations: number;
}

export default function EvaluationsPlayingLevelDist({ data, totalEvaluations }: EvaluationsPlayingLevelDistProps) {
  const coloredData = data.map(dist => ({
    ...dist,
    fill: chartConfig[dist.playingLevel]?.color || "gray"
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Evaluation's Playing Level Distribution</CardTitle>
        <CardDescription>All Evaluations</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 py-2">
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
              outerRadius={85}
              strokeWidth={25}
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
                          {totalEvaluations.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Evaluations
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="playingLevel" />}
              className="flex flex-row flex-wrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
