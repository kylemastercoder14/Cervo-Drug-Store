"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { columns, LaboratoryServiceColumn } from "./column";
import { format } from "date-fns";
import {
  useDeleteLaboratoryServiceCategory,
  useGetLaboratoryServiceCategories,
} from "@/data/laboratory-services";

const LaboratoryServiceClient = () => {
  const { data: laboratoryServiceData, error, isLoading } =
    useGetLaboratoryServiceCategories();
  const {
    mutateAsync: deleteLaboratoryServiceCategory,
    isPending: isDeleting,
  } = useDeleteLaboratoryServiceCategory();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: LaboratoryServiceColumn[] = useMemo(
    () =>
      laboratoryServiceData?.data?.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        services: item.services,
        servicesCount: item.services.length,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      })) || [],
    [laboratoryServiceData],
  );

  if (!isMounted) {
    return null;
  }

  return (
    <DataTable
      loading={isLoading}
      searchKey="name"
      columns={columns}
      data={formattedData}
      enableBatchDelete
      batchDeleteLoading={isDeleting}
      onBatchDelete={async (ids) => {
        await Promise.all(
          ids.map((id) => deleteLaboratoryServiceCategory(id))
        );
      }}
    />
  );
};

export default LaboratoryServiceClient;
