"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import NoTemplateForm from "./no-template-form";
import TemplateForm from "./template-form";
import { EvaluationPreFormType } from "../types";

interface AddEvaluationFormProps {
    initialData: EvaluationPreFormType | undefined;
    handleOpenChange: (open: boolean) => void;
}

export default function AddEvaluationForm({ initialData, handleOpenChange }: AddEvaluationFormProps) {
    const { toast } = useToast();
    const formOpen = initialData ? true : false;

    const showToast = (title: string, description: string) => {
        toast({
            title: title,
            description: description
        });
    }

    return (
        <Dialog open={formOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>Evaluation Form</DialogTitle>
                </DialogHeader>
                <div>
                    {initialData?.templateId
                        ?
                        <TemplateForm 
                            userId={initialData.userId} 
                            date={initialData.date} 
                            templateId={initialData.templateId}
                            handleOpenChange={handleOpenChange}
                            showToast={showToast}
                        />
                        :
                        <NoTemplateForm />
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}