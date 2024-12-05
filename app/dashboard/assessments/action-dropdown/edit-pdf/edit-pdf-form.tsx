"use client"

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ToastAction, ToastProps } from "@/components/ui/toast";

import { EditPDFFormType, PDFAssessment } from "../types/edit-pdf-types";
import { editPDFSchema } from "./schema";
import { editPDF } from "../actions/edit-pdf-assessment";

interface EditPdfFormProps {
    data: PDFAssessment;
    showToast: (props: ToastProps) => void;
    handleEditOpenChange: (open: boolean) => void;
}

export default function EditPdfForm({ data, showToast, handleEditOpenChange }: EditPdfFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const form = useForm<PDFAssessment>({
        resolver: zodResolver(editPDFSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            description: data.description,
            url: data.url
        }
    });

    const onSubmit = async (values: PDFAssessment) => {
        setIsSubmitting(true);

        const processedData: EditPDFFormType = {
            id: values.id
        }

        if (data.name !== values.name) processedData["name"] = values.name;

        if (data.description !== values.description) processedData["description"] = values.description;

        if (data.url !== values.url) processedData["url"] = values.url;

        await editPDF(processedData)
        .then(() => {
            showToast({
                title: "Changes Saved"
            });
            handleEditOpenChange(false);
        })
        .catch(error => {
            toast({
                variant: "destructive",
                title: "Uh oh, an error occured",
                description: error.message,
                action: <ToastAction altText="Try again" onClick={form.handleSubmit(onSubmit)}>Try Again</ToastAction>
            });
        });

        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form className="space-y-4">
                <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (optional)</FormLabel>
                            <FormDescription>
                                Provide a description of the assessment
                            </FormDescription>
                            <FormControl>
                                <Textarea {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link (optional)</FormLabel>
                            <FormDescription>
                                Add a link to a video or article
                            </FormDescription>
                            <FormControl>
                                <Input {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isSubmitting ? "Saving Changes" : "Save Changes"}
                </Button>
            </form>
        </Form>
    )
}