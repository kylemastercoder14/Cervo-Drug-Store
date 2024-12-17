"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, ProductColumn } from "./column";
import { format } from "date-fns";
import { useGetProducts } from "@/data/product";
import { formatPrice } from "@/lib/utils";

const ProductClient = () => {
  const { data: productData, error, isLoading } = useGetProducts();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: ProductColumn[] =
    productData?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      tags: item.tags,
      categoryId: item.categoryTag,
      description: item.description,
      price: formatPrice(item.price),
      isFeatured: item.isFeatured,
      isPrescription: item.isPrescriptionRequired,
      prescription: item.isPrescriptionRequired === true ? "Need Prescription" : "Over The Counter",
      category: item.category.name,
      discountedPrice: formatPrice(item?.discountedPrice ?? 0),
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="name"
        columns={columns}
        data={formattedData}
      />
    </>
  );
};

export default ProductClient;
