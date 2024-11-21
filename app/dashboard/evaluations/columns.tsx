"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EvaluationsType } from "./types";

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
        visibilityName: "Date",
    },
    {
        accessorKey: "updatedAt",
        header: "Last Update",
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
        accessorKey: "name",
        enableHiding: false
    },
    {
        accessorKey: "description",
        enableHiding: false
    }
]