/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export type InventoryColumn = {
  id: string;
  name: string;
  productId: string;
  image: string;
  tags: string;
  status: string;
  stock: number;
  createdAt: string;
};

export const columns: ColumnDef<InventoryColumn>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <Image
        alt="Product image"
        className="aspect-square rounded-md object-cover"
        height="70"
        src={row.original.image}
        width="70"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Name</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "tags",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>SKU</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Stock</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Status</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant={row.original.status === "In Stock" ? "default" : "destructive"}>
        {row.original.status}
      </Badge>
    )
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
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
