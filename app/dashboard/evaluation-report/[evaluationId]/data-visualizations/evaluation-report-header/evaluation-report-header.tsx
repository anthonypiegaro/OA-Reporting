"use client"

import { ReactNode } from "react";

interface EvaluationReportHeaderProps {
    children: ReactNode;
}

export default function EvaluationReportHeader({ children }: EvaluationReportHeaderProps) {
    return (
        <div className="flex flex-col max-w-full w-full">
            <h2 className="font-semibold leading-none tracking-tight text-xl mb-4 pl-4">Overview</h2>
            <div className="flex flex-row justify-center items-start gap-x-4 gap-y-4 flex-wrap w-full">
                {children}
            </div>
        </div>
    )
}