"use client";

import { Button } from "@/components/ui/button";
import { NewsEventColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, Image as ImageIcon, MoreHorizontal, Send, Trash } from "lucide-react";
import { useState, useTransition } from "react";
import AlertModal from "@/components/ui/alert-modal";
import {
  publishNewsEventToFacebook,
  useDeleteNewsEvent,
} from "@/data/news-event";
import NewsEventForm from "@/components/form/news-event-form";
import { toast } from "sonner";

interface CellActionProps {
  data: NewsEventColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [initialData, setInitialData] = useState<NewsEventColumn | null>(null);
  const [isPublishing, startPublishing] = useTransition();
  const { mutate: deleteNewsEvent, isPending: isDeleting } =
    useDeleteNewsEvent();

  const stripHtml = (value: string) =>
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const getShareUrl = () => {
    if (typeof window === "undefined") {
      return "/#blogs";
    }

    return `${window.location.origin}/#blogs`;
  };

  const getAbsoluteImageUrl = () => {
    if (!data.image) {
      return "";
    }

    if (data.image.startsWith("http://") || data.image.startsWith("https://")) {
      return data.image;
    }

    if (typeof window === "undefined") {
      return data.image;
    }

    return new URL(data.image, window.location.origin).toString();
  };

  const getFacebookCaption = () => {
    const plainContent = stripHtml(data.content);
    const shareUrl = getShareUrl();

    return [
      "Cervo Drug Store News & Events",
      data.title,
      plainContent,
      shareUrl ? `Read more: ${shareUrl}` : null,
      "#CervoDrugStore #NewsAndEvents",
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const copyShareDetails = async () => {
    const caption = getFacebookCaption();
    const absoluteImageUrl = getAbsoluteImageUrl();

    if (
      absoluteImageUrl &&
      typeof ClipboardItem !== "undefined" &&
      navigator.clipboard?.write
    ) {
      try {
        const imageResponse = await fetch(absoluteImageUrl);
        if (!imageResponse.ok) {
          throw new Error("Unable to load the image for clipboard copy.");
        }

        const imageBlob = await imageResponse.blob();
        const clipboardItem = new ClipboardItem({
          "text/plain": new Blob([caption], { type: "text/plain" }),
          [imageBlob.type || "image/png"]: imageBlob,
        });

        await navigator.clipboard.write([clipboardItem]);
        toast.success(
          "Caption and image copied. Paste them into your Facebook post.",
        );
        return;
      } catch {
        // Fall back to caption-only copy below.
      }
    }

    try {
      await navigator.clipboard.writeText(caption);
      toast.success(
        absoluteImageUrl
          ? "Caption copied. Use the image action to open the real image for Facebook."
          : "Caption copied. You can now paste it into Facebook.",
      );
    } catch {
      toast.error("Unable to copy post details on this browser.");
    }
  };

  const openImageForFacebook = () => {
    const absoluteImageUrl = getAbsoluteImageUrl();

    if (!absoluteImageUrl) {
      toast.error("This news/event does not have an image to open.");
      return;
    }

    window.open(absoluteImageUrl, "_blank", "noopener,noreferrer");
  };

  const publishToFacebook = () => {
    const shareUrl = getShareUrl();
    const publishToastId = toast.loading("Publishing to Facebook Page...");

    startPublishing(async () => {
      try {
        await publishNewsEventToFacebook({
          newsId: data.id,
          title: data.title,
          content: data.content,
          image: data.image,
          link: shareUrl,
        });

        toast.dismiss(publishToastId);
        toast.success("Post published to Facebook Page.");
      } catch (error) {
        toast.dismiss(publishToastId);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to publish this post to Facebook.",
        );
      }
    });
  };

  const onDelete = async () => {
    deleteNewsEvent(data.id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const onUpdate = () => {
    setInitialData(data);
    setFormOpen(true);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isDeleting}
        onConfirm={onDelete}
      />
      {formOpen && (
        <NewsEventForm
          initialData={initialData}
          onClose={() => setFormOpen(false)}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={copyShareDetails}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Facebook caption
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openImageForFacebook}>
            <ImageIcon className="w-4 h-4 mr-2" />
            Open post image
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={publishToFacebook}
            disabled={isPublishing}
          >
            <Send className="w-4 h-4 mr-2" />
            {isPublishing ? "Publishing..." : "Post to Facebook Page"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
