"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, ProductColumn } from "./column";
import { format } from "date-fns";
import { useDeleteProduct, useGetProducts } from "@/data/product";
import { formatPrice } from "@/lib/utils";

const ProductClient = () => {
  const { data: productData, error, isLoading } = useGetProducts();
  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();
  const [isMounted, setIsMounted] = useState(false);
  const [imageFilter, setImageFilter] = useState("all");
  const [prescriptionFilter, setPrescriptionFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: ProductColumn[] =
    productData?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image || "",
      hasImage: Boolean(item.image),
      tags: item.tags || "",
      categoryId: item.categoryTag || "",
      description: item.description || "",
      price: formatPrice(item.price),
      priceValue: item.price,
      isFeatured: item.isFeatured,
      isPrescription: item.isPrescriptionRequired,
      isVatItem: item.isVatItem,
      prescription:
        item.isPrescriptionRequired === true
          ? "Need Prescription"
          : "Over The Counter",
      category: "Category",
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  const parsedMinPrice = minPrice ? Number(minPrice) : null;
  const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;
  const safeMinPrice =
    parsedMinPrice !== null && !Number.isNaN(parsedMinPrice)
      ? parsedMinPrice
      : null;
  const safeMaxPrice =
    parsedMaxPrice !== null && !Number.isNaN(parsedMaxPrice)
      ? parsedMaxPrice
      : null;

  const filteredData = formattedData.filter((item) => {
    const matchesImage =
      imageFilter === "all" ||
      (imageFilter === "with-image" && item.hasImage) ||
      (imageFilter === "without-image" && !item.hasImage);

    const matchesPrescription =
      prescriptionFilter === "all" ||
      (prescriptionFilter === "prescription" && item.isPrescription) ||
      (prescriptionFilter === "over-the-counter" && !item.isPrescription);

    const matchesMinPrice =
      safeMinPrice === null || item.priceValue >= safeMinPrice;

    const matchesMaxPrice =
      safeMaxPrice === null || item.priceValue <= safeMaxPrice;

    return (
      matchesImage &&
      matchesPrescription &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const handleResetFilters = () => {
    setImageFilter("all");
    setPrescriptionFilter("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters =
    imageFilter !== "all" ||
    prescriptionFilter !== "all" ||
    minPrice !== "" ||
    maxPrice !== "";

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-2">
          <p className="text-sm font-medium">Image</p>
          <Select value={imageFilter} onValueChange={setImageFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by image" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              <SelectItem value="with-image">With image</SelectItem>
              <SelectItem value="without-image">Without image</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Prescription</p>
          <Select
            value={prescriptionFilter}
            onValueChange={setPrescriptionFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by prescription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              <SelectItem value="prescription">Need prescription</SelectItem>
              <SelectItem value="over-the-counter">
                Over the counter
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Min price</p>
          <Input
            min="0"
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            type="number"
            value={minPrice}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Max price</p>
          <Input
            min="0"
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="1000"
            type="number"
            value={maxPrice}
          />
        </div>
        <div className="flex items-end">
          <Button
            className="w-full"
            disabled={!hasActiveFilters}
            onClick={handleResetFilters}
            variant="outline"
          >
            Reset filters
          </Button>
        </div>
      </div>
      <DataTable
        loading={isLoading}
        searchKey="name"
        columns={columns}
        data={filteredData}
        enableBatchDelete
        batchDeleteLoading={isDeleting}
        onBatchDelete={async (ids) => {
          await Promise.all(ids.map((id) => deleteProduct(id)));
        }}
      />
    </div>
  );
};

export default ProductClient;
