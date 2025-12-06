"use client";

import { Button } from "@/components/ui/button";
import { ApplicationColumn } from "./column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import { useState } from "react";
import AlertModal from "@/components/ui/alert-modal";
import ApplicationDetailModal from "./application-detail-modal";
import { useDeleteApplication, useUpdateApplicationStatus } from "@/data/career-application";

interface CellActionProps {
  data: ApplicationColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const { mutate: deleteApplication, isPending: isDeleting } = useDeleteApplication();
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  const onDelete = async () => {
    deleteApplication(data.id, {
      onSuccess: () => setOpen(false),
    });
  };

  const onStatusChange = (status: string, remarks?: string) => {
    updateStatus(
      { applicationId: data.id, status, remarks },
      {
        onSuccess: () => {
          setDetailOpen(false);
        },
      }
    );
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isDeleting}
        onConfirm={onDelete}
      />
      {detailOpen && (
        <ApplicationDetailModal
          applicationId={data.id}
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          onStatusChange={onStatusChange}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDetailOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
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

