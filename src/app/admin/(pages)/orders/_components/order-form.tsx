"use client";

import React from "react";
import { Orders, OrderItems, Products, User, Address } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { updateOrderStatus } from "@/actions/order";

interface OrderItemWithProduct extends OrderItems {
  product: Products;
}

interface OrderFormProps extends Orders {
  user: User;
  address: Address;
  OrderItems: OrderItemWithProduct[];
}

const OrderForm = ({ data }: { data: OrderFormProps }) => {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = React.useState(
    data?.status || "PENDING"
  );
  const [loading, setLoading] = React.useState(false);

  const orderStepsDelivery = [
    {
      id: "pending",
      label: "Pending",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/pending.svg",
      date: data.createdAt,
    },
    {
      id: "processing",
      label: "Processing",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/processing.svg",
      date: data.processingAt || undefined,
    },
    {
      id: "shipped",
      label: "Shipped",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/out-for-delivery.svg",
      date: data.shippedAt || undefined,
    },
    {
      id: "completed",
      label: "Completed",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/delivered.svg",
      date: data.completedAt || undefined,
    },
  ];

  const orderStepsInstallation = [
    {
      id: "pending",
      label: "Pending",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/pending.svg",
      date: data.createdAt,
    },
    {
      id: "processing",
      label: "Processing",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/processing.svg",
      date: data.processingAt || undefined,
    },
    {
      id: "completed",
      label: "Completed",
      image:
        "https://angular.pixelstrap.com/multikart-admin/assets/svg/tracking/delivered.svg",
      date: data.completedAt || undefined,
    },
  ];

  const orderSteps =
    data.orderOption === "Delivery"
      ? orderStepsDelivery
      : orderStepsInstallation;

  const handleStatusChange = async (value: string) => {
    setOrderStatus(value);
    setLoading(true);

    await updateOrderStatus(data.id, value);
    router.refresh();
    toast.success("Order status updated");
    setLoading(false);
  };
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-bold">Order Details</h1>
      </div>

      <div className="grid lg:grid-cols-10 grid-cols-1 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Order Status Steps */}
          <div className="mb-6">
            <div
              className={`grid ${
                data.orderOption === "Delivery"
                  ? "lg:grid-cols-4"
                  : "lg:grid-cols-3"
              } grid-cols-1 gap-10`}
            >
              {orderSteps.map((step) => {
                const isActive =
                  step.id.toLowerCase() === data.status.toLowerCase();

                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={`flex w-full relative tracking-panel gap-4 items-center ${
                        isActive ? "bg-[#e2f7e2] active" : "bg-zinc-100"
                      }`}
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
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {/* Order Info */}
          <div className="bg-white border shadow rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold">
                Order Number: {data.orderNumber}
              </h2>
              <Select
                defaultValue={orderStatus}
                onValueChange={handleStatusChange}
                disabled={loading}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  {data.orderOption === "Delivery" && (
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                  )}
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p>Branch: {data.branch || "N/A"}</p>
            <p>Order Option: {data.method}</p>
            <p>
              Prescription:{" "}
              {data.prescription ? (
                <span
                  className="cursor-pointer underline text-green-500"
                  onClick={() => toast(data.prescription)}
                >
                  View Prescription
                </span>
              ) : (
                "No Prescription"
              )}
            </p>
            <p>Total Amount: {formatPrice(data.totalAmount)}</p>
          </div>

          {/* Order Items */}
          <div className="bg-white border shadow rounded-sm p-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4">Image</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {data.OrderItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 px-4 w-24 h-24">
                      {item.product.image ? (
                        <div className="relative w-16 h-16 border p-0">
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
                    </td>
                    <td className="py-2 px-4">{item.product.name}</td>
                    <td className="py-2 px-4">
                      {item.product.isPrescriptionRequired ? "RX" : "OTC"}
                    </td>
                    <td className="py-2 px-4">x{item.quantity}</td>
                    <td className="py-2 px-4">
                      {formatPrice(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white border shadow rounded-sm p-5 space-y-4">
            <h3 className="text-base font-bold">Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>
                {formatPrice(
                  data.OrderItems.reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0
                  )
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>{formatPrice(data.discountPrice || 0)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(data.totalAmount)}</span>
            </div>

            <h3 className="text-base font-bold mt-5">Customer Details</h3>
            <div className="text-sm space-y-2">
              <p>
                <span className="text-gray-500">Name: </span>
                {data.address.firstName} {data.address.lastName}
              </p>
              <p>
                <span className="text-gray-500">Email: </span>
                {data.email}
              </p>
              <p>
                <span className="text-gray-500">Phone: </span>
                {data.address.contactNumber}
              </p>
              <p>
                <span className="text-gray-500">Address: </span>
                {data.address.homeAddress}, {data.address.barangay},{" "}
                {data.address.city}, {data.address.province},{" "}
                {data.address.region}, PH - {data.address.zipCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderForm;
