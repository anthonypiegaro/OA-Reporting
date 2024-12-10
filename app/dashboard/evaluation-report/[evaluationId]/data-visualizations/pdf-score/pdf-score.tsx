"use client"

import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

interface PdfScoreProps {
    name: string,
    description: string;
    url: string
}

export default function PdfScore({ name, description, url }: PdfScoreProps) {
    const openPdfReport = () => {
        if (url.length > 0) {
            window.open(url, "_blank");
        }
    }

    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription className="text-muted-foreground pb-1">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <Button type="button" variant="ghost" onClick={openPdfReport}>
                    View Report
                </Button>
            </CardContent>
        </Card>
    )
}