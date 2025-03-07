"use client";

import { Button } from "@/components/ui/button";
import { ProductColumn } from "./column";
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
import ProductForm from "@/components/form/product-form";
import { useDeleteProduct } from "@/data/product";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const onDelete = async () => {
    deleteProduct(data.id, {
      onSuccess: () => setOpen(false),
    });
  };

  const onUpdate = () => setFormOpen(true);

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} loading={isDeleting} onConfirm={onDelete} />
      {formOpen && <ProductForm productId={data.id} onClose={() => setFormOpen(false)} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onUpdate}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
