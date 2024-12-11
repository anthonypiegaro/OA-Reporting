"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { SelectTemplate } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import ActionDropdown from "./action-dropdown/action-dropdown";
import { format } from "date-fns-tz";

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
        },
        visibilityName: "Name"
    },
    {
        accessorKey: "description",
        enableHiding: false
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
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rawDate = row.original.createdAt;
            return format(new Date(rawDate), "MM/dd/yyyy");
        },
        visibilityName: "Date Created",
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