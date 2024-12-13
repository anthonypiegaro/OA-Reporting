"use client"

import { 
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import PassFailIcon from "../pass-fail-icon";

const chartConfig = {
    score: {
        label: "Score",
    },
    standard: {
        label: "Standard"
    }
} satisfies ChartConfig

interface QuantScoreDialogProps {
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

export default function QuantScoreDialog({ name, description, unit, url, score, standard, isPassing, failDescription, passDescription }: QuantScoreDialogProps) {
    const openAssessmentVideo = () => {
        window.open(url, "_blank")
    }

    return (
        <Dialog>
            <DialogTrigger>
                {name} ({unit})
            </DialogTrigger>
            <DialogContent className="h-[80vh] md:h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide pt-8">
                <DialogHeader>
                    <DialogTitle className="flex flex-row items-center justify-between">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={openAssessmentVideo}
                            className="text-lg font-semibold leading-none tracking-tight"
                        >
                            {name} ({unit})
                        </Button>
                        <PassFailIcon isPassing={isPassing} />
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-w-full">
                    <div className="text-lg font-md">
                        Score: {score} {unit}
                    </div>
                    <ChartContainer 
                        config={chartConfig}
                        className="min-h-[200px] max-w-full overflow-hidden -mx-2"
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
                </div>
                <DialogFooter>
                    {isPassing ? passDescription : failDescription}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}