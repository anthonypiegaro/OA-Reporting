"use client"

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

import DeleteEvaluationAlert from "./delete-evaluation-alert";
import { ToastProps } from "@/components/ui/toast";
import { EvaluationsType } from "../types";

interface ActionDropdownProps {
    row: Row<EvaluationsType>;
}

export default function ActionDropdown({ row }: ActionDropdownProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const { toast } = useToast();

    const showToast = (props: ToastProps) => {
        toast(props);
    };

    return (
        <>
            <DeleteEvaluationAlert 
                closeDropdown={() => setDropdownOpen(false)}
                alertOpen={alertOpen}
                setAlertOpen={setAlertOpen}
                showToast={showToast}
                id={row.getValue("id")}
                name={row.getValue("name")}
            />
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="text-destructive" onClick={() => setAlertOpen(true)}>
                        Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
}