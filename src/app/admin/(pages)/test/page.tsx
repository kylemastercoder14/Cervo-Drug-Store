"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconFileExcel } from "@tabler/icons-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { createBulkProducts, getProductsCount } from "@/actions/product";

const Page = () => {
  const [productCount, setProductCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductCount = async () => {
      const { data } = await getProductsCount();
      if (data) {
        setProductCount(data.count);
      }
    };

    fetchProductCount();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      previewAndSaveData(selectedFile);
    }
  };

  const previewAndSaveData = async (file: File) => {
    if (file) {
      const toastId = toast.loading("Processing file, please wait...");
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);

          console.log("Excel Data:", json);
          setExcelData(json);
          try {
            await createBulkProducts(json);
            toast.success("Data processed successfully");
          } catch (error) {
            console.error(error);
          } finally {
            toast.dismiss(toastId);
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-4xl mb-5">
        Total Products: {productCount}
      </h1>
      <pre className="p-4 bg-gray-100 border rounded text-sm overflow-x-auto">
        {excelData.length > 0
          ? JSON.stringify(excelData, null, 2)
          : "No data uploaded yet."}
      </pre>
      <div className="flex items-center gap-2 mt-4">
        <input
          className="hidden"
          id="file_input"
          type="file"
          ref={fileInputRef}
          accept=".xls,.xlsx"
          onChange={handleFileChange}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          className="h-7 gap-1"
          size="sm"
        >
          <IconFileExcel className="w-4 h-4" />
          Import from Excel
        </Button>
      </div>
    </div>
  );
};

export default Page;
