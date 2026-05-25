/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

export type ProductColumn = {
  id: string;
  name: string;
  image: string;
  hasImage: boolean;
  category: string;
  categoryId: string;
  description: string;
  tags: string;
  price: any;
  priceValue: number;
  isFeatured: boolean;
  isPrescription: boolean;
  isVatItem: boolean;
  prescription: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      const image = row.original.image;
      const doseLabel =
        row.original.name.match(/(\d+(?:\.\d+)?)\s*(mg|g|mcg|ml)/i)?.[0] ||
        row.original.tags ||
        "No image";

      return (
        <div className="flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-md border bg-muted">
          {image ? (
            <Image
              alt={`${row.original.name} image`}
              className="h-full w-full object-cover"
              height={70}
              src={image}
              width={70}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center bg-[#b8c9b0] px-1 py-1 text-black">
              <p className="text-[4px] font-bold uppercase leading-none text-[#2f6f2d]">
                Cervo
              </p>
              <p className="text-[3px] font-semibold uppercase leading-none text-[#2f6f2d]">
                Drugstore
              </p>
              <div className="mt-1 flex h-5 w-full items-center justify-center border-[1.5px] border-black bg-[#dce5d6] px-1">
                <p className="truncate text-center text-[5px] font-semibold uppercase leading-tight">
                  {row.original.name}
                </p>
              </div>
              <p className="mt-1 text-[5px] font-semibold leading-none">
                {doseLabel}
              </p>
              {row.original.isPrescription && (
                <p className="mt-auto text-[11px] font-serif italic leading-none">
                  Rx
                </p>
              )}
            </div>
          )}
        </div>
      );
    },
  },
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
      <div className="max-w-[320px] lg:max-w-[380px] xl:max-w-[440px]">
        <p className="break-words">{row.original.name}</p>
        <p className="text-sm text-muted-foreground">
          SKU: {row.original.tags}
        </p>
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
