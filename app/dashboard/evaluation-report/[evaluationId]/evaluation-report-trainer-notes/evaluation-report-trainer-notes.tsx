"use client"

import { format } from "date-fns-tz";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

interface EvaluationReportTrainerNotesProps {
    lastUpdated: Date;
    notes: string;
}

export default function EvaluationReportTrainerNotes({ lastUpdated, notes }: EvaluationReportTrainerNotesProps) {
    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>Trainer Notes</CardTitle>
            </CardHeader>
            <CardContent>
                {notes.length > 0 ? notes : "No notes provided"}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                Report last updated on {format(new Date(lastUpdated), "MM/dd/yyyy")}
            </CardFooter>
        </Card>
    )
}