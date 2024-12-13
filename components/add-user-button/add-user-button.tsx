"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
    Form,
    FormControl,
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

import { AddUserAction } from "./actions";

import { formSchema } from "./form-schema";

export default function AddUserButton() {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            playingLevel: "college",
            role: "athlete"
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setSubmitting(true);

        await AddUserAction(values)
            .then((data) => {
                console.log(data.message);
                toast({
                    title: `${values.name} has been added as ${values.role === "trainer" ? "a Trainer" : "an Athlete"}`,
                    description: `${values.name} added with a playing level of ${values.playingLevel.charAt(0).toUpperCase() + values.playingLevel.slice(1)}
                                and email of ${values.email}.`
                });
                setOpen(false);
            })
            .catch(error => {
                toast({
                    variant: "destructive",
                    title: `Uh Oh, an error occured`,
                    description: error.message,
                    action: <ToastAction altText="Try again" onClick={form.handleSubmit(onSubmit)}>Try Again</ToastAction>
                });
            });

        setSubmitting(false);
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        form.reset();
    }

    const AddUserForm = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="my-6 space-y-4">
                <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={submitting} />
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
                                <Input {...field} disabled={submitting} />
                            </FormControl>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={submitting}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a playing level" />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={submitting}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
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
                <Button type="submit" disabled={submitting}>{submitting ? "Submitting" : "Submit"}</Button>
            </form>
        </Form>
    )

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <UserRoundPlus /> Add User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add User
                    </DialogTitle>
                </DialogHeader>
                <div>
                    {AddUserForm}
                </div>
            </DialogContent>
        </Dialog>
    );
}