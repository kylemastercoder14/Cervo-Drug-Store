"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, NewsEventColumn } from "./column";
import { format } from "date-fns";
import { useGetNewsEvent } from "@/data/news-event";

const NewsEventClient = () => {
  const { data: newsEventData, error, isLoading } = useGetNewsEvent();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: NewsEventColumn[] =
    newsEventData?.data?.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      image: item.image,
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

export default NewsEventClient;
