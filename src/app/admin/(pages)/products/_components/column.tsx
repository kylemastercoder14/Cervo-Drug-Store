/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export type ProductColumn = {
  id: string;
  name: string;
  image: string;
  category: string;
  categoryId: string;
  description: string;
  stocks: any;
  discountedPrice: any;
  tags: string;
  price: any;
  isFeatured: boolean;
  isPrescription: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
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
    header: "Name",
  },
  {
    accessorKey: "tags",
    header: "SKU",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "discountedPrice",
    header: "Discounted Price",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.category}</Badge>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isPrescription",
    header: "Prescription Required",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
