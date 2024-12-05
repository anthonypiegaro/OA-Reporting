"use client"

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { DateInput } from "@/components/date-input/date-input";
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
import { List } from "react-movable";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";

import QualitativeInput from "./inputs/qualitative-input";
import AddAssessmentButton from "../add-assessment-button/add-assessment-button";

import { getEvaluation } from "../actions/get-evaluation";
import { EditEvalEditedPdfScore, EditEvalEditedQualScore, EditEvalEditedQuantScore, EditEvalEditedScore, EditEvalForm, EditEvalFormAssessment, EditEvalNewPdfScore, EditEvalNewQualScore, EditEvalNewQuantScore, EditEvalTopLevelData } from "./types";
import { editEvalForm } from "./schema";
import { GetAssessmentsType } from "../types";
import { simulateProcess } from "@/utils/simulateProcess";
import { toast } from "@/hooks/use-toast";
import { editEvaluation } from "../actions/edit-evaluation";

interface EditFormProps {
    evalId: number;
    showToast: (title: string, description: string) => void;
    closeForm: () => void;
}

export default function EditForm({ evalId, showToast, closeForm }: EditFormProps) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["evaluations", evalId],
        queryFn: async () => getEvaluation(evalId)
    });

    if (isLoading) {
        return <>Loading...</>
    }

    if (isError) {
        return <>{JSON.stringify(error)}</>
    }

    if (!data) {
        return <>Loading...</>
    }

    console.log("Data fetched for the form", data);

    return (
        <FormContent data={data} closeForm={closeForm} showToast={showToast} />
    )
}

interface FormContentProps {
    data: EditEvalForm,
    showToast: (title: string, description: string) => void;
    closeForm: () => void;
}

function FormContent({ data, showToast, closeForm }: FormContentProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const form = useForm<EditEvalForm>({
        resolver: zodResolver(editEvalForm),
        defaultValues: data
    });

    const onSubmit = async (formData: EditEvalForm) => {
        setIsSubmitting(true);
        // Will process the data here, get it ready for an efficient edit

        // Handle top level data
        const editedEvaluation: EditEvalTopLevelData = {
            id: formData.id,
            userId: formData.userId,
            updatedAt: new Date()
        }

        if (data.name !== formData.name) editedEvaluation.name = formData.name;
        if (data.description !== formData.description) editedEvaluation.description = formData.description;
        if (data.notes !== formData.notes) editedEvaluation.notes = formData.notes;

        // Handle assessment scores
        const deletedScoreIds: number[] = [];

        const newQuantScores: EditEvalNewQuantScore[] = [];
        const newQualScores: EditEvalNewQualScore[] = [];
        const newPdfScores: EditEvalNewPdfScore[] = [];

        const editedQuantScores: EditEvalEditedQuantScore[] = [];
        const editedQualScores: EditEvalEditedQualScore[] = [];
        const editedPdfScores: EditEvalEditedPdfScore[] = [];
    
        const formAssessments = formData.assessments.reduce((acc, assessment, index) => {
            if (assessment.id) {
                // add the edited assessment to the form assessment hashmap
                if (assessment.type === "quantitative") {
                    acc[assessment.id] = {
                        id: assessment.id,
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        orderNumber: index,
                        type: "quantitative",
                        score: assessment.score,
                        unit: assessment.unit
                    };
                } else if (assessment.type === "qualitative") {
                    acc[assessment.id] = {
                        id: assessment.id,
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        orderNumber: index,
                        type: "qualitative",
                        optionId: assessment.optionId,
                        score: assessment.score,
                        description: assessment.description,
                        isPassing: assessment.isPassing
                    };
                } else if (assessment.type === "pdf") {
                    acc[assessment.id] = {
                        id: assessment.id,
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        orderNumber: index,
                        type: "pdf",
                        score: assessment.score as File
                    };
                }
            } else {
                // add the new assessment score to the appropriate array
                if (assessment.type === "quantitative") {
                    newQuantScores.push({
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        orderNumber: index,
                        type: "quantitative",
                        score: assessment.score,
                        unit: assessment.unit
                    });
                } else if (assessment.type === "qualitative") {
                    newQualScores.push({
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        orderNumber: index,
                        type: "qualitative",
                        optionId: assessment.optionId,
                        score: assessment.score,
                        description: assessment.description,
                        isPassing: assessment.isPassing
                    });
                } else if (assessment.type === "pdf") {
                    newPdfScores.push({
                        assessmentId: assessment.assessmentId,
                        name: assessment.name,
                        orderNumber: index,
                        type: "pdf",
                        score: assessment.score as File
                    });
                }
            }
            
            return acc
        }, {} as Record<number, EditEvalEditedScore>)

        // iterate through initial data. Check if deleted or edited.
        data.assessments.forEach(assessment => {
            if (formAssessments[assessment.id as number]) {
                if (assessment.type === "quantitative") {
                    const editedScore: EditEvalEditedQuantScore = {
                        id: assessment.id as number
                    }

                    if (assessment.score !== formAssessments[assessment.id as number].score) editedScore.score = formAssessments[assessment.id as number].score as string;
                    if (assessment.orderNumber !== formAssessments[assessment.id as number].orderNumber) editedScore.orderNumber = formAssessments[assessment.id as number].orderNumber;
                    
                    if (Object.keys(editedScore).length > 1) editedQuantScores.push(editedScore);

                } else if (assessment.type === "qualitative") {
                    const editedScore: EditEvalEditedQualScore = {
                        id: assessment.id as number
                    }

                    if (assessment.orderNumber !== formAssessments[assessment.id as number].orderNumber) editedScore.orderNumber = formAssessments[assessment.id as number].orderNumber;
                    if (assessment.optionId !== formAssessments[assessment.id as number].optionId) editedScore.optionId = formAssessments[assessment.id as number].optionId;
                    if (assessment.score !== formAssessments[assessment.id as number].score) editedScore.score = formAssessments[assessment.id as number].score as string;
                    if (assessment.description !== formAssessments[assessment.id as number].description) editedScore.description = formAssessments[assessment.id as number].description;
                    if (assessment.isPassing !== formAssessments[assessment.id as number].isPassing) editedScore.isPassing = formAssessments[assessment.id as number].isPassing;

                    if (Object.keys(editedScore).length > 1) editedQualScores.push(editedScore)

                } else if (assessment.type === "pdf") {
                    // just checking for order number
                    const editedScore: EditEvalEditedPdfScore = {
                        id: assessment.id as number
                    }

                    if (assessment.orderNumber !== formAssessments[assessment.id as number].orderNumber) editedScore.orderNumber = formAssessments[assessment.id as number].orderNumber;
                    
                    if (Object.keys(editedScore).length > 1) editedPdfScores.push(editedScore);
    
                }
            } else {
                // since not found, must have been deleted
                deletedScoreIds.push(assessment.id as number);
            }
        });

        console.log("Here are the results of the edit:");
        console.log("Deleted Ids:", deletedScoreIds);
        console.log("New quant scores:", newQuantScores);
        console.log("New qual scores:", newQualScores);
        console.log("New pdf scores:", newPdfScores);
        console.log("Edited quant scores:", editedQuantScores);
        console.log("Edited qual scores:", editedQualScores);
        console.log("Edited pdf scores:", editedPdfScores);

        const editEvalData = {
            topLevelData: editedEvaluation,
            deletedScoreIds: deletedScoreIds,
            newQuantScores: newQuantScores,
            newQualScores: newQualScores,
            newPdfScores: newPdfScores,
            editedQuantScores: editedQuantScores,
            editedQualScores: editedQualScores,
            editedPdfScores: editedPdfScores
        }

        await editEvaluation(editEvalData)
        .then(() => {
            showToast(
                "Success",
                "Changes have been saved"
            );
            queryClient.invalidateQueries({ queryKey: ["evaluations", editedEvaluation.id] });
            closeForm();
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

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "assessments"
    });

    const handleAddAssessment = (assessment: GetAssessmentsType) => {
        if (assessment.type === "quantitative") {
            append({
                id: undefined,
                assessmentId: assessment.id,
                name: assessment.name,
                type: assessment.type,
                unit: assessment.unit,
                orderNumber: fields.length,
                score: ""
            });
        } else if (assessment.type === "qualitative") {
            append({
                id: undefined,
                assessmentId: assessment.id,
                name: assessment.name,
                type: assessment.type,
                options: assessment.options,
                score: null,
                optionId: null,
                description: null,
                isPassing: null,
                orderNumber: fields.length
            });
        } else {
            append({
                id: undefined,
                assessmentId: assessment.id,
                name: assessment.name,
                type: assessment.type,
                score: "",
                orderNumber: fields.length
            });
        }
    }

    return (
        <Form {...form} >
            <form className="space-y-4">
                <FormField 
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Evaluation Date</FormLabel>
                            <FormControl>
                                <DateInput 
                                    value={field.value} 
                                    onSelect={field.onChange} 
                                    disabled={isSubmitting} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormItem>
                                <Textarea {...field} disabled={isSubmitting} />
                            </FormItem>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <List 
                    values={fields}
                    onChange={({ oldIndex, newIndex }) => move(oldIndex, newIndex)}
                    renderList={({ children, props }) => (
                        <ul {...props} >
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
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Attach File</FormLabel>
                                                    {
                                                    form.getValues(`assessments.${index as number}.id`) &&
                                                    <FormDescription>
                                                        Cannot edit. To change, you can delete this assessment and add it again.
                                                        Then, you can attach the new file.
                                                    </FormDescription>
                                                    }
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type={form.getValues(`assessments.${index as number}.id`) ? "text" : "file"}
                                                            disabled={form.getValues(`assessments.${index as number}.id`) ? true : isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                </CardContent>
                            </Card>
                        </motion.li>
                    )}
                />
                <AddAssessmentButton onAddAssessment={handleAddAssessment} />
                <Button 
                    type="button" 
                    onClick={form.handleSubmit(onSubmit)} 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </Button>
            </form>
        </Form>
    );
}