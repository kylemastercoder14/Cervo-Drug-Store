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

export type OrdersColumn = {
  id: string;
  orderNumber: string;
  totalAmount: string;
  status: string;
  orderOption: string;
  createdAt: string;
};

export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Order Number</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Total Amount</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "orderOption",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Order Option</p>
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
    cell: ({row}) => (
      <Badge variant={row.original.status === "Order Completed" ? "default" : "secondary"}>{row.original.status}</Badge>
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
