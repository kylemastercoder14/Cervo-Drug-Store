/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { NewsEventValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveNewsEvent } from "@/data/news-event";

const NewsEventForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const title = initialData ? "Edit News/Event" : "Add News/Event";
  const description = initialData
    ? "Make sure to click save changes after you update the news/event."
    : "Please fill the required fields to add a new news/event.";
  const action = initialData ? "Save Changes" : "Save News/Event";

  const form = useForm<z.infer<typeof NewsEventValidation>>({
    resolver: zodResolver(NewsEventValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          title: "",
          image: "",
          content: "",
        },
  });

  const { mutate: saveNewsEvent, isPending: isSaving } = useSaveNewsEvent(
    initialData ?? ""
  );

  async function onSubmit(values: z.infer<typeof NewsEventValidation>) {
    saveNewsEvent(values, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <>
      <Modal
        className="max-w-lg"
        isOpen={true}
        onClose={onClose}
        title={title}
        description={description}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto grid flex-1 auto-rows-max gap-4">
              <div className="grid gap-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Title"
                  type="text"
                  placeholder="Enter title"
                  isRequired={true}
                  name="title"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.TEXTAREA}
                  label="Content"
                  type="text"
                  placeholder="Enter content"
                  isRequired={true}
                  name="content"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.DROP_ZONE}
                  label="Image"
                  isRequired={true}
                  name="image"
                  disabled={isSaving}
                />
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader className="animate-spin w-4 h-4" />}
                  {action}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default NewsEventForm;
