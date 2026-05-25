"use client";

import React from "react";
import * as XLSX from "xlsx";
import { IconFileExcel } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BULK_PRODUCT_TEMPLATE_COLUMNS } from "@/constants/product-bulk-upload";
import { useGetProducts } from "@/data/product";

const ExportProducts = () => {
  const { data: productData, isLoading } = useGetProducts();

  const handleExport = () => {
    const products = productData?.data;

    if (!products || products.length === 0) {
      toast.error("No products available to export.");
      return;
    }

    const worksheetData = products.map((product) =>
      BULK_PRODUCT_TEMPLATE_COLUMNS.reduce<Record<string, string | number>>(
        (row, column) => {
          const fieldValueMap = {
            name: product.name,
            description: product.description || "",
            price: product.price,
            categoryTag: product.categoryTag || "",
            isFeatured: product.isFeatured ? "Yes" : "No",
            isPrescriptionRequired: product.isPrescriptionRequired
              ? "Yes"
              : "No",
            isVatItem: product.isVatItem ? "Yes" : "No",
            image: product.image || "",
          } satisfies Record<(typeof column.field), string | number>;

          row[column.label] = fieldValueMap[column.field];
          return row;
        },
        {}
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products-export.xlsx");
  };

  return (
    <Button onClick={handleExport} type="button" variant="outline">
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <IconFileExcel className="size-4" />
      )}
      <span>Export to Excel</span>
    </Button>
  );
};

export default ExportProducts;
