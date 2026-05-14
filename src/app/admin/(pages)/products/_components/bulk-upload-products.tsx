"use client";

import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { IconDownload, IconFileExcel, IconUpload } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createBulkProducts } from "@/actions/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BULK_PRODUCT_TEMPLATE_COLUMNS,
  BULK_PRODUCT_TEMPLATE_GUIDELINES,
  BULK_PRODUCT_TEMPLATE_HEADERS,
  BULK_PRODUCT_TEMPLATE_HEADER_TO_FIELD,
} from "@/constants/product-bulk-upload";

type ParsedBulkProductRow = {
  name: string;
  description?: string;
  price: number;
  categoryTag?: string;
  isFeatured?: boolean;
  isPrescriptionRequired?: boolean;
  isVatItem?: boolean;
  image?: string;
};

const normalizeBoolean = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (["true", "yes", "1"].includes(normalizedValue)) {
      return true;
    }

    if (["false", "no", "0", ""].includes(normalizedValue)) {
      return false;
    }
  }

  return false;
};

const normalizeString = (value: unknown) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const normalizePrice = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value.trim());
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
};

const BulkUploadProducts = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [previewRows, setPreviewRows] = useState<ParsedBulkProductRow[]>([]);

  const hasPreviewRows = previewRows.length > 0;

  const previewColumns = useMemo(
    () => [...BULK_PRODUCT_TEMPLATE_COLUMNS],
    []
  );

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      [...BULK_PRODUCT_TEMPLATE_HEADERS],
    ]);
    const instructionsSheet = XLSX.utils.aoa_to_sheet([
      ["Bulk Upload Product Guide"],
      [""],
      ["Columns"],
      ...BULK_PRODUCT_TEMPLATE_HEADERS.map((header, index) => [
        `${index + 1}. ${header}`,
      ]),
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

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      setSelectedFileName("");
      setPreviewRows([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const parseExcelFile = (file: File) => {
    const toastId = toast.loading("Reading Excel file...");
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileData = event.target?.result;

        if (!fileData) {
          toast.error("No data found in the selected file.");
          return;
        }

        const workbook = XLSX.read(fileData, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          {
            defval: "",
          }
        );

        const getCellValue = (
          row: Record<string, unknown>,
          headerLabel: string
        ) => {
          const fieldName = BULK_PRODUCT_TEMPLATE_HEADER_TO_FIELD[headerLabel];
          return row[headerLabel] ?? row[fieldName] ?? "";
        };

        const parsedRows = jsonRows
          .map((row) => ({
            name: normalizeString(getCellValue(row, "Product Name")),
            description:
              normalizeString(getCellValue(row, "Description")) || undefined,
            price: normalizePrice(getCellValue(row, "Price")),
            categoryTag:
              normalizeString(getCellValue(row, "Category")) || undefined,
            isFeatured: normalizeBoolean(
              getCellValue(row, "Show on Homepage")
            ),
            isPrescriptionRequired: normalizeBoolean(
              getCellValue(row, "Prescription Required")
            ),
            isVatItem: normalizeBoolean(getCellValue(row, "VAT Exempt")),
            image: normalizeString(getCellValue(row, "Image URL")) || undefined,
          }))
          .filter((row) => row.name);

        setPreviewRows(parsedRows);

        if (parsedRows.length === 0) {
          toast.error("No valid product rows were found in the Excel file.");
          return;
        }

        toast.success(`${parsedRows.length} product row(s) loaded for review.`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to read the Excel file.");
      } finally {
        toast.dismiss(toastId);
      }
    };

    reader.onerror = () => {
      toast.dismiss(toastId);
      toast.error("Failed to read the selected file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setSelectedFileName(selectedFile.name);
    parseExcelFile(selectedFile);
  };

  const handleSaveBulkUpload = async () => {
    if (!hasPreviewRows) {
      toast.error("Upload an Excel file first.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await createBulkProducts(previewRows);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });

      const summary = response.data;
      toast.success(
        `${summary?.createdCount || 0} created, ${
          summary?.skippedCount || 0
        } skipped, ${summary?.errorCount || 0} failed.`
      );
      handleDialogChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Bulk upload failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <IconFileExcel className="size-4" />
        <span>Bulk Upload</span>
      </Button>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
          <DialogDescription>
            Upload an Excel file that matches the product template, review the
            extracted rows, then save the new products. Existing products will
            be skipped.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadTemplate}
            >
              <IconDownload className="size-4" />
              <span>Download Template</span>
            </Button>
          </div>

          <div className="rounded-lg border p-3 text-sm text-muted-foreground">
            Template headers: {BULK_PRODUCT_TEMPLATE_HEADERS.join(", ")}
            {selectedFileName ? ` | Uploaded file: ${selectedFileName}` : ""}
          </div>

          <div className="rounded-lg border">
            <ScrollArea className="h-[380px] w-full">
              {hasPreviewRows ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {previewColumns.map((column) => (
                        <TableHead key={column.field}>{column.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row, index) => (
                      <TableRow key={`${row.name}-${index}`}>
                        {previewColumns.map((column) => (
                          <TableCell key={`${column.field}-${index}`}>
                            {String(row[column.field] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-[380px] items-center justify-center p-6 text-sm text-muted-foreground">
                  <div className="flex max-w-md flex-col items-center gap-3 text-center">
                    <IconUpload className="size-8" />
                    <p>
                      Upload a `.xls` or `.xlsx` file to preview the extracted
                      product rows before saving.
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDialogChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveBulkUpload}
            disabled={!hasPreviewRows || isSaving}
          >
            {isSaving && <Loader className="mr-2 size-4 animate-spin" />}
            Save Products
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadProducts;
