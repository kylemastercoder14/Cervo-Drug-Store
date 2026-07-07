"use client";

import ImageUpload from "@/components/globals/image-uploader";
import { upload } from "@/lib/upload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductColumn } from "./column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Edit,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  RefreshCcw,
  RotateCw,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import AlertModal from "@/components/ui/alert-modal";
import ProductForm from "@/components/form/product-form";
import { useDeleteProduct, useSaveProduct } from "@/data/product";
import { toast } from "sonner";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: saveProduct, isPending: isSavingImage } = useSaveProduct(
    {
      id: data.id,
    },
    () => {
      setImageDialogOpen(false);
      setUploadedImage("");
      resetImageEditor();
    }
  );

  const resetImageEditor = () => {
    setRotation(0);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  useEffect(() => {
    if (!uploadedImage) {
      resetImageEditor();
    }
  }, [uploadedImage]);

  const onDelete = async () => {
    deleteProduct(data.id, {
      onSuccess: () => setOpen(false),
    });
  };

  const onUpdate = () => setFormOpen(true);

  const onAddImage = () => {
    if (data.image) {
      return;
    }

    setImageDialogOpen(true);
  };

  const buildEditedImage = async () => {
    const response = await fetch(uploadedImage);
    const sourceBlob = await response.blob();
    const objectUrl = URL.createObjectURL(sourceBlob);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image."));
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      const outputSize = 1200;
      const previewSize = 320;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to initialize image editor.");
      }

      canvas.width = outputSize;
      canvas.height = outputSize;

      const baseScale = Math.max(
        outputSize / image.width,
        outputSize / image.height
      );

      ctx.clearRect(0, 0, outputSize, outputSize);
      ctx.save();
      ctx.translate(
        outputSize / 2 + (offsetX * outputSize) / previewSize,
        outputSize / 2 + (offsetY * outputSize) / previewSize
      );
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(baseScale * zoom, baseScale * zoom);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      ctx.restore();

      const editedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
            return;
          }

          reject(new Error("Failed to process image."));
        }, sourceBlob.type || "image/png");
      });

      const originalName = uploadedImage.split("/").pop()?.split("?")[0] || "product-image";
      const extension = sourceBlob.type.split("/")[1]?.split("+")[0] || "png";

      return new File([editedBlob], `edited-${originalName}.${extension}`, {
        type: sourceBlob.type || "image/png",
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const onSaveImage = async () => {
    if (!uploadedImage) {
      return;
    }

    try {
      setIsProcessingImage(true);

      const hasImageEdits =
        rotation !== 0 || zoom !== 1 || offsetX !== 0 || offsetY !== 0;

      const finalImageUrl = hasImageEdits
        ? (await upload(await buildEditedImage())).url
        : uploadedImage;

      saveProduct({
        name: data.name,
        image: finalImageUrl,
        price: data.priceValue,
        description: data.description || "",
        isFeatured: data.isFeatured,
        isVatItem: data.isVatItem,
        isPrescriptionRequired: data.isPrescription,
        categoryTag: data.categoryId || undefined,
      });
    } catch (error) {
      console.error("Failed to process image:", error);
      toast.error("We could not process that image. Please try again.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} loading={isDeleting} onConfirm={onDelete} />
      {formOpen && <ProductForm productId={data.id} onClose={() => setFormOpen(false)} />}
      <Dialog
        open={imageDialogOpen}
        onOpenChange={(nextOpen) => {
          setImageDialogOpen(nextOpen);
          if (!nextOpen) {
            setUploadedImage("");
            resetImageEditor();
          }
        }}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add Product Image</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] pr-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{data.name}</p>
              <ImageUpload
                defaultValue={uploadedImage}
                guidelines="Recommended resolution: 1200 x 1200 px. Use JPG, PNG, WebP, or SVG. Max file size: 10 MB."
                onImageUpload={setUploadedImage}
              />
              {uploadedImage && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Adjust image</p>
                      <p className="text-sm text-muted-foreground">
                        Rotate and crop the uploaded image before saving.
                      </p>
                    </div>
                    <Button
                      onClick={resetImageEditor}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  <div className="mx-auto h-[320px] w-full overflow-hidden rounded-xl border bg-muted">
                    <div className="relative h-full w-full">
                      {/* The preview intentionally mirrors the canvas export controls. */}
                      <Image
                        alt="Uploaded product preview"
                        className="absolute inset-0 h-full w-full object-contain"
                        fill
                        sizes="320px"
                        src={uploadedImage}
                        style={{
                          transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom}) rotate(${rotation}deg)`,
                          transformOrigin: "center center",
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Zoom</Label>
                      <Slider
                        max={2.5}
                        min={1}
                        onValueChange={(value) => setZoom(value[0] ?? 1)}
                        step={0.1}
                        value={[zoom]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rotate</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          max={270}
                          min={0}
                          onValueChange={(value) => setRotation(value[0] ?? 0)}
                          step={90}
                          value={[rotation]}
                        />
                        <Button
                          onClick={() =>
                            setRotation(
                              (currentRotation) => (currentRotation + 90) % 360
                            )
                          }
                          size="icon"
                          type="button"
                          variant="outline"
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Move left / right</Label>
                      <Slider
                        max={120}
                        min={-120}
                        onValueChange={(value) => setOffsetX(value[0] ?? 0)}
                        step={5}
                        value={[offsetX]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Move up / down</Label>
                      <Slider
                        max={120}
                        min={-120}
                        onValueChange={(value) => setOffsetY(value[0] ?? 0)}
                        step={5}
                        value={[offsetY]}
                      />
                    </div>
                  </div>
                </div>
              )}
              <Button
                className="w-full"
                disabled={!uploadedImage || isSavingImage || isProcessingImage}
                onClick={onSaveImage}
                type="button"
              >
                {(isSavingImage || isProcessingImage) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save image
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onUpdate}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          {!data.image && (
            <DropdownMenuItem onClick={onAddImage}>
              <ImagePlus className="w-4 h-4 mr-2" />
              Add image
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
