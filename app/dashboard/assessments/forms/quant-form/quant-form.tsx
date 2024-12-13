"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import UnitOptions from "./unit-options";
import { FormData } from "./type";
import AddUnitButton from "@/app/dashboard/assessments/forms/quant-form/add-unit-button";

import { addQuantitativeAssessment } from "./action";

interface QuantFormProps {
    handleSuccess: (name: string) => void;
}

export default function QuantForm({ handleSuccess }: QuantFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const form = useForm<FormData>({
        defaultValues: {
            name: "",
            type: "quantitative",
            description: "",
            url: "",
            unit: "",
            comparativeScore: "",
            comparisonType: "eq",
            failDescription: "",
            passDescription: ""
        }
    });

    const onSubmit = async (values: FormData) => {
        console.log(values)
        setIsSubmitting(true);
        await addQuantitativeAssessment(values)
            .then(() => {
                handleSuccess(values.name);
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh, an error occured",
                    description: error.message,
                    action: <ToastAction altText="Try again" onClick={form.handleSubmit(onSubmit)}>Try Again</ToastAction>
                });
            })
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
                <Button onClick={form.handleSubmit(onSubmit)} variant="outline" disabled={isSubmitting}>{isSubmitting ? "Adding Assessment" : "Add Assessment"}</Button>
            </form>
        </Form>
    )
}