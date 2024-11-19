"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

import { insertQualitativeAssessmentSchema, InsertQualitativeAssessment } from "./types";
import { addQualitativeAssessment } from "./action";

interface QualFormProps {
    handleSuccess: (name: string) => void;
}

export default function QualForm({ handleSuccess }: QualFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<InsertQualitativeAssessment>({
        resolver: zodResolver(insertQualitativeAssessmentSchema),
        defaultValues: {
            name: "",
            type: "qualitative",
            description: "",
            url: "",
            qualitativeScoreOptions: [
                {
                    assessmentId: 0, // This is a placeholder. Actual is assigned in the action.
                    score: "",
                    description: "",
                    isPassing: false,
                }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "qualitativeScoreOptions"
    });

    const onSubmit = async (values: InsertQualitativeAssessment) => {
        setIsSubmitting(true);

        await addQualitativeAssessment(values)
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
        })

        setIsSubmitting(false);
    }

    const addQualOption = () => {
        append({
            assessmentId: 0, // This is a placeholder. Actual is assigned in the action.
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
                                        {index > 0 && (
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
                        {isSubmitting ? "Adding Assessment" : "Add Assessment"}
                    </Button>
                </motion.div>
            </form>
        </Form>
    )
}