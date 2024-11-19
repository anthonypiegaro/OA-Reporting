"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { List } from "react-movable";
import { X } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FilePlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { InsertTemplate } from "@/app/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AddAssessmentButton from "@/components/add-assessment-button/add-assessment-button";
import { simulateProcess } from "@/utils/simulateProcess";
import { addTemplate } from "./action";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { addTemplateSchema } from "./schemas";
import { AddTemplateAssessmentType, AddTemplateType } from "./types";

export default function AddTemplateForm() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const form = useForm<AddTemplateType>({
        resolver: zodResolver(addTemplateSchema),
        defaultValues: {
            name: "",
            description: "",
            assessments: []
        }
    });
    const { fields, remove, append, move } = useFieldArray({
        control: form.control,
        name: "assessments"
    });

    const onSubmit = async (values: AddTemplateType) => {
        setIsSubmitting(true);
        console.log(values);

        await addTemplate(values)
            .then((data) => {
                toast({
                    title: "Success",
                    description: `${values.name} has been added succussfully`
                });
                setOpen(false);
            })
            .catch((error) => {
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

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        form.reset();
    }

    const onAddAssessment = (assessment: AddTemplateAssessmentType) => {
        append(assessment);
    }

    const formContent =  (
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
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding Template" : "Add Template"}</Button>
                </motion.div>
            </form>
        </Form>
    )

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FilePlus /> Add Template
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>
                        Add Template
                    </DialogTitle>
                </DialogHeader>
                <div>
                    {formContent}
                </div>
            </DialogContent>
        </Dialog>
    )
}