/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type BannerColumn = {
  id: string;
  action: string;
  createdAt: string;
};

export const columns: ColumnDef<BannerColumn>[] = [
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}

          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Action</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}

          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Date Created</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
