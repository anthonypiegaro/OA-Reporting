"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
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

import { addTemplate } from "./action";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function AddTemplateForm() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const form = useForm<InsertTemplate>({
        defaultValues: {
            name: "",
            description: ""
        }
    });

    const onSubmit = async (values: InsertTemplate) => {
        setIsSubmitting(true);

        await addTemplate(values)
            .then((data) => {
                toast({
                    title: "Success. Template Created",
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

    const formContent =  (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding Template" : "Add Template"}</Button>
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
            <DialogContent>
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