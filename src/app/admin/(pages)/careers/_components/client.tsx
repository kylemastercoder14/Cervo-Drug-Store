"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, CareerColumn } from "./column";
import { format } from "date-fns";
import { useDeleteCareer, useGetCareers } from "@/data/career";

const CareerClient = () => {
  const { data: careerData, error, isLoading } = useGetCareers();
  const { mutateAsync: deleteCareer, isPending: isDeleting } =
    useDeleteCareer();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: CareerColumn[] =
    careerData?.data?.map((item) => ({
      id: item.id,
      jobTitle: item.jobTitle,
      department: item.department,
      jobLocation: item.jobLocation,
      experienceNeeded: item.experienceNeeded,
      yearsOfExperience: item.yearsOfExperience,
      isActive: item.isActive,
      applicationsCount: item.applications?.length || 0,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="jobTitle"
        columns={columns}
        data={formattedData}
        enableBatchDelete
        batchDeleteLoading={isDeleting}
        onBatchDelete={async (ids) => {
          await Promise.all(ids.map((id) => deleteCareer(id)));
        }}
      />
    </>
  );
};

export default CareerClient;

