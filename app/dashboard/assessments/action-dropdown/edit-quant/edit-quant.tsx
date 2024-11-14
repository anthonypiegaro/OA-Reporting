"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { getQuantitativeAssessment } from "../actions/get-quant-assessments";
import { Row } from "@tanstack/react-table";
import { SelectAssessment } from "@/app/db/schema";
import { ToastProps } from "@/components/ui/toast";
import { EditQuantData } from "../types/edit-quant-type";
import EditQuantForm from "./edit-quant-form";

interface EditQuantProps {
    showEditQuant: boolean;
    row: Row<SelectAssessment>;
    handleEditOpenChange: (open: boolean) => void;
    showToast: (props: ToastProps) => void;
}

export default function EditQuant({ showEditQuant, row, handleEditOpenChange, showToast }: EditQuantProps) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["assessments", row.getValue("id")],
        queryFn: async () => await getQuantitativeAssessment(row.getValue("id"))
    });

    let content: React.ReactNode;

    if (isError) {
        showToast({
            variant: "destructive",
            title: "Uh oh, an error occured",
            description: `${error.message}`
        });
        handleEditOpenChange(false);
        content = <></>
    } else if (isLoading || !data) {
        content = (
            <>Loading...</>
        )
    } else {
        const fullAssessmentData: EditQuantData = {
            id: row.getValue("id"),
            name: row.getValue("name"),
            type: "quantitative",
            description: row.getValue("description"),
            url: row.getValue("url"),
            quantitativeId: data.id,
            unit: data.unit,
            comparativeScore: data.comparativeScore,
            comparisonType: data.comparisonType,
            failDescription: data.failDescription,
            passDescription: data.passDescription
        }

        content = <EditQuantForm 
            data={fullAssessmentData} 
            showToast={showToast} 
            handleEditOpenChange={handleEditOpenChange}
        />
    }

    return (
        <Sheet open={showEditQuant} onOpenChange={handleEditOpenChange}>
            <SheetContent className="overflow-y-auto scrollbar-hide">
                <SheetHeader>
                    <SheetTitle>Edit Quantitative Assessment</SheetTitle>
                </SheetHeader>
                <div>
                    {content}
                </div>
            </SheetContent>
        </Sheet>
    )
}