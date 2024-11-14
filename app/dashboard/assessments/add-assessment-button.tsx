"use client"

import { useState } from "react";
import { DiamondPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import QuantForm from "./forms/quant-form/quant-form";
import QualForm from "./forms/qual-form/qual-form";

type forms = "quant" | "qual" | "pdf";

export default function AddAssessmentButton() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<forms>("quant");
    const { toast } = useToast();

    const handleFormSelection = (formType: forms) => {
        setType(formType);
        setOpen(true);
    }

    const handleSuccess = (name: string) => {
        toast({
            title: "Quantitative Assessment Success",
            description: `${name} assessment has been added successfully.`
        });
        setOpen(false);
    }

    const dropdown = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <DiamondPlus /> Add Assessment
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Select Type
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFormSelection("quant")}>Quantitative</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFormSelection("qual")}>Qualitative</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFormSelection("pdf")}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const title = type === "quant" ? "Quantitative" : type === "qual" ? "Qualitative" : "PDF";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {dropdown}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>Add {title} Assessment</DialogTitle>
                </DialogHeader>
                <div>
                    {type === "quant" && <QuantForm handleSuccess={handleSuccess} />}
                    {type === "qual" && <QualForm handleSuccess={handleSuccess} /> }
                    {type === "pdf" && <div>PDF</div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}