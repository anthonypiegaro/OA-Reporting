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
import { SelectAssessment } from "@/app/db/schema";
import { Row } from "@tanstack/react-table";
import HideAssessmentAlert from "./hide-assessment-alert";
import { useToast } from "@/hooks/use-toast";
import { type ToastProps } from "@/components/ui/toast";

import EditQuant from "./edit-quant/edit-quant";
import EditQual from "./edit-qual/edit-qual";
import EditPDF from "./edit-pdf/edit-pdf";

interface ActionDropdownProps {
  row: Row<SelectAssessment>;
}

export default function ActionDropdown({ row }: ActionDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hideAlertOpen, setHideAlertOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { toast } = useToast();
  const type = row.getValue("type");

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
      {type === "quantitative" && 
        <EditQuant 
          showEditQuant={showEdit} 
          row={row} 
          handleEditOpenChange={handleEditOpenChange}
          showToast={showToast}
        />
      }
      {type === "qualitative" && 
        <EditQual
          showEditQual={showEdit} 
          row={row} 
          handleEditOpenChange={handleEditOpenChange}
          showToast={showToast}
        />
      }
      {type === "pdf" && 
        <EditPDF
          showEditQual={showEdit} 
          row={row} 
          handleEditOpenChange={handleEditOpenChange}
          showToast={showToast}
        />
      }
      <HideAssessmentAlert 
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
            Hide
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEdit(true)} >
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}