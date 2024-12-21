"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, BannerColumn } from "./column";
import { format } from "date-fns";
import { useGetLogs } from "@/data/logs";

const LogClient = () => {
  const { data: logsData, error, isLoading } = useGetLogs();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: BannerColumn[] =
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
        searchKey="banner"
        columns={columns}
        data={formattedData}
      />
    </>
  );
};

export default LogClient;
