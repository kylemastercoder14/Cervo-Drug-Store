"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

export type BranchColumn = {
  id: string;
  name: string;
  address: string;
  storeHours: string;
  contactNumber: string;
  email: string;
  manager: string;
  createdAt: string;
};

const SortableHeader = ({
  column,
  label,
}: {
  column: Column<BranchColumn, unknown>;
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
  function BranchSortableHeader({
    column,
  }: {
    column: Column<BranchColumn, unknown>;
  }) {
    return <SortableHeader column={column} label={label} />;
  };

export const columns: ColumnDef<BranchColumn>[] = [
  {
    accessorKey: "name",
    header: sortableHeader("Branch"),
  },
  {
    accessorKey: "address",
    header: sortableHeader("Address"),
    cell: ({ row }) => (
      <p className="max-w-[320px] truncate">{row.original.address}</p>
    ),
  },
  {
    accessorKey: "storeHours",
    header: sortableHeader("Store Hours"),
  },
  {
    accessorKey: "contactNumber",
    header: sortableHeader("Contact"),
  },
  {
    accessorKey: "email",
    header: sortableHeader("Email"),
  },
  {
    accessorKey: "manager",
    header: sortableHeader("Manager"),
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
