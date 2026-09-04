/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { PaymentMethodValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSavePaymentMethod } from "@/data/payment-method";

const PaymentMethodForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const title = initialData ? "Edit Payment Method" : "Add Payment Method";
  const description = initialData
    ? "Make sure to click save changes after you update the payment method."
    : "Please fill the required fields to add a new payment method.";
  const action = initialData ? "Save Changes" : "Save Payment Method";

  const form = useForm<z.infer<typeof PaymentMethodValidation>>({
    resolver: zodResolver(PaymentMethodValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          type: "",
          name: "",
          accountName: "",
          accountNumber: "",
          qrCode: "",
          isActive: true,
        },
  });

  const { mutate: savePaymentMethod, isPending: isSaving } =
    useSavePaymentMethod(initialData ?? "");

  async function onSubmit(values: z.infer<typeof PaymentMethodValidation>) {
    savePaymentMethod(values, {
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
                fieldType={FormFieldType.SELECT}
                label="Payment Type"
                placeholder="Select payment type"
                isRequired={true}
                name="type"
                dynamicOptions={[
                  { value: "Bank", label: "Bank" },
                  { value: "E-Wallet", label: "E-Wallet" },
                  { value: "Credit Card", label: "Credit Card" },
                ]}
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Payment Method Name"
                placeholder="GCash, BPI, Visa"
                isRequired={true}
                name="name"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Account Name"
                placeholder="Enter account name"
                isRequired={true}
                name="accountName"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Account Number"
                placeholder="Enter account number"
                isRequired={true}
                name="accountNumber"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DROP_ZONE}
                label="QR Code"
                isRequired={false}
                name="qrCode"
                description="Optional QR code image for bank or e-wallet payments."
                disabled={isSaving}
                className="md:col-span-2"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SWITCH}
                label="Active"
                name="isActive"
                description="Show this payment method as active."
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

export default PaymentMethodForm;
