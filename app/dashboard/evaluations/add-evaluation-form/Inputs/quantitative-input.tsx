"use client"

import { ControllerRenderProps } from "react-hook-form";

import { 
    FormControl,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { EvaluationForm } from "../types";

interface QuantitativeInputProps {
    field: ControllerRenderProps<EvaluationForm, `assessments.${number}.score`>;
    disabled: boolean;
}

export default function QuantitativeInput({ field, disabled }: QuantitativeInputProps) {
    return (
        <FormItem>
            <FormLabel>Score</FormLabel>
            <FormControl>
                <Input {...field} type="number" disabled={disabled} />
            </FormControl>
            <FormMessage />
        </FormItem>
    )
}