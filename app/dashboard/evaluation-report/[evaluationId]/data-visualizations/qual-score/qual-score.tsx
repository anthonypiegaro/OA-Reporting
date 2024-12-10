"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import PassFailIcon from "../pass-fail-icon";
import QualScoreDialog from "./qual-score-dialog";

interface QualScoreProps {
    name: string;
    url: string;
    description: string;
    isPassing: boolean;
    score: string;
    scoreDescription: string;
}

export default function QualScore({ name, url, description, isPassing, score, scoreDescription }: QualScoreProps) {
    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="flex flex-row justify-between items-center">
                    <QualScoreDialog 
                        name={name}
                        url={url}
                        description={description}
                        isPassing={isPassing}
                        score={score}
                        scoreDescription={scoreDescription}
                    />
                    <PassFailIcon isPassing={isPassing} />
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                Score: {score}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="text-muted-foreground md:line-clamp-2 md:overflow-hidden md:text-ellipsis">
                        {scoreDescription}
                </div>
            </CardFooter>
        </Card>
    )
}