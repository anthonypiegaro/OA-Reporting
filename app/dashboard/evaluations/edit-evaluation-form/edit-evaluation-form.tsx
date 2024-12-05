"use client"

import { Row } from "@tanstack/react-table";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast";

import { EvaluationsType } from "../types";
import EditForm from "./edit-form";

interface EditEvaluationFormProps {
    evalId: number | undefined;
    handleOpenChange: (open: boolean) => void;
    closeForm: () => void;
}

export default function EditEvaluationForm({ evalId, handleOpenChange, closeForm }: EditEvaluationFormProps) {
    const open = evalId ? true : false;
    const { toast } = useToast();

    const showToast = (title: string, description: string) => {
        toast({
            title: title,
            description: description
        });
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="overflow-y-auto scrollbar-hide">
                <SheetHeader>
                    <SheetTitle>Edit Evaluation</SheetTitle>
                </SheetHeader>
                {evalId && <EditForm evalId={evalId} showToast={showToast} closeForm={closeForm} />}
            </SheetContent>
        </Sheet>
    );
}