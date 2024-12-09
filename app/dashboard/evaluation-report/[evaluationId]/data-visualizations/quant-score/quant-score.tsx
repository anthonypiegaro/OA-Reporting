"use client"

import { CircleCheckBig, CircleX, ScrollText } from "lucide-react";
import { 
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis
} from "recharts";

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

const chartConfig = {
    score: {
        label: "Score",
    },
    standard: {
        label: "Standard"
    }
} satisfies ChartConfig

interface QuantScoreProps {
    name: string;
    description: string;
    unit: string;
    score: number;
    standard: number;
    isPassing: boolean;
    failDescription: string;
    passDescription: string;
}

export default function QuantScore({ name, description, score, standard, isPassing, failDescription, passDescription }: QuantScoreProps) {
    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    {name}
                    {isPassing ? 
                        <CircleCheckBig size={24} color="green" />
                    : 
                        <CircleX size={24} color="red" />
                    }
                </CardTitle>
                <CardDescription className="md:line-clamp-2 md:overflow-hidden md:text-ellipsis">{description}</CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer 
                config={chartConfig}
                className="mx-auto min-h-[200px]"
            >
                <BarChart
                    accessibilityLayer
                    data={[
                        {
                            score: score,
                            standard: standard
                        }
                    ]}
                    margin={{
                        top: 20,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="score" fill={isPassing ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"} radius={8} barSize={50}>
                        <LabelList
                            position="top"
                            offset={8}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                    <Bar dataKey="standard" fill="hsl(var(--chart-1))" radius={8} barSize={50}>
                        <LabelList
                            position="top"
                            offset={8}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground md:line-clamp-2 md:overflow-hidden md:text-ellipsis">
                    {isPassing ? passDescription : failDescription}
            </div>
        </CardFooter>
    </Card>
  )
}