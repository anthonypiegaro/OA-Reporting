"use client"

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Row } from "@tanstack/react-table";
import { SelectEvaluation } from "../db/schema";

interface ActionDropDownProps {
    row: Row<SelectEvaluation>
}

export default function ActionDropdown({ row }: ActionDropDownProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/dashboard/evaluation-report/${row.original.id}`)}>
                    View
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}