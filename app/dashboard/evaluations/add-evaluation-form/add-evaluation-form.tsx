"use client"

import { useQuery } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { getTemplateData } from "../actions/get-template-data";
import { EvaluationPreFormType } from "../types";

interface AddEvaluationFormProps {
    initialData: EvaluationPreFormType | undefined;
    handleOpenChanges: (open: boolean) => void;
}

export default function AddEvaluationForm({ initialData, handleOpenChanges }: AddEvaluationFormProps) {
    const { toast } = useToast();
    const { data: templateData, isError, error, isLoading } = useQuery({
        queryKey: ["templateData", initialData?.templateId],
        queryFn: async () => getTemplateData(initialData?.templateId as number),
        enabled: initialData?.templateId ? true : false
    });

    let content = <></>;

    if (isError) {
        toast({
            variant: "destructive",
            title: "Uh oh, an error occured",
            description: `Error: ${error.message}`
        });
        // close the form
    }

    return (
        <Dialog open={initialData ? true : false} onOpenChange={handleOpenChanges}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Evaluation</DialogTitle>
                    <DialogDescription>
                        Fill out all required fields. Add assessments with the "Add Assessment" button at the bottom of the form.
                        Drag and drop to reorder the assessments.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    Form Content
                </div>
            </DialogContent>
        </Dialog>
    );
}