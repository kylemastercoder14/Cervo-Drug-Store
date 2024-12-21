/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { StaffValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveStaff } from "@/data/manage-staff";

const StaffForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const title = initialData ? "Edit Staff" : "Add Staff";
  const description = initialData
    ? "Make sure to click save changes after you update the staff."
    : "Please fill the required fields to add a new staff.";
  const action = initialData ? "Save Changes" : "Save Staff";

  const form = useForm<z.infer<typeof StaffValidation>>({
    resolver: zodResolver(StaffValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          name: "",
          email: "",
          password: "",
          role: "",
        },
  });

  const { mutate: saveStaff, isPending: isSaving } = useSaveStaff(
    initialData ?? ""
  );

  async function onSubmit(values: z.infer<typeof StaffValidation>) {
    saveStaff(values, {
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
                  type="text"
                  placeholder="Enter Name"
                  isRequired={true}
                  name="name"
                  disabled={isSaving}
                />
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Email"
                    type="email"
                    placeholder="Enter Email"
                    isRequired={true}
                    name="email"
                    disabled={isSaving}
                  />
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Password"
                    type="password"
                    placeholder="Enter Password"
                    isRequired={true}
                    name="password"
                    disabled={isSaving}
                  />
                </div>
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Role"
                  placeholder="Select Role"
                  isRequired={true}
                  name="role"
                  dynamicOptions={[
                    { value: "Admin", label: "Admin" },
                    { value: "Staff", label: "Staff" },
                  ]}
                  disabled={isSaving}
                />
                <Button type="submit" disabled={isSaving} size="sm">
                  {isSaving && <Loader className="animate-spin w-4 h-4 mr-2" />}
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

export default StaffForm;
