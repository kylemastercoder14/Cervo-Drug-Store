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
import { Circle, Loader2, PlusCircle } from "lucide-react";
import { useAddressData } from "@/lib/address-selection";
import Image from "next/image";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import useCart from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/order";
import { toast } from "sonner";
import { Address, User } from "@prisma/client";
import CustomOption, { RadioGroup } from "../globals/custom-option";

interface CheckoutFormProps extends User {
  address: Address[];
}

const CheckoutForm = ({
  user,
  email,
}: {
  user: CheckoutFormProps | null;
  email: string;
}) => {
  const defaultAddressId =
    user?.address.find((address) => address.isDefault)?.id || "";
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(defaultAddressId);
  const { items, removeAll } = useCart();
  const totalPrice = items.reduce(
    (total, item) =>
      item.discountedPrice === 0
        ? total + item.price * item.quantity
        : total + item.discountedPrice * item.quantity,
    0
  );

  // Calculate discount and grand total conditionally
  const isEligibleForDiscount = user?.seniorPwdId && user.seniorPwdIdImage;
  const discount = isEligibleForDiscount ? totalPrice * 0.2 : 0;
  const grandTotal = totalPrice - discount;

  const isPrescriptionRequired = items.some(
    (item) => item.isPrescriptionRequired
  );

  const router = useRouter();
  const [selectedOrderOption, setSelectedOrderOption] = useState("Pick-Up");

  const handleSelectOrderOption = (name: string) => {
    setSelectedOrderOption(name);
  };

  const form = useForm<z.infer<typeof CheckoutValidation>>({
    resolver: zodResolver(CheckoutValidation),
    defaultValues: {
      email: email || "",
      acceptPolicy: false,
      prescription: "",
      branch: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CheckoutValidation>) => {
    setIsLoading(true);
    if (isPrescriptionRequired && !values.prescription) {
      toast.error("One of the items in your cart requires a prescription.");
      setIsLoading(false);
      return;
    }
    createOrder(
      values,
      user?.id as string,
      items,
      selectedOrderOption,
      selectedAddress,
      grandTotal
    )
      .then((data) => {
        if (data.success) {
          removeAll();
          toast.success(data.success);
          router.push("/my-profile");
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-10 mt-10">
          <div>
            <p className="border-b pb-3 border-zinc-300 mb-5">
              Billing Details
            </p>
            <div className="grid gap-3">
              <p>Ship to:</p>
              {user?.address && user?.address.length > 0 ? (
                <RadioGroup
                  value={selectedAddress}
                  onChangeAction={setSelectedAddress}
                >
                  {user?.address.map((address) => (
                    <CustomOption key={address.id} value={address.id}>
                      <div>
                        <p className="font-semibold">{`${address.firstName} ${address.lastName}`}</p>
                        <p className="text-muted-foreground">
                          {`${address.homeAddress}, ${address.barangay}, ${address.city}, ${address.province}`}
                        </p>
                      </div>
                    </CustomOption>
                  ))}
                </RadioGroup>
              ) : (
                <Button
                  type="button"
                  onClick={() => router.push("/my-profile/addresses")}
                  variant="secondary"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add your address
                </Button>
              )}
              <div className="grid gap-3">
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
              </div>
              <div className="grid gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Branch"
                  name="branch"
                  placeholder="Select Branch"
                  dynamicOptions={[
                    {
                      label:
                        "No. 472-A Elisco Rd., Brgy. San Joaquin, Pasig City",
                      value:
                        "No. 472-A Elisco Rd., Brgy. San Joaquin, Pasig City",
                    },
                    {
                      label:
                        "152-A 12th Avenue, J.P Rizal Ext., East Rembo, Taguig City",
                      value:
                        "152-A 12th Avenue, J.P Rizal Ext., East Rembo, Taguig City",
                    },
                  ]}
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
            <p className="border-b pb-3 border-zinc-300 mb-5">Order Option</p>
            <div className="flex flex-col space-y-3">
              <label
                className={`${
                  selectedOrderOption === "Pick-Up"
                    ? "cursor-pointer"
                    : "cursor-default"
                } w-full`}
              >
                <input
                  type="radio"
                  className="peer sr-only"
                  name="payment_method"
                  onChange={() => handleSelectOrderOption("Pick-Up")}
                  checked={selectedOrderOption === "Pick-Up"}
                  disabled={isLoading}
                />
                <div
                  className={`w-full rounded-md bg-zinc-100 p-2 transition-all shadow-md border ${
                    selectedOrderOption === "Pick-Up"
                      ? "border-green-800"
                      : "border-zinc-300"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        {selectedOrderOption === "Pick-Up" ? (
                          <IconCircleCheckFilled className="text-green-800" />
                        ) : (
                          <Circle />
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-x-2">
                            <p className="font-semibold text-sm">Pick-Up</p>
                            <Badge variant="default">Recommended</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <div className="bg-green-600 w-14 h-14 scale-75 text-white flex items-center justify-center text-xs rounded-lg">
                          Pick-up
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
              <label
                className={`${
                  selectedOrderOption === "Delivery"
                    ? "cursor-pointer"
                    : "cursor-default"
                } w-full`}
              >
                <input
                  type="radio"
                  className="peer sr-only"
                  name="payment_method"
                  onChange={() => handleSelectOrderOption("Delivery")}
                  checked={selectedOrderOption === "Delivery"}
                  disabled={isLoading}
                />
                <div
                  className={`w-full rounded-md bg-zinc-100 p-2 transition-all shadow-md border ${
                    selectedOrderOption === "Delivery"
                      ? "border-green-800"
                      : "border-zinc-300"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        {selectedOrderOption === "Delivery" ? (
                          <IconCircleCheckFilled className="text-green-800" />
                        ) : (
                          <Circle />
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-x-2">
                            <p className="font-semibold text-sm">Delivery</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <div className="bg-red-600 w-14 h-14 scale-75 text-white flex items-center justify-center text-xs rounded-lg">
                          Delivery
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            {selectedOrderOption === "Delivery" && (
              <>
                <p className="border-b pb-3 border-zinc-300 mb-5 mt-10">
                  Scan to pay
                </p>
                <div className="relative my-3 w-[200px] h-[200px]">
                  <Image
                    src="/images/SAN JOAQUIN QR CODE.jpeg"
                    alt="Qr Code"
                    fill
                    className="w-full h-full"
                  />
                </div>
              </>
            )}
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
                  <p className="text-sm">
                    {formatPrice(
                      item.discountedPrice === 0
                        ? item.price * item.quantity
                        : item.discountedPrice * item.quantity
                    )}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between mt-1">
                <p className="font-semibold">Subtotal</p>
                <p className="font-semibold">{formatPrice(totalPrice)}</p>
              </div>
              {isEligibleForDiscount && (
                <div className="flex items-center justify-between mt-1">
                  <p className="font-semibold">Senior Citizen/PWD Discount:</p>
                  <p className="font-semibold">{formatPrice(discount)}</p>
                </div>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">{formatPrice(grandTotal)}</p>
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
