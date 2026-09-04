"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, BranchColumn } from "./column";
import { format } from "date-fns";
import { useDeleteBranch, useGetBranches } from "@/data/branch";

const BranchClient = () => {
  const { data: branchData, error, isLoading } = useGetBranches();
  const { mutateAsync: deleteBranch, isPending: isDeleting } =
    useDeleteBranch();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: BranchColumn[] =
    branchData?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      storeHours: item.storeHours,
      contactNumber: item.contactNumber,
      email: item.email,
      manager: item.manager,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

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
        await Promise.all(ids.map((id) => deleteBranch(id)));
      }}
    />
  );
};

export default BranchClient;
