"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { List } from "react-movable";
import { X } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction, ToastProps } from "@/components/ui/toast";
import AddAssessmentButton from "@/components/add-assessment-button/add-assessment-button";

import { editTemplateSchema } from "./schema";
import { EditTemplateAssessmentType, EditTemplateType } from "../types"
import { editTemplate } from "../actions/edit-template";

interface EditTemplateFormProps {
    data: EditTemplateType,
    showToast: (props: ToastProps) => void;
    handleEditOpenChange: (open: boolean) => void;
}

export default function EditTemplateForm({ data, showToast, handleEditOpenChange }: EditTemplateFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const form = useForm<EditTemplateType>({
        resolver: zodResolver(editTemplateSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            description: data.description,
            assessments: data.assessments
        }
    });
    const { fields, remove, append, move } = useFieldArray({
        control: form.control,
        name: "assessments"
    });

    const onSubmit = async (values: EditTemplateType) => {
        setIsSubmitting(true);

        await editTemplate(values)
        .then(() => {
            showToast({
                title: "Changes Saved"
            });
            handleEditOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ["templates"] });
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

    const onAddAssessment = (assessment: EditTemplateAssessmentType) => {
        append(assessment);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <motion.div layout className="space-y-4">
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
                                <Textarea {...field} disabled={isSubmitting} maxLength={1000}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </motion.div>
                <List 
                    values={fields}
                    onChange={({ oldIndex, newIndex }) => move(oldIndex, newIndex)}
                    renderList={({ children, props, isDragged }) => (
                        <ul {...props}>
                            {children}
                        </ul>
                    )}
                    renderItem={({ value: field, index, props, isDragged }) => (
                        <motion.li
                            exit={{ opacity: 0 }}
                            {...props}
                            key={field.id}
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
                                        {field.name}
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
                            </Card>
                        </motion.li>
                    )}
                />
                <motion.div layout>
                    <AddAssessmentButton onAddAssessment={onAddAssessment}/>
                </motion.div>
                <motion.div layout>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving Changes" : "Save Changes"}</Button>
                </motion.div>
            </form>
        </Form>
    )
}