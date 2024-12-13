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
import { SelectAssessment } from "@/app/db/schema"

const chartConfig = {
  count: {
    label: "Count",
  },
  "quantitative": {
    label: "Quantitative",
    color: "hsl(var(--chart-6))",
  },
  qualitative: {
    label: "Qualitative",
    color: "hsl(var(--chart-7))",
  },
  pdf: {
    label: "Pdf",
    color: "hsl(var(--chart-8))",
  },
} satisfies ChartConfig

export type AssessmentDistType = {
  assessmentType: SelectAssessment["type"],
  count: number,
}

interface AssessmentTypeDistProps {
  data: AssessmentDistType[];
  totalAssessments: number;
}

export default function AssessmentTypeDist({ data, totalAssessments }: AssessmentTypeDistProps) {
  const coloredData = data.map(dist => ({
    ...dist,
    fill: chartConfig[dist.assessmentType]?.color || "gray"
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Assessment Type Distribution</CardTitle>
        <CardDescription>All Assessments</CardDescription>
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
              nameKey="assessmentType"
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
                          {totalAssessments.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Assessments
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="assessmentType" />}
              className="flex flex-row"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
