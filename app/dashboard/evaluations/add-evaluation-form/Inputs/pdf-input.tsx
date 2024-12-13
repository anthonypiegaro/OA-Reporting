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

interface PdfInputProps {
    field: ControllerRenderProps<EvaluationForm, `assessments.${number}.score`>;
    disabled: boolean;
}

export default function PdfInput({ field: { onChange, value, ...field }, disabled }: PdfInputProps) {
    return (
        <FormItem>
            <FormLabel>Attach File</FormLabel>
            <FormControl>
                <Input 
                    type="file"
                    accept=".pdf"
                    {...field} 
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files?.length) {
                            onChange(files[0]);
                        } else {
                            onChange(null);
                        }
                    }}
                    disabled={disabled} />
            </FormControl>
            <FormMessage />
        </FormItem>
    )
}