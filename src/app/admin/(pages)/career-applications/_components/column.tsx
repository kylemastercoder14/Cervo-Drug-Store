/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";

export type ApplicationColumn = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  position: string;
  contactNumber: string;
  email: string;
  status: string;
  resumeUrl: string;
  remarks?: string;
  createdAt: string;
};

export const columns: ColumnDef<ApplicationColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const middle = row.original.middleName ? ` ${row.original.middleName} ` : " ";
      return (
        <div>
          <p className="font-medium">
            {row.original.firstName}{middle}{row.original.lastName}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Position</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "APPROVED"
          ? "default"
          : status === "REJECTED"
          ? "destructive"
          : status === "REVIEWING"
          ? "secondary"
          : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "resumeUrl",
    header: "Resume",
    cell: ({ row }) => {
      return (
        <Link
          href={row.original.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          View Resume
        </Link>
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
          <p>Date Applied</p>
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

