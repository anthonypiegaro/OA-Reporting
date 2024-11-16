"use client"

import { useQuery } from "@tanstack/react-query";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { Row } from "@tanstack/react-table";
import { SelectAssessment } from "@/app/db/schema";
import { ToastProps } from "@/components/ui/toast";
import EditQualForm from "./edit-qual-form";
import { getQualitativeAssessmentScoreOptions } from "../actions/get-qual-assessment";
import { EditQualData } from "../types/edit-qual-type";

interface EditQualProps {
    showEditQual: boolean;
    row: Row<SelectAssessment>;
    handleEditOpenChange: (open: boolean) => void;
    showToast: (props: ToastProps) => void;
}

export default function EditQual({ showEditQual, row, handleEditOpenChange, showToast }: EditQualProps) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["assessments", row.getValue("id")],
        queryFn: async () => await getQualitativeAssessmentScoreOptions(row.getValue("id")),
        enabled: showEditQual
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
        const fullAssessmentData: EditQualData = {
            id: row.getValue("id"),
            name: row.getValue("name"),
            description: row.getValue("description"),
            url: row.getValue("url"),
            qualitativeScoreOptions: data
        }

        content = <EditQualForm
            data={fullAssessmentData} 
            showToast={showToast} 
            handleEditOpenChange={handleEditOpenChange}
        />
    }

    return (
        <Sheet open={showEditQual} onOpenChange={handleEditOpenChange}>
            <SheetContent className="overflow-y-auto scrollbar-hide">
                <SheetHeader>
                    <SheetTitle>Edit Qualitative Assessment</SheetTitle>
                </SheetHeader>
                <div>
                    {content}
                </div>
                </SheetContent>
        </Sheet>
    )
}