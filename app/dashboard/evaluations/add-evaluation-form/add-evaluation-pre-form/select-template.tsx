"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

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

import { getTemplates } from "../../actions/get-templates";
import { EvaluationPreFormType } from "../types";

interface SelectTemplateProps {
    field: ControllerRenderProps<EvaluationPreFormType, "templateId">;
}

export default function SelectTemplate({ field }: SelectTemplateProps) {
    const [open, setOpen] = useState(false);
    const { data: templates, error, isError, isLoading } = useQuery({
        queryKey: ["templates"],
        queryFn: getTemplates
    });

    return (
        <FormItem className="flex flex-col">
            <FormLabel>Template (Optional)</FormLabel>
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
                                        templates?.find(
                                            (template) => template.id === field.value
                                        )?.name
                                    :
                                        "Select template..."
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
                                {templates?.map((template) => (
                                    <CommandItem
                                        value={template.name}
                                        key={template.id}
                                        onSelect={() => {
                                            if (template.id === field.value) {
                                                field.onChange(undefined);
                                            } else {
                                                field.onChange(template.id);
                                            }
                                            setOpen(false);
                                        }}
                                    >
                                        {template.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                template.id === field.value
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