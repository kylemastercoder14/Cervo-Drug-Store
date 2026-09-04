"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, LogColumn } from "./column";
import { format } from "date-fns";
import { useDeleteLog, useGetLogs } from "@/data/logs";

const LogClient = () => {
  const { data: logsData, error, isLoading } = useGetLogs();
  const { mutateAsync: deleteLog, isPending: isDeleting } = useDeleteLog();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: LogColumn[] =
    logsData?.data?.map((item) => ({
      id: item.id,
      action: item.action,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="action"
        columns={columns}
        data={formattedData}
        enableBatchDelete
        batchDeleteLoading={isDeleting}
        onBatchDelete={async (ids) => {
          await Promise.all(ids.map((id) => deleteLog(id)));
        }}
      />
    </>
  );
};

export default LogClient;
