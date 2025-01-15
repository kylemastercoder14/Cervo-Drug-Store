"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, OrdersColumn } from "./column";
import { format } from "date-fns";
import { useGetOrders } from "@/data/orders";
import { formatPrice } from '@/lib/utils';

const OrdersClient = () => {
  const { data: ordersData, error, isLoading } = useGetOrders();
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
      totalAmount: formatPrice(item.totalAmount),
      status: item.status,
      paymentMethod: item.paymentMethod,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="orderNumber"
        columns={columns}
        data={formattedData}
      />
    </>
  );
};

export default OrdersClient;
