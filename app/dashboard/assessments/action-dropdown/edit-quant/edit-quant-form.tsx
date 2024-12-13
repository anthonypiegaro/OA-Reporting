"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ToastAction, ToastProps } from "@/components/ui/toast";
import AddUnitButton from "../../forms/quant-form/add-unit-button";
import UnitOptions from "../../forms/quant-form/unit-options";
import { EditQuantData, ProcessedEditQuantData } from "../types/edit-quant-type";
import { editQuantitativeAssessment } from "../actions/edit-quant-assessment";
import { useQueryClient } from "@tanstack/react-query";

interface EditQuantFormProps {
    data: EditQuantData;
    showToast: (props: ToastProps) => void;
    handleEditOpenChange: (open: boolean) => void;
}

export default function EditQuantForm({ data, showToast, handleEditOpenChange }: EditQuantFormProps) {
    const client = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<EditQuantData>({
        defaultValues: {
            id: data.id,
            name: data.name,
            type: "quantitative",
            description: data.description,
            url: data.url,
            unit: data.unit,
            comparativeScore: data.comparativeScore,
            comparisonType: data.comparisonType,
            failDescription: data.failDescription,
            passDescription: data.passDescription
        }
    });
    const { toast } = useToast();

    const onSubmit = async (values: EditQuantData) => {
        setIsSubmitting(true);

        const processedData: ProcessedEditQuantData = {
            id: data.id,
            quantitativeId: data.quantitativeId,
        }

        // add fields to processedData, only ones that changed from original value
        for (const [key, value] of Object.entries(values)) {
            if (value !== data[key]) processedData[key] = value
        }
        
        console.log("Data to send:", processedData);

        await editQuantitativeAssessment(processedData)
        .then(() => {
            showToast({
                title: "Changes Saved"
            });
            handleEditOpenChange(false);
            client.invalidateQueries({ queryKey: ["assessments"] });
        })
        .catch(error => {
            toast({
                variant: "destructive",
                title: "Uh oh, an error occured",
                description: `${error.message}`,
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
                    rules={{
                        required: "Name is required"
                    }}
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
                <FormField
                    control={form.control}
                    name="unit"
                    rules={{
                        required: "Unit is required"
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                <FormControl>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Select a unit" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <UnitOptions />
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            <AddUnitButton />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="comparativeScore"
                    rules={{
                        required: "Comparative score is required"
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comparative Score</FormLabel>
                            <FormDescription>Comparative score is the score that will be used for comparing the user score as a pass or fail.</FormDescription>
                            <FormControl>
                                <Input {...field} type="number" disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="comparisonType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Comparison Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select comparison type..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="lt">Less than</SelectItem>
                                    <SelectItem value="lte">Less than or equal to</SelectItem>
                                    <SelectItem value="eq">Equal to</SelectItem>
                                    <SelectItem value="gte">Greater than or equal to</SelectItem>
                                    <SelectItem value="gt">Greater than</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="passDescription"
                    rules={{
                        required: "Passing description is required"
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pass Description</FormLabel>
                            <FormDescription>
                                Provide a description for a passing score
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
                    name="failDescription"
                    rules={{
                        required: "Faililng description is required"
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fail Description</FormLabel>
                            <FormDescription>
                                Provide a description for a failing score
                            </FormDescription>
                            <FormControl>
                                <Textarea {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>{isSubmitting ? "Saving Changes" : "Save Changes"}</Button>
            </form>
        </Form>
    )
}