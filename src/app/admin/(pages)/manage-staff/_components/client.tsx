"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, StaffColumn } from "./column";
import { format } from "date-fns";
import { useDeleteStaff, useGetStaff } from "@/data/manage-staff";

const StaffClient = () => {
  const { data: staffData, error, isLoading } = useGetStaff();
  const { mutateAsync: deleteStaff, isPending: isDeleting } = useDeleteStaff();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: StaffColumn[] =
    staffData?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      branch: item.branch || "N/A",
      password: item.password,
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
        enableBatchDelete
        batchDeleteLoading={isDeleting}
        onBatchDelete={async (ids) => {
          await Promise.all(ids.map((id) => deleteStaff(id)));
        }}
      />
    </>
  );
};

export default StaffClient;
