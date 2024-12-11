"use client"

import { useState } from "react";
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
import EditUserSheet from "./edit-user-sheet/edit-user-sheet";
import DeleteUserAlert from "./delete-user-alert/delete-user-alert";
import { SelectUser } from "@/app/db/schema";
import { Row } from "@tanstack/react-table";
import { ToastProps } from "@/components/ui/toast";

interface EditUserDropdownProps {
  row: Row<SelectUser>;
}

export default function EditUserDropdown({ row }: EditUserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const { toast } = useToast();
  
    const showToast = (props: ToastProps) => {
      toast(props);
    }

    return (
      <>
        <DeleteUserAlert showToast={showToast} id={row.original.id} clerkId={row.original.clerkId as string} name={row.original.name} alertOpen={alertOpen} setAlertOpen={setAlertOpen} />
        <EditUserSheet isOpen={isOpen} setIsOpen={setIsOpen} row={row} />
        <DropdownMenu>
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
            <DropdownMenuItem
              onClick={() => setIsOpen(true)}
            >
              Edit User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
}