/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

export type CustomerColumn = {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  userType: string;
  createdAt: string;
};

export const columns: ColumnDef<CustomerColumn>[] = [
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
    accessorKey: "contactNumber",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Contact Number</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Address</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "userType",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>User Type</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.userType === "Senior Citizen" ? "secondary" : "default"
        }
      >
        {row.original.userType}
      </Badge>
    ),
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
];
