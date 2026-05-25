"use client";

import { Inbox, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { UploadError, upload } from "@/lib/upload";
import { Button } from "../ui/button";

const ImageUpload = ({
  onImageUpload,
  defaultValue = "",
}: {
  onImageUpload: (url: string) => void;
  defaultValue?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue);
  const pasteTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setImageUrl(defaultValue);
  }, [defaultValue]);

  const getUploadErrorMessage = (error: unknown) => {
    if (error instanceof UploadError) {
      return error.message;
    }

    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return "We could not upload your image right now. Please try again in a moment.";
  };

  const handleUploadFile = useCallback(
    async (file?: File) => {
      if (!file) {
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Please upload a smaller image.");
        return;
      }

      const toastId = toast.loading("Uploading image...");

      try {
        for (let i = 0; i <= 100; i++) {
          await new Promise((resolve) => setTimeout(resolve, 30));
        }

        const { url } = await upload(file);

        toast.dismiss(toastId);
        toast.success("Image uploaded successfully!");
        setImageUrl(url);
        onImageUpload(url);
      } catch (error) {
        setImageUrl("");
        toast.dismiss(toastId);
        toast.error(getUploadErrorMessage(error));
        console.log(error);
      }
    },
    [onImageUpload]
  );

  const handlePaste = useCallback(
    async (event: React.ClipboardEvent<HTMLDivElement>) => {
      const clipboardItems = event.clipboardData?.items;

      if (!clipboardItems) {
        return;
      }

      const imageItem = Array.from(clipboardItems).find((item) =>
        item.type.startsWith("image/")
      );

      if (!imageItem) {
        return;
      }

      const pastedFile = imageItem.getAsFile();

      if (!pastedFile) {
        return;
      }

      event.preventDefault();

      const extension = pastedFile.type.split("/")[1]?.split("+")[0] || "png";
      const screenshotFile = new File(
        [pastedFile],
        `pasted-image-${Date.now()}.${extension}`,
        { type: pastedFile.type }
      );

      await handleUploadFile(screenshotFile);
    },
    [handleUploadFile]
  );

  const handlePasteFromClipboardApi = useCallback(async () => {
    if (!navigator.clipboard?.read) {
      return false;
    }

    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        const imageType = clipboardItem.types.find((type) =>
          type.startsWith("image/")
        );

        if (!imageType) {
          continue;
        }

        const blob = await clipboardItem.getType(imageType);
        const extension = imageType.split("/")[1]?.split("+")[0] || "png";
        const screenshotFile = new File(
          [blob],
          `pasted-image-${Date.now()}.${extension}`,
          { type: imageType }
        );

        await handleUploadFile(screenshotFile);
        return true;
      }
    } catch (error) {
      console.error("Clipboard image read failed:", error);
    }

    return false;
  }, [handleUploadFile]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1, // Accept only one file
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        toast.error("You can only upload one image.");
        return;
      }

      await handleUploadFile(acceptedFiles[0]);
    },
  });

  useEffect(() => {
    if (!imageUrl) {
      pasteTargetRef.current?.focus();
    }
  }, [imageUrl]);

  const handleRemoveImage = () => {
    setImageUrl("");
    toast.info("Image removed.");
    onImageUpload("");
  };

  return (
    <div className="rounded-xl w-full">
      <div
        {...getRootProps({
          className:
            "relative border-dashed border-2 rounded-xl cursor-pointer bg-zinc-100 py-8 flex justify-center items-center flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        })}
        onClick={() => pasteTargetRef.current?.focus()}
        onPaste={handlePaste}
        onKeyDown={async (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
            const didUpload = await handlePasteFromClipboardApi();

            if (didUpload) {
              event.preventDefault();
            }
          }
        }}
        ref={pasteTargetRef}
        tabIndex={imageUrl ? -1 : 0}
      >
        <input {...getInputProps()} />
        {imageUrl ? (
          <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-0 right-0">
              <Button
                variant="destructive"
                type="button"
                size="icon"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Image src={imageUrl} alt="Image" className="object-cover" fill />
          </div>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-[#437634]" />
            <p className="mt-2 text-sm text-slate-400">Drop or paste your image here.</p>
            <p className="mt-1 text-xs text-slate-400">Click the box, then press Ctrl+V to paste a screenshot.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
