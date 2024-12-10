"use client"

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
import PassFailIcon from "../pass-fail-icon";
import QuantScoreDialog from "./quant-score-dialog";

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
    url: string;
    score: number;
    standard: number;
    isPassing: boolean;
    failDescription: string;
    passDescription: string;
}

export default function QuantScore({ name, description, url, score, unit, standard, isPassing, failDescription, passDescription }: QuantScoreProps) {
    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <QuantScoreDialog 
                        name={name}
                        description={description}
                        score={score}
                        standard={standard}
                        unit={unit}
                        url={url}
                        isPassing={isPassing}
                        failDescription={failDescription}
                        passDescription={passDescription}
                    />
                    <PassFailIcon isPassing={isPassing} />
                </CardTitle>
                <CardDescription className="md:line-clamp-2 md:overflow-hidden md:text-ellipsis">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-lg font-md">
                    Score: {score} {unit}
                </div>
                <ChartContainer 
                    config={chartConfig}
                    className="mx-auto min-h-[200px] overflow-x-hidden -mx-2"
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
            <div className="text-muted-foreground md:line-clamp-2 md:overflow-hidden md:text-ellipsis pb-1">
                {isPassing ? passDescription : failDescription}
            </div>
        </CardFooter>
    </Card>
  )
}