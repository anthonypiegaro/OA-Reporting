"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { InsertUnit } from "@/app/db/schema";
import { useQueryClient } from "@tanstack/react-query";

export default function AddUnitButton() {
    const queryClient = useQueryClient();
    const { toast }= useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<InsertUnit>({
        defaultValues: {
            name: ""
        }
    });

    const onSubmit = async (values: InsertUnit) => {
        setIsSubmitting(true);
        await fetch("/api/add-unit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
        .then(() => {
            toast({
                title: "Success",
                description: `${values.name} has been added as a new unit.`
            });
            queryClient.invalidateQueries({ queryKey: ["units"] });
            setOpen(false);
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

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        form.reset();
    }

    const formContent = (
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
                            <FormDescription>Name of unit must be unique</FormDescription>
                            <FormControl>
                                <Input {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adding Unit" : "Add Unit"}
                </Button>
            </form>
        </Form>
    )

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Create New Unit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Unit</DialogTitle>
                </DialogHeader>
                <div>
                    {formContent}
                </div>
            </DialogContent>
        </Dialog>
    );
}