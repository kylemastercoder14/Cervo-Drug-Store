/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { LaboratoryServiceValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveLaboratoryServiceCategory } from "@/data/laboratory-services";

const LaboratoryServiceForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const title = initialData
    ? "Edit Laboratory Service Category"
    : "Add Laboratory Service Category";
  const description = initialData
    ? "Update the category and its available laboratory services."
    : "Create a category like Serology or Hematology, then list the services under it.";
  const action = initialData ? "Save Changes" : "Save Category";

  const form = useForm<z.infer<typeof LaboratoryServiceValidation>>({
    resolver: zodResolver(LaboratoryServiceValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || "",
          servicesText: Array.isArray(initialData.services)
            ? initialData.services.join("\n")
            : "",
          displayOrder: initialData.displayOrder || 0,
          isActive: initialData.isActive ?? true,
        }
      : {
          name: "",
          description: "",
          servicesText: "",
          displayOrder: 0,
          isActive: true,
        },
  });

  const { mutate: saveLaboratoryServiceCategory, isPending: isSaving } =
    useSaveLaboratoryServiceCategory(initialData ?? "");

  async function onSubmit(values: z.infer<typeof LaboratoryServiceValidation>) {
    saveLaboratoryServiceCategory(values, {
      onSuccess: (data) => {
        if (data.success) {
          onClose();
        }
      },
    });
  }

  return (
    <Modal
      className="max-w-2xl"
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
                label="Category"
                placeholder="e.g. Hematology"
                isRequired={true}
                name="name"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                label="Description"
                placeholder="Short description shown on the website"
                isRequired={false}
                name="description"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                label="Services"
                description="Enter one laboratory service per line."
                placeholder={"Blood Typing w/ Rh\nClotting / Bleeding Time\nComplete Blood Count"}
                isRequired={true}
                name="servicesText"
                disabled={isSaving}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Display Order"
                  type="number"
                  placeholder="0"
                  isRequired={false}
                  name="displayOrder"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SWITCH}
                  label="Active"
                  description="Show this category on the website"
                  name="isActive"
                  disabled={isSaving}
                />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader className="h-4 w-4 animate-spin" />}
                {action}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default LaboratoryServiceForm;
