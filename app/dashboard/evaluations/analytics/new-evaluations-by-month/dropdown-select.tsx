"use client"

import { Button } from "@/components/ui/button";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import React from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface DropdownSelectProps {
    showHighSchool: Checked;
    showCollege: Checked;
    showProfessional: Checked;
    setShowHighSchool: React.Dispatch<React.SetStateAction<Checked>>;
    setShowCollege: React.Dispatch<React.SetStateAction<Checked>>;
    setShowProfessional: React.Dispatch<React.SetStateAction<Checked>>;
}

export default function DropdownSelect({
    showHighSchool,
    showCollege,
    showProfessional,
    setShowHighSchool,
    setShowCollege,
    setShowProfessional
}: DropdownSelectProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost">
                    Customize
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                    checked={showHighSchool}
                    onCheckedChange={setShowHighSchool}
                >
                    High School
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={showCollege}
                    onCheckedChange={setShowCollege}
                >
                    College
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={showProfessional}
                    onCheckedChange={setShowProfessional}
                >
                    Professional
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}