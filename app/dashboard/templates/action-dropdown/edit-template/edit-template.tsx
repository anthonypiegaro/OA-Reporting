"use client"

import { useQuery } from "@tanstack/react-query";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { Row } from "@tanstack/react-table";
import { SelectTemplate } from "@/app/db/schema";
import { ToastAction, ToastProps } from "@/components/ui/toast";
import { getTemplateAssessments } from "../actions/get-template-assessments";
import EditTemplateForm from "./edit-template-form";

interface EditTemplateProps {
    showEdit: boolean;
    row: Row<SelectTemplate>;
    handleEditOpenChange: (open: boolean) => void;
    showToast: (props: ToastProps) => void;
}

export default function EditTemplate({ showEdit, row, handleEditOpenChange, showToast }: EditTemplateProps) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["templates", row.getValue("id")],
        queryFn: async () => await getTemplateAssessments(row.getValue("id")),
        enabled: showEdit
    });

    return (
        <Sheet open={showEdit} onOpenChange={handleEditOpenChange}>
            <SheetContent className="overflow-y-auto scrollbar-hide">
                <SheetHeader>
                    <SheetTitle>Edit Template</SheetTitle>
                </SheetHeader>
                <div>
                    {
                        isLoading
                        ?
                        "Loading..."
                        :
                        data
                        ? 
                        <EditTemplateForm 
                            data={{
                                id: row.getValue("id"),
                                name: row.getValue("name"),
                                description: row.getValue("description"),
                                assessments: data
                            }} 
                            showToast={showToast} 
                            handleEditOpenChange={handleEditOpenChange} 
                        />
                        :
                        (
                            isError
                            ?
                            `An error occured ${JSON.stringify(error)}`
                            :
                            "Loading..."
                        )
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}