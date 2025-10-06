/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { BannerValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveBanner } from "@/data/banner";

const BannerForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const title = initialData ? "Edit Banner" : "Add Banner";
  const description = initialData
    ? "Make sure to click save changes after you update the banner."
    : "Please fill the required fields to add a new banner.";
  const action = initialData ? "Save Changes" : "Save Banner";
  const form = useForm<z.infer<typeof BannerValidation>>({
    resolver: zodResolver(BannerValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          image: initialData.banner ?? ""
        }
      : {
          image: "",
        },
  });

  const { mutate: saveBanner, isPending: isSaving } = useSaveBanner(
    initialData ?? ""
  );

  async function onSubmit(values: z.infer<typeof BannerValidation>) {
    saveBanner(values, {
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

export default BannerForm;
