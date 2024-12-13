"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalTemplateCountCardProps {
    total: number;
}

export default function TotalTemplateCountCard({ total }: TotalTemplateCountCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Total All Time</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center">
                <div className="text-3xl font-bold">{total}</div>
                <div className="fill-muted-foreground">Templates</div>
            </CardContent>
        </Card> 
    )
}