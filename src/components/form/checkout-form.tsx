"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckoutValidation } from "@/lib/validators";
import { Form } from "../ui/form";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Button } from "../ui/button";
import { Circle, Loader2, PlusCircle } from "lucide-react";
import Image from "next/image";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import useCart from "@/hooks/use-cart";
import { calculateVatAdjustedPrice, formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/order";
import { toast } from "sonner";
import { Address, User } from "@prisma/client";
import CustomOption, { RadioGroup } from "../globals/custom-option";

interface CheckoutFormProps extends User {
  address: Address[];
}

interface Coordinates {
  lat: string;
  lng: string;
}

interface QuotationData {
  data: {
    quotationId: string;
    stops: Array<{
      stopId: string;
      coordinates: Coordinates;
      address: string;
    }>;
    priceBreakdown: {
      total: string;
      currency: string;
    };
    distance: {
      value: number;
    };
    scheduleAt: string;
  };
}

interface OrderResponse {
  orderId: string;
  status: string;
  shareLink: string;
  priceBreakdown: {
    base: string;
    extraMileage: string;
    surge: string;
    total: string;
  };
}

interface DriverInfo {
  name: string;
  phone: string;
  plate: string;
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

  const defaultAddress = user?.address?.find((address) => address.isDefault);
  const fullAddress = defaultAddress
    ? `${defaultAddress.city} ${defaultAddress.province}`
    : "";

  // Lalamove integration state
  const pickupAddress = "East Rembo, Taguig City";
  const dropoffAddress = fullAddress;
  const [pickupCoordinates, setPickupCoordinates] =
    useState<Coordinates | null>(null);
  const [dropoffCoordinates, setDropoffCoordinates] =
    useState<Coordinates | null>(null);
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(
    null
  );
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [quotationLoading, setQuotationLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(defaultAddressId);
  const router = useRouter();
  const [selectedOrderOption, setSelectedOrderOption] = useState("Delivery");
  const [isLoading, setIsLoading] = useState(false);
  const { items, removeAll } = useCart();

  const fetchCoordinates = async (address: string): Promise<Coordinates> => {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search?key=${
        process.env.NEXT_PUBLIC_API_MAP_KEY
      }&q=${encodeURIComponent(address)}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: data[0].lat, lng: data[0].lon };
    }
    throw new Error("Location not found");
  };

  const fetchQuotation = async () => {
    if (!fullAddress) {
      toast.error("Please add a default address to get a delivery quotation");
      return;
    }

    try {
      setQuotationLoading(true);

      const pickupCoords = await fetchCoordinates(pickupAddress);
      setPickupCoordinates(pickupCoords);

      const dropoffCoords = await fetchCoordinates(dropoffAddress);
      setDropoffCoordinates(dropoffCoords);

      const twentyMinutesLater = new Date();
      twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 20);
      const scheduleAt = twentyMinutesLater.toISOString();

      const quotationBody = {
        scheduleAt,
        serviceType: "MOTORCYCLE",
        specialRequests: [],
        language: "en_PH",
        stops: [
          {
            coordinates: pickupCoords,
            address: pickupAddress,
          },
          {
            coordinates: dropoffCoords,
            address: dropoffAddress,
          },
        ],
        isRouteOptimized: true,
      };

      const res = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: quotationBody }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to get quotation");
      }

      const data = await res.json();
      setQuotation(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setQuotationLoading(false);
    }
  };

  const fetchDriverDetails = async (orderId: string, driverId: string) => {
    try {
      const res = await fetch("/api/driver-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, driverId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch driver details");
      }

      setDriverInfo(data.data);
      toast.success("Driver details received");
    } catch (err: any) {
      console.error("Error fetching driver details:", err);
      toast.error(err.message || "Failed to get driver details");
    }
  };

  const waitForDriver = async (
    orderId: string,
    maxAttempts = 20,
    intervalMs = 5000
  ) => {
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));

      try {
        const res = await fetch("/api/order-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();

        if (res.ok) {
          const driverId = data?.data?.driverId;
          if (driverId) {
            await fetchDriverDetails(orderId, driverId);
            return;
          }
        } else {
          console.error("Error checking driver assignment:", data.message);
        }
      } catch (error) {
        console.error("Error checking order status:", error);
      }
    }

    throw new Error("No driver assigned after several attempts");
  };

  const placeDeliveryOrder = async (
    values: z.infer<typeof CheckoutValidation>
  ) => {
    if (!quotation) {
      throw new Error("Delivery quotation is required");
    }

    const res = await fetch("/api/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quotation,
        recipientName: `${user?.firstName} ${user?.lastName}` || "Customer",
        recipientRemarks: values.recipientRemarks || "",
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to place delivery order");
    }

    const data = await res.json();
    setOrderResponse(data.data);
    return data.data;
  };

  useEffect(() => {
    if (fullAddress && selectedOrderOption === "Delivery") {
      fetchQuotation();
    }
  }, [fullAddress, selectedOrderOption]);

  useEffect(() => {
    if (user && selectedAddress && selectedAddress !== defaultAddressId) {
      const newSelectedAddress = user.address.find(
        (addr) => addr.id === selectedAddress
      );
      if (newSelectedAddress && selectedOrderOption === "Delivery") {
        fetchQuotation();
      }
    }
  }, [selectedAddress]);

  const totalPrice = items.reduce(
    (total, item) => total + calculateVatAdjustedPrice(item) * item.quantity,
    0
  );

  const isEligibleForDiscount = user?.seniorPwdId && user.seniorPwdIdImage;
  const discount = isEligibleForDiscount ? totalPrice * 0.2 : 0;
  const shippingFee =
    selectedOrderOption === "Delivery" && quotation
      ? Number(quotation?.data?.priceBreakdown?.total) || 0
      : 0;
  const grandTotal = (totalPrice - discount) + shippingFee;

  const isPrescriptionRequired = items.some(
    (item) => item.isPrescriptionRequired
  );

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
      recipientRemarks: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CheckoutValidation>) => {
    setIsLoading(true);
    try {
      if (isPrescriptionRequired && !values.prescription) {
        toast.error("One of the items in your cart requires a prescription.");
        return;
      }

      if (selectedOrderOption === "Delivery" && !quotation) {
        toast.error(
          "Delivery quotation is required. Please wait for it to load or try again."
        );
        return;
      }

      let lalamoveOrderId = "";

      // If delivery option is selected, call the Lalamove API first
      if (selectedOrderOption === "Delivery") {
        try {
          const deliveryOrder = await placeDeliveryOrder(values);
          lalamoveOrderId = deliveryOrder.orderId;
        } catch (err: any) {
          console.error("Delivery order error:", err);
          toast.warning(
            `Your order was placed successfully but we couldn't schedule delivery: ${err.message}`
          );
        }
      }

      // Then create the order in your database with the Lalamove ID
      const orderRes = await createOrder(
        values,
        user?.id as string,
        items,
        selectedOrderOption,
        selectedAddress,
        totalPrice,
        lalamoveOrderId, // Now this will have the actual Lalamove order ID
        shippingFee,
        discount
      );

      if (!orderRes.success) {
        toast.error(orderRes.error);
        return;
      }

      // If you want to wait for driver assignment after saving to DB
      // if (selectedOrderOption === "Delivery" && lalamoveOrderId) {
      //   try {
      //     await waitForDriver(lalamoveOrderId);
      //     toast.success("Driver assigned to your delivery!");

      //     // You might want to update the order status here
      //     // await updateOrderStatus(orderRes.orderId, "DriverAssigned");
      //   } catch (driverError) {
      //     console.error("Driver assignment error:", driverError);
      //     toast.warning(
      //       "Order placed but we're having trouble assigning a driver. We'll notify you soon."
      //     );
      //   }
      // }

      toast.success("Order placed successfully!");
      removeAll();
      router.push("/my-profile");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              {selectedOrderOption === "Delivery" && (
                <div className="grid gap-3">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Delivery Remarks"
                    name="recipientRemarks"
                    placeholder="Any special instructions for delivery"
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
              <div className="grid gap-3 mt-2">
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
                  disabled={isLoading || !quotation}
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
                            {quotationLoading && (
                              <Loader2 className="animate-spin w-4 h-4" />
                            )}
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
                  Delivery Information
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Estimated Delivery Fee:</p>
                  {quotationLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : quotation ? (
                    <p>{formatPrice(quotation.data.priceBreakdown.total)}</p>
                  ) : (
                    <p className="text-muted-foreground">Not available</p>
                  )}
                </div>
                {driverInfo && (
                  <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                    <h4 className="font-semibold mb-2">Driver Assigned</h4>
                    <p>Name: {driverInfo.name}</p>
                    <p>Phone: {driverInfo.phone}</p>
                    <p>Vehicle: {driverInfo.plate}</p>
                  </div>
                )}
              </>
            )}
            <p className="mt-10">Product Summary</p>
            <p className="mt-1 text-sm text-muted-foreground border-b pb-3 border-zinc-300 mb-5">
              Please prepare an exact amount
            </p>
            <div className="bg-zinc-100 px-4 py-2 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">Product</p>
                <p className="font-semibold text-lg">Subtotal</p>
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mt-3"
                >
                  <p className="text-sm">
                    {item.name} × {item.quantity}
                  </p>
                  <p className="text-sm">
                    {formatPrice(
                      calculateVatAdjustedPrice(item) * item.quantity
                    )}
                  </p>
                </div>
              ))}
              <div className="border-t border-zinc-300 my-2"></div>
              <div className="flex items-center justify-between mt-2">
                <p className="font-medium">Subtotal</p>
                <p className="font-medium">{formatPrice(totalPrice)}</p>
              </div>
              {isEligibleForDiscount && (
                <div className="flex items-center justify-between mt-1">
                  <p className="font-medium">Senior Citizen/PWD Discount:</p>
                  <p className="font-medium text-red-600">
                    -{formatPrice(discount)}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="font-medium">Estimated Delivery Fee:</p>
                {selectedOrderOption === "Delivery" ? (
                  quotationLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : quotation ? (
                    <p className="font-medium">
                      {formatPrice(shippingFee)}
                    </p>
                  ) : (
                    <p className="font-medium">-</p>
                  )
                ) : (
                  <p className="font-medium">₱0.00</p>
                )}
              </div>
              <div className="border-t border-zinc-300 my-2"></div>
              <div className="flex items-center justify-between mt-2">
                <p className="font-semibold text-lg">Total</p>
                <p className="font-semibold text-lg">
                  {formatPrice(grandTotal)}
                </p>
              </div>
            </div>
            <div className="flex items-end justify-end mt-5 gap-5">
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (selectedOrderOption === "Delivery" && !quotation)
                }
                className="w-full md:w-auto"
              >
                {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
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
