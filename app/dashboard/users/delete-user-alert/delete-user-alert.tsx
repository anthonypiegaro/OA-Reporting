"use client"

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction, ToastProps } from "@/components/ui/toast";

import { deleteUser } from "./action";

interface HideAssessmentAlertProps {
    alertOpen: boolean;
    setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showToast: (props: ToastProps) => void;
    id: number;
    clerkId: string,
    name: string;
}

export default function DeleteUserAlert({ alertOpen, setAlertOpen, showToast, id, clerkId, name }: HideAssessmentAlertProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const onHideRequest = async (id: number) => {
        setIsSubmitting(true);

        await deleteUser({
                id: id,
                clerkId: clerkId
            })
            .then(() => {
                showToast({
                    title: "Success",
                    description: `${name} profile has been deleted successfully`
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
    }
    
    return (
        <AlertDialog open={alertOpen} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. 
                    This will permanently delete this user from all databases.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                <Button variant="destructive" disabled={isSubmitting} onClick={() => onHideRequest(id)}>
                    {isSubmitting ? "Deleting user..." : "Continue"}
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
    )
}