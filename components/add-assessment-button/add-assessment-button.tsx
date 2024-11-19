"use client"
 
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { getAssessments } from "@/app/dashboard/actions";

import { AssessmentType } from "./types";

const client = new QueryClient();

interface AddAssessmentButtonProps {
    onAddAssessment: (assessment: AssessmentType) => void;
}

export default function AddAssessmentButton({ onAddAssessment }: AddAssessmentButtonProps) {
    return (
        <QueryClientProvider client={client}>
            <AddAssessmentButtonContent onAddAssessment={onAddAssessment}/>
        </QueryClientProvider>
    )
}

function AddAssessmentButtonContent({ onAddAssessment }: AddAssessmentButtonProps) {
    const [open, setOpen] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null);
    const { isLoading, isError, data: assessments, error } = useQuery({
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
        <div className="space-x-4 w-full">
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
                                            onSelect={(currentValue) => {
                                                setSelectedAssessment(
                                                    currentValue === selectedAssessment?.name
                                                    ? null 
                                                    : {
                                                        id: assessment.id,
                                                        name: assessment.name
                                                    }
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
            <Button variant="outline" type="button" onClick={() => handleAddAssessment()}>Add Assessment</Button>
        </div>
    )
}