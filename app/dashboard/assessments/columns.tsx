"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns-tz";

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
        },
        visibilityName: "Name"
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        visibilityName: "Type"
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Update
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rawDate = row.original.updatedAt;
            return format(new Date(rawDate), "MM/dd/yyyy");
        },
        visibilityName: "Last Update"
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
        cell: ({ row }) => <ActionDropdown row={row} />,
        enableHiding: false
    }
]