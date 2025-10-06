/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

export type PromotionColumn = {
  id: string;
  promotion: string;
  featured: string;
  iSFeatured: boolean;
  createdAt: string;
};

export const columns: ColumnDef<PromotionColumn>[] = [
  {
    accessorKey: "promotion",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}

          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Promotion</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link
        className="cursor-pointer font-semibold text-orange-600"
        href={row.original.promotion}
      >
        {row.original.promotion}
      </Link>
    ),
  },
  {
    accessorKey: "featured",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}

          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Featured</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        variant={row.original.featured === "Active" ? "default" : "destructive"}
      >
        {row.original.featured}
      </Badge>
    ),
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
