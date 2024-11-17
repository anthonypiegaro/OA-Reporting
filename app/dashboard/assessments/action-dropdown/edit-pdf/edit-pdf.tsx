"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { Row } from "@tanstack/react-table";
import { SelectAssessment } from "@/app/db/schema";
import { ToastProps } from "@/components/ui/toast";
import EditPdfForm from "./edit-pdf-form";
import { PDFAssessment } from "../types/edit-pdf-types";

interface EditPDFProps {
    showEditQual: boolean;
    row: Row<SelectAssessment>;
    handleEditOpenChange: (open: boolean) => void;
    showToast: (props: ToastProps) => void;
}

export default function EditPDF({ showEditQual, row, handleEditOpenChange, showToast }: EditPDFProps) {
    const fullAssessmentData: PDFAssessment = {
        id: row.getValue("id"),
        name: row.getValue("name"),
        description: row.getValue("description"),
        url: row.getValue("url"),
    }

    const content = <EditPdfForm
        data={fullAssessmentData} 
        showToast={showToast} 
        handleEditOpenChange={handleEditOpenChange}
    />

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