"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { SelectTemplate } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import ActionDropdown from "./action-dropdown/action-dropdown";

export const columns: ColumnDef<SelectTemplate>[] = [
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
        accessorKey: "description",
        enableHiding: false
    },
    {
        accessorKey: "updatedAt",
        header: "Last update"
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