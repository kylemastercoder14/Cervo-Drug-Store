/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from '@/lib/utils';

export type OrdersColumn = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  discountPrice: number;
  deliveryFee: number;
  status: string;
  orderOption: string;
  createdAt: string;
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "AWAITING_SHIPPING_FEE_CONFIRMATION":
      return "To Confirm";
    case "SHIPPING_FEE_REJECTED":
      return "Fee Rejected";
    default:
      return status;
  }
};

export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Total Amount</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => {
      const order = row.original;
      const total = formatPrice(
        order.totalAmount - order.discountPrice + order.deliveryFee
      );
      return (
        <span>{total}</span>
      )
    }
  },
  {
    accessorKey: "orderOption",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Status</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.status === "PENDING"
            ? "bg-yellow-500/20 text-yellow-700 border-yellow-500"
            : row.original.status === "AWAITING_SHIPPING_FEE_CONFIRMATION"
            ? "bg-amber-500/20 text-amber-700 border-amber-500"
            : row.original.status === "SHIPPING_FEE_REJECTED"
            ? "bg-red-500/20 text-red-700 border-red-500"
            : row.original.status === "PROCESSING"
            ? "bg-blue-500/20 text-blue-700 border-blue-500"
            : row.original.status === "COMPLETED"
            ? "bg-green-500/20 text-green-700 border-green-500"
            : row.original.status === "CANCELLED"
            ? "bg-red-500/20 text-red-700 border-red-500"
            : ""
        }
      >
        {getStatusLabel(row.original.status)}
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
