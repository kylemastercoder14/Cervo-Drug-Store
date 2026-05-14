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
import { Edit, MoreHorizontal, Send, Share2, Trash } from "lucide-react";
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

  const getShareText = () => {
    const preview = stripHtml(data.content).slice(0, 140).trim();
    return preview
      ? `${data.title}\n\n${preview}${stripHtml(data.content).length > 140 ? "..." : ""}`
      : data.title;
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

  const handleNativeShare = async () => {
    const shareUrl = getShareUrl();
    const text = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text,
          url: shareUrl,
        });
      } catch {
        // User cancelled the share dialog.
      }
      return;
    }

    toast.error("Native sharing is not available on this device/browser.");
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
