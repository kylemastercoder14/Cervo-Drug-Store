"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, ApplicationColumn } from "./column";
import { format } from "date-fns";
import { useGetApplications } from "@/data/career-application";

const ApplicationClient = () => {
  const { data: applicationData, error, isLoading } = useGetApplications();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: ApplicationColumn[] =
    applicationData?.data?.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      middleName: item.middleName,
      lastName: item.lastName,
      position: item.position,
      contactNumber: item.contactNumber,
      email: item.email,
      status: item.status,
      resumeUrl: item.resumeUrl,
      remarks: item.remarks || "",
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="firstName"
        columns={columns}
        data={formattedData}
      />
    </>
  );
};

export default ApplicationClient;

