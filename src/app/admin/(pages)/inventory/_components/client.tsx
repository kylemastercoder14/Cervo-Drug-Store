"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, InventoryColumn } from "./column";
import { format } from "date-fns";
import { useGetInventory } from "@/data/inventory";

const InventoryClient = () => {
  const { data: inventoryData, error, isLoading } = useGetInventory();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: InventoryColumn[] =
    inventoryData?.data?.map((item) => ({
      id: item.id,
      image: item.product.image || "",
      name: item.product.name,
      productId: item.productId,
      tags: item.product.tags || "",
      status: item.quantity > 0 ? "In Stock" : "Out of Stock",
      stock: item.quantity,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="banner"
        columns={columns}
        data={formattedData}
      />
    </>
  );
};

export default InventoryClient;
