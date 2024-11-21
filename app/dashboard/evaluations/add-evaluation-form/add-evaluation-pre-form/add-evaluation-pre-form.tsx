"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
} from "@/components/ui/form";
import SelectDate from "./select-date";
import SelectTemplate from "./select-template";
import SelectUser from "./select-user";

import { evaluationPreFormSchema } from "./schema";
import { EvaluationPreFormType } from "./types";

interface AddEvaluationPreformProps {
    setData: (values: EvaluationPreFormType) => void;
}


export default function AddEvaluationPreForm({ setData }: AddEvaluationPreformProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<EvaluationPreFormType>({
        resolver: zodResolver(evaluationPreFormSchema),
    });

    const onSubmit = (values: EvaluationPreFormType) => {
        console.log(values);
        setOpen(false);
        setData(values);
        form.reset();
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open);

        if (open === false) {
            form.reset();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" type="button">
                    <ClipboardPlus />
                    Add Evaluation
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Up</DialogTitle>
                    <DialogDescription>
                        Select options to start the evaluation.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <SelectUser field={field} />
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <SelectDate field={field} />
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="templateId"
                            render={({ field }) => (
                                <SelectTemplate field={field} />
                            )}
                        />
                        <Button 
                            variant="outline" 
                            type="button" 
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            Start Evaluation
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}