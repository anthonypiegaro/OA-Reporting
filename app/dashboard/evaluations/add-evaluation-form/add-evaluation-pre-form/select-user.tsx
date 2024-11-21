"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { 
    FormControl,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { getUsers } from "../../actions/get-users";
import { EvaluationPreFormType } from "./types";

interface SelectUserProps {
    field: ControllerRenderProps<EvaluationPreFormType, "userId">;
}

export default function SelectUser({ field }: SelectUserProps) {
    const [open, setOpen] = useState(false);
    const { data: users, error, isError, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers
    });

    return (
        <FormItem className="flex flex-col">
            <FormLabel>User</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            <div className="w-150 truncate">
                                {field.value
                                    ?   
                                        users?.find(
                                            (user) => user.id === field.value
                                        )?.name
                                    :
                                        "Select user..."
                                }
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command className="max-h-[250px] overflow-y-auto overscroll-contain scrollbar-hide">
                        <CommandInput placeholder="Select user..." />
                        <CommandList className="overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-hide">
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup>
                                {users?.map((user) => (
                                    <CommandItem
                                        value={user.name}
                                        key={user.id}
                                        onSelect={() => {
                                            if (user.id === field.value) {
                                                field.onChange("");
                                            } else {
                                                field.onChange(user.id)
                                            }
                                            setOpen(false);
                                        }}
                                    >
                                        {user.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                user.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    )
}