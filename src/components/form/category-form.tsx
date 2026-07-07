/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { CategoryValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveCategory } from "@/data/category";

const CategoryForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const title = initialData ? "Edit Category" : "Add Category";
  const description = initialData
    ? "Make sure to click save changes after you update the category."
    : "Please fill the required fields to add a new category.";
  const action = initialData ? "Save Changes" : "Save Category";
  const form = useForm<z.infer<typeof CategoryValidation>>({
    resolver: zodResolver(CategoryValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          image: "",
          name: "",
        },
  });

  const { mutate: saveCategory, isPending: isSaving } = useSaveCategory(
    initialData ?? ""
  );

  async function onSubmit(values: z.infer<typeof CategoryValidation>) {
    saveCategory(values, {
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
                  label="Name"
                  placeholder="Enter category name"
                  isRequired={true}
                  name="name"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.DROP_ZONE}
                  label="Image"
                  isRequired={true}
                  name="image"
                  description="Recommended resolution: 600 x 600 px. Use JPG, PNG, WebP, or SVG. Max file size: 10 MB."
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

export default CategoryForm;
