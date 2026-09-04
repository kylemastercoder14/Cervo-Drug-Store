/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { BranchValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveBranch } from "@/data/branch";

const BranchForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const title = initialData ? "Edit Branch" : "Add Branch";
  const description = initialData
    ? "Make sure to click save changes after you update the branch."
    : "Please fill the required fields to add a new branch.";
  const action = initialData ? "Save Changes" : "Save Branch";
  const form = useForm<z.infer<typeof BranchValidation>>({
    resolver: zodResolver(BranchValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          name: "",
          address: "",
          storeHours: "",
          contactNumber: "",
          email: "",
          manager: "",
        },
  });

  const { mutate: saveBranch, isPending: isSaving } = useSaveBranch(
    initialData ?? ""
  );

  async function onSubmit(values: z.infer<typeof BranchValidation>) {
    saveBranch(values, {
      onSuccess: () => onClose(),
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
            <div className="grid gap-4 md:grid-cols-2">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Branch Name"
                placeholder="Enter branch name"
                isRequired={true}
                name="name"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Store Hours"
                placeholder="8:00 AM - 8:00 PM"
                isRequired={true}
                name="storeHours"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                label="Contact Number"
                placeholder="Enter contact number"
                isRequired={true}
                name="contactNumber"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Email"
                placeholder="branch@example.com"
                isRequired={true}
                name="email"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Branch Manager"
                placeholder="Enter branch manager"
                isRequired={true}
                name="manager"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                label="Branch Address"
                placeholder="Enter complete branch address"
                isRequired={true}
                name="address"
                disabled={isSaving}
                className="md:col-span-2"
              />
              <Button type="submit" disabled={isSaving} className="md:col-span-2">
                {isSaving && <Loader className="animate-spin w-4 h-4" />}
                {action}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default BranchForm;
