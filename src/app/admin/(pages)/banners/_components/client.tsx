"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, BannerColumn } from "./column";
import { format } from "date-fns";
import { useDeleteBanner, useGetBanners } from "@/data/banner";

const BannerClient = () => {
  const { data: bannerData, error, isLoading } = useGetBanners();
  const { mutateAsync: deleteBanner, isPending: isDeleting } =
    useDeleteBanner();
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
    bannerData?.data?.map((item) => ({
      id: item.id,
      banner: item.image,
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
          await Promise.all(ids.map((id) => deleteBanner(id)));
        }}
      />
    </>
  );
};

export default BannerClient;
