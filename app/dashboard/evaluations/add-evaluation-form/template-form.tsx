"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { List } from "react-movable";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { EvaluationForm } from "./types";
import { getTemplateData } from "../actions/get-template-data";
import { EvaluationFormSchema } from "./schema";
import QualitativeInput from "./Inputs/qualitative-input";
import PdfInput from "./Inputs/pdf-input";
import AddAssessmentButton from "../add-assessment-button/add-assessment-button";
import { AddEvaluationType, GetAssessmentsType } from "../types";
import { addEvaluation } from "../actions/add-evaluation";

interface TemplateFormProps {
    userId: number;
    date: Date;
    templateId: number;
    handleOpenChange: (open: boolean) => void;
    showToast: (title: string, description: string) => void;
}

export default function TemplateForm({ userId, date, templateId, handleOpenChange, showToast }: TemplateFormProps) {
    const { data, error, isError, isLoading } = useQuery({
        queryKey: ["templates", templateId],
        queryFn: async () => getTemplateData(templateId)
    });

    if (isLoading || !data) {
        return <>Loading...</>
    } else if (isError) {
        // show toast error
        return <>Error</>
    }

    const processedAssessments = data.assessments.map(assessment => {
        if (assessment.type === "quantitative") {
            return {
                ...assessment,
                score: ""
            }
        } else if (assessment.type === "qualitative") {
            return {
                ...assessment,
                score: null,
                qualitativeScoreId: null,
                description: null,
                isPassing: null
            }
        } else {
            return {
                ...assessment,
                score: null
            }
        }
    });

    const processedData: EvaluationForm = {
        userId: userId,
        date: date,
        name: data.name,
        description: data.description ?? "",
        notes: "",
        assessments: processedAssessments
    }

    return (
        <FormContent data={processedData} handleOpenChange={handleOpenChange} showToast={showToast} />
    )
}

interface FormContentProps {
    data: EvaluationForm;
    handleOpenChange: (open: boolean) => void;
    showToast: (title: string, description: string) => void;
}

function FormContent({ data, handleOpenChange, showToast }: FormContentProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<EvaluationForm>({
        resolver: zodResolver(EvaluationFormSchema),
        defaultValues: {
            ...data
        }
    });

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "assessments"
    });

    const onSubmit = async (values: EvaluationForm) => {
        setIsSubmitting(true);

        const processedData: AddEvaluationType = {
            userId: values.userId,
            date: values.date,
            name: values.name,
            description: values?.description ?? "",
            notes: values?.notes ?? "",
            assessments: values.assessments.map((assessment, index) => {
                if (assessment.type === "quantitative") {
                    return {
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        type: "quantitative",
                        score: assessment.score as string,
                        orderNumber: index
                    }
                } else if (assessment.type === "qualitative") {
                    return {
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        type: "qualitative",
                        optionId: assessment.qualitativeScoreId,
                        score: assessment.score as string,
                        description: assessment.description,
                        isPassing: assessment.isPassing,
                        orderNumber: index
                    }
                } else {
                    return {
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        type: "pdf",
                        score: assessment.score as File,
                        orderNumber: index
                    }
                }
            })
        }

        await addEvaluation(processedData)
        .then(() => {
            showToast("Success", "Evaluation has been succesfully created.");
            handleOpenChange(false);
        })
        .catch(error => {
            console.log(error);
            toast({
                variant: "destructive",
                title: `Uh Oh, an error occured`,
                description: error.message,
                action: <ToastAction altText="Try again" onClick={form.handleSubmit(onSubmit)}>Try Again</ToastAction>
            });
        });

        setIsSubmitting(false);
    }

    const handleAddAssessment = (assessment: GetAssessmentsType) => {
        if (assessment.type === "quantitative") {
            append({
                ...assessment,
                assessmentId: assessment.id,
                score: "",
                unit: assessment.unit
            })
        } else if (assessment.type === "qualitative") {
            append({
                ...assessment,
                assessmentId: assessment.id,
                score: null,
                qualitativeScoreId: null,
                description: null,
                isPassing: null
            })
        } else {
            append({
                ...assessment,
                assessmentId: assessment.id,
                score: null
            })
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4">
                <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Evaluation Name</FormLabel>
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
                            <FormLabel>Evaluation Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <List 
                    values={fields}
                    onChange={({ oldIndex, newIndex }) => move(oldIndex, newIndex)}
                    renderList={({ children, props, isDragged }) => (
                        <ul {...props}>
                            {children}
                        </ul>
                    )}
                    renderItem={({ value, index, props, isDragged }) => (
                        <motion.li
                            {...props}
                            key={value.id}
                            style={{
                                ...props.style,
                                listStyle: 'none',
                                cursor: isDragged ? 'grabbing' : 'grab',
                                position: props.style?.position || 'relative',
                                visibility: props.style?.visibility,
                                zIndex: isDragged ? 1000 : props.style?.zIndex
                            }}
                            className="mb-4"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex flex-row items-center justify-between">
                                        {value.name}
                                        <Button
                                            disabled={isSubmitting}
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            onClick={() => remove(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {value.type === "quantitative" && 
                                        <FormField 
                                            control={form.control}
                                            name={`assessments.${index as number}.score`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Score</FormLabel>
                                                    <FormControl>
                                                        <div className="flex flex-row items-center gap-x-4">
                                                            <Input {...field} type="number" disabled={isSubmitting} />
                                                            <span>{value.unit}</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                    {value.type === "qualitative" &&
                                        <QualitativeInput  
                                            form={form} 
                                            disabled={isSubmitting} 
                                            index={index as number}
                                            options={value.options}
                                        />
                                    }
                                    {value.type === "pdf" &&
                                        <FormField 
                                            control={form.control}
                                            name={`assessments.${index as number}.score`}
                                            render={({ field }) => <PdfInput field={field} disabled={isSubmitting} />}
                                        />
                                    }
                                </CardContent>
                            </Card>
                        </motion.li>
                    )}
                />
                <AddAssessmentButton onAddAssessment={handleAddAssessment} />
                <Button variant="outline" type="button" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                    {isSubmitting ? "Adding Evaluation" : "Add Evaluation"}
                </Button>
            </form>
        </Form>
    )
}