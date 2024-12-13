"use client"

import { useState } from "react";
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
import { ToastAction } from "@/components/ui/toast";

import { pdfFormSchema } from "./types";
import { InsertAssessment } from "@/app/db/schema";
import { addPDFAssessment } from "./action";

interface PdfFormProps {
    handleSuccess: (name: string) => void;
}

export default function PdfForm({ handleSuccess }: PdfFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const form = useForm<InsertAssessment>({
        resolver: zodResolver(pdfFormSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "pdf",
            url: ""
        }
    });

    const onSubmit = async (values: InsertAssessment) => {
        setIsSubmitting(true);

        await addPDFAssessment(values)
        .then(() => {
            handleSuccess(values.name);
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
                        {isSubmitting ? "Adding Assessment" : "Add Assessment"}
                </Button>
            </form>
        </Form>
    )
}