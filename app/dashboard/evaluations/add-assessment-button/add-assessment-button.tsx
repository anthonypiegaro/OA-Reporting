"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { getAssessments } from "../actions/get-assessments";
import { GetAssessmentsType } from "../types";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddAssessmentButtonProps {
    onAddAssessment: (assessment: GetAssessmentsType) => void;
}

export default function AddAssessmentButton({ onAddAssessment }: AddAssessmentButtonProps) {
    const [open, setOpen] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState<GetAssessmentsType | null>(null);
    const { data: assessments } = useQuery({
        queryKey: ["assessments"],
        queryFn: getAssessments,
    });

    const handleAddAssessment = () => {
        if (selectedAssessment) {
            onAddAssessment(selectedAssessment);
            setSelectedAssessment(null);
        }
    }

    return (
        <div className="flex flex-row gap-x-1 w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        <div className="w-150 truncate">
                            {selectedAssessment
                                ? selectedAssessment.name
                                : "Select assessment..."
                            }
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search assessment..." />
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {assessments 
                                    ? assessments.map((assessment) => (
                                        <CommandItem
                                            key={assessment.id}
                                            value={assessment.name}
                                            onSelect={() => {
                                                setSelectedAssessment(
                                                    selectedAssessment?.id === assessment.id
                                                    ? null
                                                    : assessment
                                                )
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedAssessment?.id === assessment.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {assessment.name}
                                        </CommandItem>
                                    ))
                                    : <>Loading assessments...</>
                                }
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <Button variant="outline" type="button" disabled={selectedAssessment === null} onClick={() => handleAddAssessment()}>Add Assessment</Button>
        </div>
    )
}