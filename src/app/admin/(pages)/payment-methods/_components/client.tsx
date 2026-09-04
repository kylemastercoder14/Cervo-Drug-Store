"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, PaymentMethodColumn } from "./column";
import { format } from "date-fns";
import {
  useDeletePaymentMethod,
  useGetPaymentMethods,
} from "@/data/payment-method";

const PaymentMethodClient = () => {
  const { data: paymentMethodData, error, isLoading } =
    useGetPaymentMethods();
  const { mutateAsync: deletePaymentMethod, isPending: isDeleting } =
    useDeletePaymentMethod();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: PaymentMethodColumn[] =
    paymentMethodData?.data?.map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      qrCode: item.qrCode || "",
      status: item.isActive ? "Active" : "Inactive",
      isActive: item.isActive,
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
        await Promise.all(ids.map((id) => deletePaymentMethod(id)));
      }}
    />
  );
};

export default PaymentMethodClient;
