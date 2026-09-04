"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";

export type PaymentMethodColumn = {
  id: string;
  type: string;
  name: string;
  accountName: string;
  accountNumber: string;
  qrCode: string;
  status: string;
  isActive: boolean;
  createdAt: string;
};

const SortableHeader = ({
  column,
  label,
}: {
  column: Column<PaymentMethodColumn, unknown>;
  label: string;
}) => (
  <Button
    variant={"ghost"}
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    <p>{label}</p>
    <ChevronsUpDown className="ml-2 h-4 w-4" />
  </Button>
);

const sortableHeader = (label: string) =>
  function PaymentMethodSortableHeader({
    column,
  }: {
    column: Column<PaymentMethodColumn, unknown>;
  }) {
    return <SortableHeader column={column} label={label} />;
  };

export const columns: ColumnDef<PaymentMethodColumn>[] = [
  {
    accessorKey: "type",
    header: sortableHeader("Type"),
  },
  {
    accessorKey: "name",
    header: sortableHeader("Name"),
  },
  {
    accessorKey: "accountName",
    header: sortableHeader("Account Name"),
  },
  {
    accessorKey: "accountNumber",
    header: sortableHeader("Account Number"),
  },
  {
    accessorKey: "qrCode",
    header: "QR Code",
    cell: ({ row }) =>
      row.original.qrCode ? (
        <Link
          className="cursor-pointer font-semibold text-orange-600"
          href={row.original.qrCode}
        >
          View QR
        </Link>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      ),
  },
  {
    accessorKey: "status",
    header: sortableHeader("Status"),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: sortableHeader("Date Created"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
