"use client"

import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { EvaluationForm, QualitativeOption } from "../types";

interface QualitativeInputProps {
    form: UseFormReturn<EvaluationForm, any, undefined>
    options: QualitativeOption[],
    disabled: boolean;
    index: number;
}

export default function QualitativeInput({ form, index, options, disabled }: QualitativeInputProps) {
    const handleSelectChange = (value: string) => {
        const { id, score, description, isPassing } = options.find(option => option.score === value)!;

        form.setValue(`assessments.${index}.qualitativeScoreId`, id);
        form.setValue(`assessments.${index}.score`, score);
        form.setValue(`assessments.${index}.description`, description);
        form.setValue(`assessments.${index}.isPassing`, isPassing);
    }

    return (
        <FormField
            control={form.control}
            name={`assessments.${index}.score`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Score</FormLabel>
                    <Select onValueChange={handleSelectChange} disabled={disabled}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select option..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map(option => (
                                <SelectItem value={option.score}>{option.score}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}