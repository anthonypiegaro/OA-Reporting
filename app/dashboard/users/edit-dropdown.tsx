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
import EditUserSheet from "./edit-user-sheet/edit-user-sheet";
import { SelectUser } from "@/app/db/schema";
import { Row } from "@tanstack/react-table";

interface EditUserDropdownProps {
  row: Row<SelectUser>;
}

export default function EditUserDropdown({ row }: EditUserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <EditUserSheet isOpen={isOpen} setIsOpen={setIsOpen} row={row} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setIsOpen(true)}
            >
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
}