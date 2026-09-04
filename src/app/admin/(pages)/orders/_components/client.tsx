"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, OrdersColumn } from "./column";
import { format } from "date-fns";
import { useDeleteOrder, useGetOrders } from "@/data/orders";
import { useGetBranches } from "@/data/branch";

const OrdersClient = () => {
  const { data: ordersData, error, isLoading } = useGetOrders();
  const { mutateAsync: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const { data: branchData, isLoading: isLoadingBranches } = useGetBranches();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: OrdersColumn[] =
    ordersData?.data?.map((item) => ({
      id: item.id,
      orderNumber: item.orderNumber,
      totalAmount: item.totalAmount,
      discountPrice: item.discountPrice ?? 0,
      deliveryFee: item.deliveryFee ?? 0,
      status: item.status,
      orderOption: item.orderOption,
      branch: item.branch || "N/A",
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];
  const branchFilterValues = Array.from(
    new Set([
      ...(branchData?.data?.map((branch) => branch.name) || []),
      ...formattedData
        .map((order) => order.branch)
        .filter((branch) => branch && branch !== "N/A"),
    ])
  );

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading || isLoadingBranches}
        searchKey="orderNumber"
        filterColumn="branch"
        filterValues={branchFilterValues}
        filterPlaceholder="Filter by branch"
        columns={columns}
        data={formattedData}
        enableBatchDelete
        batchDeleteLoading={isDeleting}
        onBatchDelete={async (ids) => {
          await Promise.all(ids.map((id) => deleteOrder(id)));
        }}
      />
    </>
  );
};

export default OrdersClient;
