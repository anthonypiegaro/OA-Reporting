"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ToastAction, ToastProps } from "@/components/ui/toast";
import { EditQualData, editQualitativeAssessmentSchema, FullyProcessedQualitativeAssessment, QualAssessment } from "../types/edit-qual-type";
import { simulateProcess } from "@/utils/simulateProcess";
import { getAssessmentDiffs, getDeletedScoreOptionIds, getScoreOptionDiffs } from "./utils";
import { Description } from "@radix-ui/react-toast";
import { qualitativeScoreOptions } from "@/app/db/schema";
import { editQualitativeAssessment } from "../actions/edit-qual-assessment";

interface EditQualFormProps {
    data: EditQualData;
    showToast: (props: ToastProps) => void;
    handleEditOpenChange: (open: boolean) => void;
}


export default function EditQualForm({ data, showToast, handleEditOpenChange }: EditQualFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient()

    const form = useForm<QualAssessment>({
        resolver: zodResolver(editQualitativeAssessmentSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            description: data.description,
            url: data.url,
            qualitativeScoreOptions: data.qualitativeScoreOptions
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "qualitativeScoreOptions"
    });

    const onSubmit = async (values: QualAssessment) => {
        setIsSubmitting(true);

        const deletedIds = getDeletedScoreOptionIds(data.qualitativeScoreOptions, values.qualitativeScoreOptions);
        const processedOptions = getScoreOptionDiffs(data.qualitativeScoreOptions, values.qualitativeScoreOptions);

        const oldData = {
            id: data.id,
            name: data.name,
            description: data.description,
            url: data.url
        }
        const newData = {
            id: values.id,
            name: values.name,
            description: values.description,
            url: values.url
        }
        const processedAssessment = getAssessmentDiffs(oldData, newData);

        const fullyProcessedData: FullyProcessedQualitativeAssessment = {
            ...processedAssessment,
            options: processedOptions,
            deletedIds: deletedIds
        }

        await editQualitativeAssessment(fullyProcessedData)
        .then(() => {
            showToast({
                title: "Changes Saved"
            });
            handleEditOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ["assessments"] });
        })
        .catch(error => {
            toast({
                variant: "destructive",
                title: "Uh oh, an error occured",
                description: error.message,
                action: <ToastAction altText="Try again" onClick={form.handleSubmit(onSubmit)}>Try Again</ToastAction>
            });
        })

        setIsSubmitting(false);
    }

    const addQualOption = () => {
        append({
            id: undefined,
            score: "",
            description: "",
            isPassing: false,
        });
    }
    
    const removeQualOption = (index: number) => {
        remove(index);
    }

    return (
        <Form {...form}>
            <form  className="space-y-4">
                <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                {fields.map((field, index) => (
                    <AnimatePresence key={field.id}>
                        <motion.div layout exit={{ opacity: 0 }} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex flex-row items-center justify-between">
                                        {`Option ${index + 1}`}
                                        {fields.length > 1 && (
                                            <Button
                                                disabled={isSubmitting}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeQualOption(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField 
                                        control={form.control}
                                        name={`qualitativeScoreOptions.${index}.score`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Score</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control}
                                        name={`qualitativeScoreOptions.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control}
                                        name={`qualitativeScoreOptions.${index}.isPassing`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between space-y-4">
                                                <div>
                                                    <FormLabel>
                                                        Is Passing Score
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Select if this option is considered a passing score.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch 
                                                        checked={field.value} 
                                                        onCheckedChange={field.onChange} 
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                ))}
                <motion.div layout>
                    <Button type="button" variant="outline" onClick={() => addQualOption()} disabled={isSubmitting}>
                        Add option
                    </Button>
                </motion.div>
                <motion.div layout>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isSubmitting ? "Saving Changes" : "Save Changes"}
                    </Button>
                </motion.div>
            </form>
        </Form>
    )
}