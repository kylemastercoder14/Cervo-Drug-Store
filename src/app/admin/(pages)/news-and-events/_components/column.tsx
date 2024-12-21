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

export type NewsEventColumn = {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
};

export const columns: ColumnDef<NewsEventColumn>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <Image
        alt="Image"
        className="aspect-square rounded-md object-cover"
        height="70"
        src={row.original.image}
        width="70"
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Title</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "content",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"tableButton"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="line-clamp-2">Content</p>
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
