"use client"

import { useState } from "react";
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
import { SelectTemplate } from "@/app/db/schema";
import { Row } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { type ToastProps } from "@/components/ui/toast";
import DeleteTemplateAlert from "./delete-template-alert";
import EditTemplate from "./edit-template/edit-template";

interface ActionDropdownProps {
  row: Row<SelectTemplate>;
}

export default function ActionDropdown({ row }: ActionDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hideAlertOpen, setHideAlertOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { toast } = useToast();

  const showToast = (props: ToastProps) => {
    toast(props);
  };

  const handleEditOpenChange = (show: boolean) => {
    setShowEdit(show);
    if (!show) {
      setDropdownOpen(false);
    }
  }

  return (
    <>
      <EditTemplate 
        showEdit={showEdit}
        row={row}
        handleEditOpenChange={handleEditOpenChange}
        showToast={showToast}
      />
      <DeleteTemplateAlert
        closeDropdown={() => setDropdownOpen(false)}
        alertOpen={hideAlertOpen}
        setAlertOpen={setHideAlertOpen}
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
          <DropdownMenuItem className="text-destructive" onClick={() => setHideAlertOpen(true)}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEdit(true)}>
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}