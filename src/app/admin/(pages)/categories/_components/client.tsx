"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, CategoryColumn } from "./column";
import { format } from "date-fns";
import { useDeleteCategory, useGetCategories } from "@/data/category";

const CategoryClient = () => {
  const { data: categoryData, error, isLoading } = useGetCategories();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: CategoryColumn[] =
    categoryData?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
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
        enableBatchDelete
        batchDeleteLoading={isDeleting}
        onBatchDelete={async (ids) => {
          await Promise.all(ids.map((id) => deleteCategory(id)));
        }}
      />
    </>
  );
};

export default CategoryClient;
