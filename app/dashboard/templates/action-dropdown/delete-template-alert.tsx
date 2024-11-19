"use client"

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction, ToastProps } from "@/components/ui/toast";

import { deleteTemplate } from "./actions/delete-template";

interface HideAssessmentAlertProps {
    closeDropdown: () => void;
    alertOpen: boolean;
    setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showToast: (props: ToastProps) => void;
    id: number;
    name: string;
}

export default function DeleteTemplateAlert({ alertOpen, setAlertOpen, closeDropdown, showToast, id, name }: HideAssessmentAlertProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const onHideRequest = async (id: number) => {
        setIsSubmitting(true);

        await deleteTemplate(id)
            .then(() => {
                showToast({
                    title: "Success",
                    description: `${name} assessment has been hidden successfully`
                })
                setAlertOpen(false);
            })
            .catch(error => {
                console.log(error);
                toast({
                    variant: "destructive",
                    title: "Uh oh, an error occured",
                    description: error.message,
                    action: <ToastAction altText="Try again" onClick={() => onHideRequest(id)}>Try Again</ToastAction>
                });
            })

        setIsSubmitting(false);
    }

    const handleOpenChange = (open: boolean) => {
        setAlertOpen(open);
        if (!open) {
            closeDropdown();
        }
    }
    
    return (
        <AlertDialog open={alertOpen} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. 
                    This will permanently delete this template from all databases.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                <Button variant="destructive" disabled={isSubmitting} onClick={() => onHideRequest(id)}>
                    {isSubmitting ? "Deleting template..." : "Continue"}
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
    )
}

