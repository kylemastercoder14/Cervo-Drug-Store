/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckoutValidation } from "@/lib/validators";
import { Form } from "../ui/form";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Button } from "../ui/button";
import { Circle, Loader2 } from "lucide-react";
import { useAddressData } from "@/lib/address-selection";
import Image from "next/image";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import useCart from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/order";
import { toast } from "sonner";

const CheckoutForm = ({ user }: { user: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { items, removeAll } = useCart();
  const totalPrice = items.reduce(
    (total, item) =>
      item.discountedPrice === 0
        ? total + item.price * item.quantity
        : total + item.discountedPrice * item.quantity,
    0
  );

  const isPrescriptionRequired = items.some(
    (item) => item.isPrescriptionRequired
  );

  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Gcash");

  const handleSelectPaymentMethod = (name: string) => {
    setSelectedPaymentMethod(name);
  };

  const form = useForm<z.infer<typeof CheckoutValidation>>({
    resolver: zodResolver(CheckoutValidation),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phoneNumber: "",
      zipCode: "",
      email: user.emailAddresses[0].emailAddress ?? "",
      region: "",
      province: "",
      municipality: "",
      barangay: "",
      houseNo: "",
      acceptPolicy: false,
      prescription: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CheckoutValidation>) => {
    setIsLoading(true);
    if (isPrescriptionRequired && !values.prescription) {
      toast.error("One of the items in your cart requires a prescription.");
      setIsLoading(false);
      return;
    }
    createOrder(values, user.id, items, selectedPaymentMethod)
      .then((data) => {
        if (data.success) {
          removeAll();
          toast.success(data.success);
          router.push("/");
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const selectedRegionName = form.watch("region");
  const selectedProvinceName = form.watch("province");
  const selectedMunicipalityName = form.watch("municipality");

  const {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
  } = useAddressData(
    selectedRegionName,
    selectedProvinceName,
    selectedMunicipalityName
  );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-10 mt-10">
          <div>
            <p className="border-b pb-3 border-zinc-300 mb-5">
              Billing Details
            </p>
            <div className="grid gap-3">
              <div className="grid xl:grid-cols-2 grid-cols-1 gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="First Name"
                  name="firstName"
                  placeholder="Juan"
                  type="text"
                  isRequired={true}
                  disabled={isLoading}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Last Name"
                  name="lastName"
                  placeholder="Dela Cruz"
                  type="text"
                  isRequired={true}
                  disabled={isLoading}
                />
              </div>
              <div className="grid xl:grid-cols-3 grid-cols-1 gap-3">
                <div className="col-span-2">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Complete Address (House Number, Building and Street Name) "
                    type="text"
                    name="houseNo"
                    placeholder="Blk 123 L1 Ph2 Emerald St."
                    isRequired={true}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-1">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Postal / ZIP Code"
                    type="text"
                    name="zipCode"
                    placeholder="4114"
                    isRequired={true}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Region / State"
                  dynamicOptions={regionOptions.map((region) => ({
                    label: region,
                    value: region,
                  }))}
                  name="region"
                  placeholder="Select Region / State"
                  isRequired={true}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Province"
                  dynamicOptions={provinceOptions.map((province) => ({
                    label: province,
                    value: province,
                  }))}
                  name="province"
                  placeholder="Select Province"
                  isRequired={true}
                  disabled={isLoading || !selectedRegionName}
                />
              </div>
              <div className="grid gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Municipality / City"
                  dynamicOptions={municipalityOptions.map((city) => ({
                    label: city,
                    value: city,
                  }))}
                  name="municipality"
                  placeholder="Select Municipality / City"
                  isRequired={true}
                  disabled={
                    isLoading || !selectedRegionName || !selectedProvinceName
                  }
                />
              </div>
              <div className="grid gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Barangay"
                  dynamicOptions={barangayOptions.map((barangay) => ({
                    label: barangay,
                    value: barangay,
                  }))}
                  name="barangay"
                  placeholder="Select Barangay"
                  isRequired={true}
                  disabled={
                    isLoading ||
                    !selectedRegionName ||
                    !selectedProvinceName ||
                    !selectedMunicipalityName
                  }
                />
              </div>
              <div className="grid xl:grid-cols-2 grid-cols-1 gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Email Address"
                  name="email"
                  placeholder="jdelacruz@gmail.com"
                  type="email"
                  isRequired={true}
                  disabled={isLoading}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.PHONE_INPUT}
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="09123456789"
                  type="phone"
                  isRequired={true}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.DROP_ZONE}
                  label="Prescription"
                  name="prescription"
                  isRequired={false}
                  disabled={isLoading}
                />
              </div>
              <p className="text-sm">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our privacy policy.
              </p>
              <div className="grid gap-3 mt-2">
                <CustomFormField
                  name="acceptPolicy"
                  control={form.control}
                  fieldType={FormFieldType.CHECKBOX}
                  label="I’ve read and accept the Personal Information Protection Policy"
                  isRequired={true}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="border-b pb-3 border-zinc-300 mb-5">
              Payment Details
            </p>
            <div className="flex flex-col space-y-3">
              <label
                className={`${
                  selectedPaymentMethod === "Gcash"
                    ? "cursor-pointer"
                    : "cursor-default"
                } w-full`}
              >
                <input
                  type="radio"
                  className="peer sr-only"
                  name="payment_method"
                  onChange={() => handleSelectPaymentMethod("Gcash")}
                  checked={selectedPaymentMethod === "Gcash"}
                  disabled={isLoading}
                />
                <div
                  className={`w-full rounded-md bg-zinc-100 p-2 transition-all shadow-md border ${
                    selectedPaymentMethod === "Gcash"
                      ? "border-green-800"
                      : "border-zinc-300"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        {selectedPaymentMethod === "Gcash" ? (
                          <IconCircleCheckFilled className="text-green-800" />
                        ) : (
                          <Circle />
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-x-2">
                            <p className="font-semibold text-sm">Gcash</p>
                            <Badge variant="default">Recommended</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Simple and easy payments via GCash.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <Image
                          src="/brands/gcash.png"
                          alt="Gcash"
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </label>
              <label
                className={`${
                  selectedPaymentMethod === "Maya"
                    ? "cursor-pointer"
                    : "cursor-default"
                } w-full`}
              >
                <input
                  type="radio"
                  className="peer sr-only"
                  name="payment_method"
                  onChange={() => handleSelectPaymentMethod("Maya")}
                  checked={selectedPaymentMethod === "Maya"}
                  disabled={isLoading}
                />
                <div
                  className={`w-full rounded-md bg-zinc-100 p-2 transition-all shadow-md border ${
                    selectedPaymentMethod === "Maya"
                      ? "border-green-800"
                      : "border-zinc-300"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        {selectedPaymentMethod === "Maya" ? (
                          <IconCircleCheckFilled className="text-green-800" />
                        ) : (
                          <Circle />
                        )}
                        <div className="flex flex-col">
                          <p className="font-semibold text-sm">Maya</p>
                          <p className="text-xs text-muted-foreground">
                            Payments via Maya wallet.
                          </p>
                        </div>
                      </div>
                      <Image
                        src="/brands/maya.png"
                        alt="Maya"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                </div>
              </label>

              <label
                className={`${
                  selectedPaymentMethod === "COD"
                    ? "cursor-pointer"
                    : "cursor-default"
                } w-full`}
              >
                <input
                  type="radio"
                  className="peer sr-only"
                  name="payment_method"
                  onChange={() => handleSelectPaymentMethod("COD")}
                  checked={selectedPaymentMethod === "COD"}
                  disabled={isLoading}
                />
                <div
                  className={`w-full rounded-md bg-zinc-100 p-2 transition-all shadow-md border ${
                    selectedPaymentMethod === "COD"
                      ? "border-green-800"
                      : "border-zinc-300"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        {selectedPaymentMethod === "COD" ? (
                          <IconCircleCheckFilled className="text-green-800" />
                        ) : (
                          <Circle />
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-x-2">
                            <p className="font-semibold text-sm">
                              Cash on Delivery
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Get it after 3 hours or as soon as possible.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <Image
                          src="/brands/cod.png"
                          alt="COD"
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            <p className="border-b pb-3 border-zinc-300 mb-5 mt-10">
              Product Summary
            </p>
            <div className="bg-zinc-100 px-4 py-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">Product</p>
                <p className="font-semibold text-lg">Subtotal</p>
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mt-1"
                >
                  <p className="text-sm">{item.name}</p>
                </div>
              ))}
              <div className="flex items-center justify-between mt-1">
                <p className="font-semibold">Subtotal</p>
                <p className="font-semibold">{formatPrice(totalPrice)}</p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">{formatPrice(totalPrice)}</p>
              </div>
            </div>
            <div className="flex items-end justify-end mt-5 gap-5">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                size="sm"
              >
                {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                PLACE ORDER
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
