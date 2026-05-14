// app/orders/[orderId]/page.tsx
import React from "react";
import Navbar from "@/components/landing-page/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import db from "@/lib/db";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import ShippingFeeResponse from "./shipping-fee-response";

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

const OrderDetailsPage = async ({ params }: OrderPageProps) => {
  const order = await db.orders.findUnique({
    where: {
      id: params.orderId,
    },
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      discountPrice: true,
      orderOption: true,
      deliveryFee: true,
      method: true,
      prescription: true,
      branch: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      processingAt: true,
      shippedAt: true,
      completedAt: true,
      OrderItems: {
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              name: true,
              price: true,
              image: true,
            },
          },
        },
      },
      address: {
        select: {
          firstName: true,
          lastName: true,
          homeAddress: true,
          city: true,
          province: true,
          zipCode: true,
          contactNumber: true,
        },
      },
    },
  });

  if (!order) {
    return (
      <div className="flex relative min-h-screen w-full flex-col">
        <Navbar />
        <div className="w-full xl:px-60 px-4 py-5 h-full mx-auto">
          <div className="flex flex-col items-center justify-center py-16">
            <h1 className="text-2xl font-bold text-gray-800">
              Order Not Found
            </h1>
            <p className="text-gray-600 mt-2">
              The order you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isDeliveryOrder = order.orderOption !== "Pick-Up";
  const requiresShippingFeeConfirmation =
    order.orderOption === "In-House Rider" ||
    order.orderOption === "Third-Party Courier";
  const orderTotal =
    order.totalAmount - (order.discountPrice ?? 0) + (order.deliveryFee ?? 0);

  const orderStepsDelivery = [
    {
      id: "pending",
      label: "Pending",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/pending.svg",
      date: order.createdAt,
    },
    {
      id: "awaiting_shipping_fee_confirmation",
      label: "To Confirm",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/processing.svg",
      date: order.updatedAt || undefined,
    },
    {
      id: "processing",
      label: "Processing",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/processing.svg",
      date: order.processingAt || undefined,
    },
    {
      id: "shipped",
      label: "Shipped",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/out-for-delivery.svg",
      date: order.shippedAt || undefined,
    },
    {
      id: "completed",
      label: "Completed",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/delivered.svg",
      date: order.completedAt || undefined,
    },
  ];

  const orderStepsInstallation = [
    {
      id: "pending",
      label: "Pending",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/pending.svg",
      date: order.createdAt,
    },
    {
      id: "processing",
      label: "Processing",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/processing.svg",
      date: order.processingAt || undefined,
    },
    {
      id: "completed",
      label: "Completed",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/delivered.svg",
      date: order.completedAt || undefined,
    },
  ];

  const orderSteps = isDeliveryOrder
    ? orderStepsDelivery
    : orderStepsInstallation;

  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Navbar />
      <div className="w-full xl:px-60 px-4 py-5 h-full mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/my-profile">
                Order History
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">
                Order #{order.orderNumber}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {order.status === "AWAITING_SHIPPING_FEE_CONFIRMATION" &&
          requiresShippingFeeConfirmation &&
          Boolean(order.deliveryFee) && (
            <ShippingFeeResponse
              orderId={order.id}
              deliveryFee={order.deliveryFee ?? 0}
            />
          )}

        {order.status === "SHIPPING_FEE_REJECTED" && requiresShippingFeeConfirmation && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-5">
            <h3 className="text-base font-bold text-red-900">
              Shipping Fee Offer Rejected
            </h3>
            <p className="mt-2 text-sm text-red-800">
              You rejected the current shipping fee offer. Please wait for the
              store to send an updated fee if you still want to continue with
              this order.
            </p>
          </div>
        )}

        <div className="py-5">
          <div
            className={
              isDeliveryOrder
                ? "overflow-x-auto pb-3"
                : `grid ${isDeliveryOrder ? "lg:grid-cols-4" : "lg:grid-cols-3"} grid-cols-1 gap-10`
            }
          >
            <div
              className={
                isDeliveryOrder
                  ? "flex min-w-max items-stretch gap-6"
                  : "contents"
              }
            >
              {orderSteps.map((step) => {
                const activeStepId =
                  order.status === "SHIPPING_FEE_REJECTED"
                    ? "awaiting_shipping_fee_confirmation"
                    : order.status.toLowerCase();
                const isActive = step.id.toLowerCase() === activeStepId;

                return (
                  <div
                    key={step.id}
                    className={`relative tracking-panel flex items-center gap-4 ${
                      isDeliveryOrder ? "min-w-[260px] flex-shrink-0" : "w-full"
                    } ${isActive ? "bg-[#e2f7e2] active" : "bg-zinc-100"}`}
                  >
                    <div className="relative size-10">
                      <Image
                        src={step.image}
                        alt={step.label}
                        fill
                        className={`size-full ${
                          isActive ? "text-primary" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`text-base font-semibold ${
                          isActive ? "text-primary" : "text-gray-600"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-500">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              {order.OrderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 py-2 border-b border-gray-100"
                >
                  {item.product.image ? (
                    <div className="relative w-20 h-20 border p-0">
                      <Image
                        src={item.product.image || ""}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="relative w-20 flex items-center justify-center m-auto h-20 bg-primary/60 p-0">
                      <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="absolute top-1 right-1"
                      />
                      <div className="border-2 text-xs w-[80%] overflow-hidden line-clamp-2 text-black text-center font-semibold border-black p-1">
                        {item.product.name}
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₱ {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₱ {formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Discount</span>
                <span>₱ {formatCurrency(order.discountPrice ?? 0)}</span>
              </div>
              {isDeliveryOrder && (
                <div className="flex justify-between text-sm">
                  <span>Shipping Fee</span>
                  <span>
                    {order.deliveryFee && order.deliveryFee > 0
                      ? `₱ ${formatCurrency(order.deliveryFee)}`
                      : "To be confirmed"}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-medium text-base mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>₱ {formatCurrency(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping Address
              </h2>
            </div>
            <div className="px-6 py-4">
              {order.address ? (
                <div className="text-gray-600">
                  <p className="font-medium">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  {order.address.homeAddress && (
                    <p>{order.address.homeAddress}</p>
                  )}
                  <p>
                    {order.address.city}, {order.address.province}{" "}
                    {order.address.zipCode}
                  </p>
                  <p>Philippines</p>
                  <p className="mt-2">
                    Phone: {order.address.contactNumber}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">
                  No shipping address information available
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Delivery Information
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="text-gray-600">
                <p>
                  <span className="font-medium">Order Option:</span>{" "}
                  {order.orderOption}
                </p>
                <p>
                  <span className="font-medium">Contact Number:</span>{" "}
                  {order.address.contactNumber}
                </p>
                <p>
                  <span className="font-medium">Branch:</span>{" "}
                  {order.branch || "N/A"}
                </p>
                {order.prescription && (
                  <p>
                    <span className="font-medium">Prescription:</span> Uploaded
                  </p>
                )}
                <p className="mt-4">
                  <span className="font-medium">Order Created:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                {order.status === "COMPLETED" && (
                  <p>
                    <span className="font-medium">Delivery Completed:</span>{" "}
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                )}
                {order.status === "CANCELED" && (
                  <p className="text-red-600 mt-2">
                    <span className="font-medium">Order was canceled</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper function for formatting currency if not available in utils
function formatCurrency(value: number): string {
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export default OrderDetailsPage;
