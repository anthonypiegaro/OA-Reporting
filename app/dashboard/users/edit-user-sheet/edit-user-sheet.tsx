"use client"

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { formSchema } from "./edit-user-schema";
import { SelectUser } from "@/app/db/schema";
import { Row } from "@tanstack/react-table";
import { toast, useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ActionData, editUser } from "./action";

interface EditUserSheetProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    row: Row<SelectUser>;
}

export default function EditUserSheet({ isOpen, setIsOpen, row }: EditUserSheetProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: row.getValue("id"),
            clerkId: row.getValue("clerkId"),
            name: row.getValue("name"),
            email: row.getValue("email"),
            playingLevel: row.getValue("playingLevel"),
            role: row.getValue("role")
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        // Only send the data that has changed
        const editedFields: ActionData = {
            id: values.id,
            clerkId: values.clerkId
        };

        for (const [key, value] of Object.entries(values)) {
            if (value !== row.getValue(key)) editedFields[key] = value;
        }

        await editUser(editedFields)
            .then((data) => {
                console.log(data.message);
                let description = "";

                if (values.name) {
                    description += `Name changed from ${row.getValue("name")} to ${values.name}. `
                }
                if (values.email) {
                    description += `Email changed from ${row.getValue("email")} to ${values.email}. `
                }
                if (values.role) {
                    description += `Role changed from ${row.getValue("role")} to ${values.role}. `
                }
                if (values.playingLevel) {
                    description += `Playing level changed from ${row.getValue("playingLevel")} to ${values.playingLevel}.`
                }

                toast({
                    title: `${values.name ? values.name : row.getValue("name")} has been edited successfully`,
                    description: description
                });
                setIsOpen(false);
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: `Uh Oh, an error occured`,
                    description: error.message,
                    action: <ToastAction altText="Try again" onClick={form.handleSubmit(onSubmit)}>Try Again</ToastAction>
                });
            });
        
        setIsSubmitting(false);
    }

    const handleOpenChange = (isOpen: boolean) => {
        setIsOpen(isOpen);
        form.reset();
    }

    const formContent = (
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} disabled />
                            </FormControl>
                            <FormDescription>Email currently not editable</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="playingLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Playing Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select playing level..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="high school">High School</SelectItem>
                                    <SelectItem value="college">College</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control} 
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="athlete">Athlete</SelectItem>
                                    <SelectItem value="trainer">Trainer</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving Changes" : "Save Changes"}</Button>
            </form>    
        </Form>
    )

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent side="right">
                <SheetHeader className="mb-4">
                    <SheetTitle>Edit User</SheetTitle>
                    <SheetDescription>
                        Make changes to the user here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                {formContent}
            </SheetContent>
        </Sheet>
    )
}
  