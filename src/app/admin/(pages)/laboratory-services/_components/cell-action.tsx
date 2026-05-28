"use client";

import { Button } from "@/components/ui/button";
import { LaboratoryServiceColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import AlertModal from "@/components/ui/alert-modal";
import { useDeleteLaboratoryServiceCategory } from "@/data/laboratory-services";
import LaboratoryServiceForm from "@/components/form/laboratory-service-form";

interface CellActionProps {
  data: LaboratoryServiceColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { mutate: deleteLaboratoryServiceCategory, isPending: isDeleting } =
    useDeleteLaboratoryServiceCategory();

  const onDelete = async () => {
    deleteLaboratoryServiceCategory(data.id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isDeleting}
        onConfirm={onDelete}
      />
      {formOpen && (
        <LaboratoryServiceForm
          initialData={data}
          onClose={() => setFormOpen(false)}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setFormOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
