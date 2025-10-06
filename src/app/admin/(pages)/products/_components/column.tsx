/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

export type ProductColumn = {
  id: string;
  name: string;
  image: string;
  category: string;
  categoryId: string;
  description: string;
  tags: string;
  price: any;
  isFeatured: boolean;
  isPrescription: boolean;
  isVatItem: boolean;
  prescription: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  // {
  //   accessorKey: "image",
  //   header: "",
  //   cell: ({ row }) => (
  //     <Image
  //       alt="Product image"
  //       className="aspect-square rounded-md object-cover"
  //       height="70"
  //       src={row.original.image}
  //       width="70"
  //     />
  //   ),
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}

          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Name</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <p>{row.original.name}</p>
        <p className='text-sm text-muted-foreground'>SKU: {row.original.tags}</p>
      </div>
    ),
  },
  // {
  //   accessorKey: "tags",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant={"ghost"}
  //
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <p>SKU</p>
  //         <ChevronsUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}

          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Original Price</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // {
  //   accessorKey: "category",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant={"ghost"}
  //
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <p>Category</p>
  //         <ChevronsUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  {
    accessorKey: "prescription",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}

          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Prescription</p>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.prescription === "Over The Counter"
            ? "default"
            : "secondary"
        }
      >
        {row.original.prescription}
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
