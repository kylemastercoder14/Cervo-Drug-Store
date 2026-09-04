"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, PromotionColumn } from "./column";
import { format } from "date-fns";
import { useDeletePromotion, useGetPromotions } from "@/data/promotion";

const PromotionClient = () => {
  const { data: promotionData, error, isLoading } = useGetPromotions();
  const { mutateAsync: deletePromotion, isPending: isDeleting } =
    useDeletePromotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: PromotionColumn[] =
    promotionData?.data?.map((item) => ({
      id: item.id,
      promotion: item.image,
      featured: item.isFeatured === true ? "Active" : "Inactive",
      iSFeatured: item.isFeatured,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="promotion"
        columns={columns}
        data={formattedData}
        enableBatchDelete
        batchDeleteLoading={isDeleting}
        onBatchDelete={async (ids) => {
          await Promise.all(ids.map((id) => deletePromotion(id)));
        }}
      />
    </>
  );
};

export default PromotionClient;
