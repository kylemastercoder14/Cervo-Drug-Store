"use client";

import React from "react";
import * as XLSX from "xlsx";
import { IconDownload } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  BULK_PRODUCT_TEMPLATE_GUIDELINES,
  BULK_PRODUCT_TEMPLATE_HEADERS,
} from "@/constants/product-bulk-upload";

const Page = () => {
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      [...BULK_PRODUCT_TEMPLATE_HEADERS],
    ]);
    const instructionsSheet = XLSX.utils.aoa_to_sheet([
      ["Bulk Upload Product Guide"],
      [""],
      ["Guidelines"],
      ...BULK_PRODUCT_TEMPLATE_GUIDELINES.map((guide, index) => [
        `${index + 1}. ${guide}`,
      ]),
    ]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");
    XLSX.writeFile(workbook, "bulk-product-template.xlsx");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Bulk Upload Product Template</h1>
        <p className="text-sm text-muted-foreground">
          Use these plain-language Excel headers for bulk product upload.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <pre className="overflow-x-auto text-sm">
          {BULK_PRODUCT_TEMPLATE_HEADERS.join("\n")}
        </pre>
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-2 font-medium">Guidelines</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {BULK_PRODUCT_TEMPLATE_GUIDELINES.map((guide) => (
            <li key={guide}>{guide}</li>
          ))}
        </ul>
      </div>

      <Button onClick={handleDownloadTemplate} variant="secondary">
        <IconDownload className="size-4" />
        <span>Download Template</span>
      </Button>
    </div>
  );
};

export default Page;
