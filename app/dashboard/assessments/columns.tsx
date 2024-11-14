"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { SelectAssessment } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import ActionDropdown from "./action-dropdown/action-dropdown";

export const columns: ColumnDef<SelectAssessment>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "type",
        header: "Type"
    },
    {
        accessorKey: "updatedAt",
        header: "Last update"
    },
    {
        accessorKey: "description",
        enableHiding: false
    },
    {
        accessorKey: "url",
        enableHiding: false
    },
    {
        accessorKey: "id",
        enableHiding: false
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionDropdown row={row} />
    }
]