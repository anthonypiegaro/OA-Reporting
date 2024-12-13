"use client"

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

import DeleteEvaluationAlert from "./delete-evaluation-alert";
import EditEvaluationForm from "../edit-evaluation-form/edit-evaluation-form";
import { ToastProps } from "@/components/ui/toast";
import { EvaluationsType } from "../types";

interface ActionDropdownProps {
    row: Row<EvaluationsType>;
}

export default function ActionDropdown({ row }: ActionDropdownProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [editEvalId, setEditEvalId] = useState<number | undefined>();
    const [alertOpen, setAlertOpen] = useState(false);
    const { toast } = useToast();

    const showToast = (props: ToastProps) => {
        toast(props);
    };

    const handleEditFormChange = (open: boolean) => {
        if (!open) {
            setEditEvalId(undefined);
        }
    }

    const closeForm = () => {
        setEditEvalId(undefined);
    }

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
            <EditEvaluationForm evalId={editEvalId} handleOpenChange={handleEditFormChange} closeForm={closeForm} />
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive" onClick={() => setAlertOpen(true)}>
                        Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditEvalId(row.original.id)}>
                        Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
}