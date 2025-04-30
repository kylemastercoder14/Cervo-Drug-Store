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
import StepIndicator from "./step-indicator";

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
    include: {
      OrderItems: {
        include: {
          product: true,
        },
      },
      address: true,
      user: true,
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
              The order you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="py-5">
          <StepIndicator
            orderId={
              order.lalamoveOrderId ?? undefined
            }
            currentStatus={order.status}
            steps={[
              { title: "Order Placed", completed: true },
              {
                title: "On the Way",
                completed:
                  order.status === "ON_GOING" ||
                  order.status === "PICKED_UP" ||
                  order.status === "COMPLETED",
              },
              {
                title: "Picked Up",
                completed:
                  order.status === "PICKED_UP" || order.status === "COMPLETED",
              },
              { title: "Delivered", completed: order.status === "COMPLETED" },
              { title: "Completed", completed: order.status === "COMPLETED" },
            ]}
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              {order.OrderItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start py-2 border-b border-gray-100"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs text-center">
                        No image
                      </div>
                    )}
                  </div>
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
                <span>
                  ₱{" "}
                  {formatCurrency(order.totalAmount - (order.deliveryFee || 0))}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Delivery Fee</span>
                <span>₱ {formatCurrency(order.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between font-medium text-base mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>₱ {formatCurrency(order.totalAmount)}</span>
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
                  <p className="mt-2">Phone: {order.address.contactNumber}</p>
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
                  <span className="font-medium">Payment Method:</span>{" "}
                  {order.method}
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

        {order.lalamoveOrderId && (
          <div className="mt-6 text-sm text-gray-500">
            <p>Order Tracking ID: {order.lalamoveOrderId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for formatting currency if not available in utils
function formatCurrency(value: number): string {
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export default OrderDetailsPage;
