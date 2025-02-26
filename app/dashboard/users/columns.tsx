"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { SelectUser } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import EditUserDropdown from "./edit-dropdown";

export const columns: ColumnDef<SelectUser>[] = [
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
        visibleName: "Name"
    },
    {
        accessorKey: "email",
        header: "Email",
        visibleName: "Email"
    },
    {
        accessorKey: "playingLevel",
        header: "Playing Level",
        visibleName: "Playing Level"
    },
    {
        accessorKey: "role",
        header: "Role",
        visibleName: "Role"
    },
    {
        accessorKey: "id",
        enableHiding: false,
    },
    {
        accessorKey: "clerkId",
        enableHiding: false
    },
    {
        id: "actions",
        cell: ({ row }) => <EditUserDropdown row={row} />,
        enableHiding: false
    }
]