"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { EvaluationsType } from "./types";
import ActionDropdown from "./action-dropdown/action-dropdown";

export const columns: ColumnDef<EvaluationsType>[] = [
    {
        accessorKey: "userName",
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        visibilityName: "User",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Evaluation Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        visibilityName: "Evaluation Name"
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
        visibilityName: "Date",
    },
    {
        accessorKey: "updatedAt",
        cell: ({ row }) => {
            const rawDate = row.original.updatedAt;
            return format(new Date(rawDate), "MM/dd/yyyy hh:mm a zzz", { timeZone: "America/Los_Angeles" })
        },
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
        visibilityName: "Last Update",
    },
    {
        accessorKey: "id",
        enableHiding: false,
    },
    {
        accessorKey: "userId",
        enableHiding: false
    },
    {
        accessorKey: "description",
        enableHiding: false
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionDropdown row={row} />,
        enableHiding: false
    }
]