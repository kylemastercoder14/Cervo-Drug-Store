"use client";

import { FileText, X, Upload } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { upload } from "@/lib/upload";
import { Button } from "../ui/button";

const DocumentUpload = ({
  onDocumentUpload,
  defaultValue = "",
  accept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc", ".docx"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB default
}: {
  onDocumentUpload: (url: string) => void;
  defaultValue?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
}) => {
  const [documentUrl, setDocumentUrl] = useState<string>(defaultValue);
  const [fileName, setFileName] = useState<string>("");

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxFiles: 1,
    maxSize,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        toast.error("You can only upload one document.");
        return;
      }

      const file = acceptedFiles[0];

      if (file.size > maxSize) {
        toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB.`);
        return;
      }

      const toastId = toast.loading("Uploading document...");

      try {
        const { url } = await upload(file);
        toast.dismiss(toastId);
        toast.success("Document uploaded successfully!");
        setDocumentUrl(url);
        setFileName(file.name);
        onDocumentUpload(url);
      } catch (error) {
        setDocumentUrl("");
        setFileName("");
        toast.dismiss(toastId);
        toast.error("Document upload failed.");
        console.log(error);
      }
    },
  });

  const handleRemoveDocument = () => {
    setDocumentUrl("");
    setFileName("");
    onDocumentUpload("");
  };

  return (
    <div className="w-full">
      {documentUrl ? (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{fileName || "Document"}</p>
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View document
              </a>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveDocument}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, DOC, DOCX (MAX. {maxSize / (1024 * 1024)}MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

