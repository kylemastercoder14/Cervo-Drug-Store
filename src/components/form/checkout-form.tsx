"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckoutValidation } from "@/lib/validators";
import { Form } from "../ui/form";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Button } from "../ui/button";
import { Circle, Loader2, PlusCircle } from "lucide-react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import useCart from "@/hooks/use-cart";
import { calculateVatAdjustedPrice, formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/order";
import { toast } from "sonner";
import { Address, User } from "@prisma/client";
import CustomOption, { RadioGroup } from "../globals/custom-option";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface CheckoutFormProps extends User {
  address: Address[];
}

type OrderOption = {
  value: string;
  title: string;
  badge?: string;
  accent: string;
  iconLabel: string;
  description: string;
};

type ShippingPolicySection = {
  title: string;
  note?: string;
};

const ORDER_OPTIONS: OrderOption[] = [
  {
    value: "Pick-Up",
    title: "Pick-Up",
    badge: "Recommended",
    accent: "bg-green-600",
    iconLabel: "Pick-up",
    description:
      "Collect your order at the selected branch. No delivery charge applies.",
  },
  {
    value: "In-House Rider",
    title: "In-House Delivery Rider",
    accent: "bg-orange-500",
    iconLabel: "Rider",
    description:
      "Delivery fee will be estimated based on your location and distance, then confirmed by text.",
  },
  {
    value: "Third-Party Courier",
    title: "Self Delivery via Third-Party Courier",
    accent: "bg-red-600",
    iconLabel: "Courier",
    description:
      "You may arrange Lalamove, LBC, TokTok, or another courier. We will coordinate pickup details by text.",
  },
] as const;

const SHIPPING_POLICY_SECTIONS: ShippingPolicySection[] = [
  {
    title:
      "Orders placed from 7:00 AM to 1:00 PM will be delivered within the same day.",
    note: "No definite delivery time.",
  },
  {
    title:
      "Orders placed from 1:01 PM onwards will be delivered the next day.",
    note: "No definite delivery time.",
  },
  {
    title: "Delivery rates depend on your area/location.",
  },
  {
    title:
      "If you choose our in-house rider, please contact us first for the delivery rate.",
  },
  {
    title:
      "For ASAP orders, customers may book their preferred courier service.",
  },
  {
    title:
      "Shipping fees are confirmed based on your location or distance, and we may text your contact number to coordinate the final charge and delivery details.",
  },
] as const;

const CheckoutForm = ({
  user,
  email,
}: {
  user: CheckoutFormProps | null;
  email: string;
}) => {
  const router = useRouter();
  const { items, removeAll } = useCart();
  const [selectedOrderOption, setSelectedOrderOption] = useState("Pick-Up");
  const [selectedAddress, setSelectedAddress] = useState(
    user?.address.find((address) => address.isDefault)?.id || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showShippingPolicy, setShowShippingPolicy] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<
    z.infer<typeof CheckoutValidation> | null
  >(null);

  const selectedAddressData = useMemo(
    () => user?.address.find((address) => address.id === selectedAddress) || null,
    [selectedAddress, user?.address]
  );

  const isDeliveryMethod = selectedOrderOption !== "Pick-Up";
  const totalPrice = items.reduce(
    (total, item) => total + calculateVatAdjustedPrice(item) * item.quantity,
    0
  );
  const isEligibleForDiscount = user?.seniorPwdId && user.seniorPwdIdImage;
  const discount = isEligibleForDiscount ? totalPrice * 0.2 : 0;
  const shippingFee = 0;
  const grandTotal = totalPrice - discount;
  const isPrescriptionRequired = items.some(
    (item) => item.isPrescriptionRequired
  );

  const form = useForm<z.infer<typeof CheckoutValidation>>({
    resolver: zodResolver(CheckoutValidation),
    defaultValues: {
      email: email || "",
      contactNumber: selectedAddressData?.contactNumber || user?.contactNumber || "",
      acceptPolicy: false,
      prescription: "",
      branch: "",
      recipientRemarks: "",
    },
  });

  useEffect(() => {
    const contactNumber =
      selectedAddressData?.contactNumber || user?.contactNumber || "";
    form.setValue("contactNumber", contactNumber, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [form, selectedAddressData?.contactNumber, user?.contactNumber]);

  const handleSelectOrderOption = (name: string) => {
    setSelectedOrderOption(name);
  };

  const submitOrder = async (values: z.infer<typeof CheckoutValidation>) => {
    setIsLoading(true);

    try {
      if (!selectedAddress) {
        toast.error("Please select an address before placing your order.");
        return;
      }

      if (isPrescriptionRequired && !values.prescription) {
        toast.error("One of the items in your cart requires a prescription.");
        return;
      }

      const orderRes = await createOrder(
        values,
        user?.id as string,
        items,
        selectedOrderOption,
        selectedAddress,
        totalPrice,
        shippingFee,
        discount
      );

      if (!orderRes.success) {
        toast.error(orderRes.error);
        return;
      }

      toast.success("Order placed successfully!");
      removeAll();
      setShowShippingPolicy(false);
      setPendingSubmission(null);
      router.push("/my-profile");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePolicyReview = (values: z.infer<typeof CheckoutValidation>) => {
    if (!selectedAddress) {
      toast.error("Please add or select an address before placing your order.");
      return;
    }

    setPendingSubmission(values);
    setShowShippingPolicy(true);
  };

  const handleConfirmPlaceOrder = async () => {
    if (!pendingSubmission) {
      return;
    }

    await submitOrder(pendingSubmission);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePolicyReview)}>
          <div className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-2">
            <div>
              <p className="mb-5 border-b border-zinc-300 pb-3">
                Billing Details
              </p>
              <div className="grid gap-3">
                <p>Ship to:</p>
                {user?.address && user.address.length > 0 ? (
                  <RadioGroup
                    value={selectedAddress}
                    onChangeAction={setSelectedAddress}
                  >
                    {user.address.map((address) => (
                      <CustomOption key={address.id} value={address.id}>
                        <div>
                          <p className="font-semibold">{`${address.firstName} ${address.lastName}`}</p>
                          <p className="text-muted-foreground">
                            {`${address.homeAddress}, ${address.barangay}, ${address.city}, ${address.province}`}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Contact: {address.contactNumber}
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
                    <PlusCircle className="mr-2 h-4 w-4" />
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
                    fieldType={FormFieldType.PHONE_INPUT}
                    label="Contact Number"
                    name="contactNumber"
                    placeholder="Enter your contact number"
                    type="phone"
                    isRequired={true}
                    disabled={isLoading}
                    description="We will use this number to confirm your order and text you about delivery fees or courier coordination."
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
                      {
                        label: "7F. Manalo St. Ligid-Tipas, Taguig City",
                        value: "7F. Manalo St. Ligid-Tipas, Taguig City",
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
                {isDeliveryMethod && (
                  <div className="grid gap-3">
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      label="Delivery Remarks"
                      name="recipientRemarks"
                      placeholder="Any special instructions for delivery or courier coordination"
                      isRequired={false}
                      disabled={isLoading}
                    />
                  </div>
                )}
                <p className="text-sm">
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account, and
                  for other purposes described in our privacy policy.
                </p>
                <div className="mt-2 grid gap-3">
                  <CustomFormField
                    name="acceptPolicy"
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    label="I've read and accept the Personal Information Protection Policy"
                    isRequired={true}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-5 border-b border-zinc-300 pb-3">Order Option</p>
              <div className="flex flex-col space-y-3">
                {ORDER_OPTIONS.map((option) => {
                  const isSelected = selectedOrderOption === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`${isSelected ? "cursor-pointer" : "cursor-default"} w-full`}
                    >
                      <input
                        type="radio"
                        className="peer sr-only"
                        name="payment_method"
                        onChange={() => handleSelectOrderOption(option.value)}
                        checked={isSelected}
                        disabled={isLoading}
                      />
                      <div
                        className={`w-full rounded-md border bg-zinc-100 p-3 shadow-md transition-all ${
                          isSelected ? "border-green-800" : "border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-start gap-x-3">
                            {isSelected ? (
                              <IconCircleCheckFilled className="mt-0.5 text-green-800" />
                            ) : (
                              <Circle className="mt-0.5" />
                            )}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-x-2">
                                <p className="text-sm font-semibold">
                                  {option.title}
                                </p>
                                {option.badge && (
                                  <Badge variant="default">{option.badge}</Badge>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {isDeliveryMethod && (
                <>
                  <p className="mb-5 mt-10 border-b border-zinc-300 pb-3">
                    Shipping Information
                  </p>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                    <p className="font-semibold">Shipping fee is not fixed</p>
                    <p className="mt-2">
                      The final delivery charge will be estimated based on your
                      location, route, and distance in kilometers. We will text
                      you using the contact number above to confirm the shipping
                      fee and courier details.
                    </p>
                    {selectedOrderOption === "Third-Party Courier" && (
                      <p className="mt-2">
                        For self delivery, you may book your preferred courier
                        such as Lalamove, LBC, TokTok, or a similar service once
                        your order is confirmed and ready for pickup.
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      Shipping Policy
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Review the shipping policy in the dialog before placing
                      your order.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowShippingPolicy(true)}
                    disabled={isLoading}
                  >
                    View Policy
                  </Button>
                </div>
              </div>

              <p className="mt-10">Product Summary</p>
              <p className="mb-5 mt-1 border-b border-zinc-300 pb-3 text-sm text-muted-foreground">
                Please prepare an exact amount
              </p>
              <div className="rounded-lg bg-zinc-100 px-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Product</p>
                  <p className="text-lg font-semibold">Subtotal</p>
                </div>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="mt-3 flex items-center justify-between"
                  >
                    <p className="text-sm">
                      {item.name} x {item.quantity}
                    </p>
                    <p className="text-sm">
                      {formatPrice(
                        calculateVatAdjustedPrice(item) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
                <div className="my-2 border-t border-zinc-300"></div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-medium">Subtotal</p>
                  <p className="font-medium">{formatPrice(totalPrice)}</p>
                </div>
                {isEligibleForDiscount && (
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-medium">Senior Citizen/PWD Discount:</p>
                    <p className="font-medium text-red-600">
                      -{formatPrice(discount)}
                    </p>
                  </div>
                )}
                <div className="mt-1 flex items-center justify-between">
                  <p className="font-medium">
                    {isDeliveryMethod ? "Shipping Fee:" : "Delivery Fee:"}
                  </p>
                  <p className="font-medium">
                    {isDeliveryMethod
                      ? "To be confirmed by text"
                      : formatPrice(shippingFee)}
                  </p>
                </div>
                <div className="my-2 border-t border-zinc-300"></div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(grandTotal)}
                  </p>
                </div>
                {isDeliveryMethod && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Shipping fee is not yet included in the total and will be
                    finalized after location review.
                  </p>
                )}
              </div>
              <div className="mt-5 flex items-end justify-end gap-5">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  PLACE ORDER
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={showShippingPolicy} onOpenChange={setShowShippingPolicy}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipping Policy</DialogTitle>
            <DialogDescription>
              Please review this policy before proceeding with your order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm text-zinc-700">
            <p className="text-base font-medium text-zinc-900">
              Thank you for ordering with us!
            </p>
            {SHIPPING_POLICY_SECTIONS.map((section) => (
              <div key={section.title} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-green-700" />
                <div>
                  <p>{section.title}</p>
                  {section.note && (
                    <p className="mt-1 italic text-zinc-600">{section.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowShippingPolicy(false)}
              disabled={isLoading}
            >
              Review Order
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPlaceOrder}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed With Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutForm;
