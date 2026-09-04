"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, CustomerColumn } from "./column";
import { format } from "date-fns";
import { useDeleteCustomer, useGetCustomers } from "@/data/customers";

const CustomerClient = () => {
  const { data: customerData, error, isLoading } = useGetCustomers();
  const { mutateAsync: deleteCustomer, isPending: isDeleting } =
    useDeleteCustomer();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: CustomerColumn[] =
    customerData?.data?.map((item) => ({
      id: item.id,
      name: item.firstName + " " + item.lastName,
      contactNumber: item.contactNumber,
      address: item.zipCode,
      userType: item.seniorPwdId ? "Senior Citizen" : "Regular",
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="name"
        columns={columns}
        data={formattedData}
        enableBatchDelete
        batchDeleteLoading={isDeleting}
        onBatchDelete={async (ids) => {
          await Promise.all(ids.map((id) => deleteCustomer(id)));
        }}
      />
    </>
  );
};

export default CustomerClient;
