"use client"

import { format } from "date-fns-tz";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle

} from "@/components/ui/card";

interface EvaluationReportHeaderProps {
    evaluationName: string;
    userName: string;
    playingLevel: string;
    description: string;
    date: Date;
}

export default function EvaluationReportHeader({ evaluationName, userName, playingLevel, description, date }: EvaluationReportHeaderProps) {
    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>
                    {evaluationName}
                </CardTitle>
                <CardDescription>
                    Athlete: {userName} | Playing Level: {playingLevel}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {description}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                Evaluation completed on {format(new Date(date), "MM/dd/yyyy")}
            </CardFooter>
        </Card>
    )
}