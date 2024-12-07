"use client"

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns-tz";
import { SelectEvaluation } from "../db/schema";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import ActionDropdown from "./action-dropdown";

export const columns: ColumnDef<SelectEvaluation>[] = [
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
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rawDate = row.original.date;
            return format(new Date(rawDate), "MM/dd/yyyy")
        },
        visibilityName: "Date"
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
            const rawDate = row.original.date;
            return format(new Date(rawDate), "MM/dd/yyyy")
        },
        visibilityName: "Last Update"
    },
    {
        accessorKey: "description",
        enableHiding: false
    },
    {
        accessorKey: "id",
        enableHiding: false
    },
    {
        accessorKey: "notes",
        enableHiding: false
    },
    {
        accessorKey: "userId",
        enableHiding: false
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="flex justify-end pr-2">
                <ActionDropdown row={row} />
            </div>
        )
    }
]