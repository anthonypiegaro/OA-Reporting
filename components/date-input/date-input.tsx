"use client"

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateInputProps {
    value: Date | undefined;
    onSelect: (value: Date | undefined) => void;
    disabled: boolean;
}

export function DateInput({ value, onSelect, disabled }: DateInputProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    disabled={disabled}
                    className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !value && "text-muted-foreground"
                    )}
                >
                    {value ? (
                    format(value, "PPP")
                    ) : (
                    <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                mode="single"
                selected={value}
                onSelect={onSelect}
                disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}