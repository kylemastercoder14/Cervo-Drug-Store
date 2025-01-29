"use client";

import { Address, OrderItems, Orders, Products, User } from "@prisma/client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import { toast } from "sonner";
import { completeOrder } from "@/actions/order";
import { Modal } from "../../../../../components/ui/modal";

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
  const [completeOrderModal, setCompleteOrderModal] = React.useState(false);
  const [prescriptionModal, setPrescriptionModal] = React.useState(false);
  const [completeLoading, setCompleteLoading] = React.useState(false);

  const handleCompleteOrder = async () => {
    setCompleteLoading(true);
    try {
      const res = await completeOrder(data.id);
      if (res.success) {
        toast.success(res.success);
        router.push("/admin/orders");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete order");
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Are you sure you want to complete this order?"
        isOpen={completeOrderModal}
        onClose={() => setCompleteOrderModal(false)}
        onConfirm={handleCompleteOrder}
        loading={completeLoading}
      />
      <Modal
        isOpen={prescriptionModal}
        onClose={() => setPrescriptionModal(false)}
        title=""
        description=""
      >
        <div className="relative w-full h-[300px]">
          <Image
            src={data.prescription as string}
            alt="Prescription"
            className="w-full h-full"
            fill
          />
        </div>
      </Modal>
      <div className="flex items-center gap-3">
        <h1>Order Details </h1>
        <Badge
          className="mt-1"
          variant={data.status === "Order Completed" ? "default" : "secondary"}
        >
          {data.status}
        </Badge>
      </div>

      <div className="mt-3">
        <p className="font-bold text-xl">Order ID: {data.orderNumber}</p>
        <p>Order Option: {data.method}</p>
        {data.prescription ? (
          <p

          >
            Prescription: <span onClick={() => setPrescriptionModal(true)} className="cursor-pointer underline text-green-400">{data.prescription}</span>
          </p>
        ) : (
          <p>Prescription: No Prescription</p>
        )}
        <p>Total Amount: {formatPrice(data.totalAmount)}</p>
      </div>
      <Separator className="my-3" />
      <h1 className="mb-3">Customer Details</h1>
      <p>
        Customer: {data.address.firstName} {data.address.lastName}
      </p>
      <p>
        Address: {data.address.homeAddress}, {data.address.barangay},{" "}
        {data.address.city}, {data.address.province}, {data.address.region}, PH
        - {data.address.zipCode}
      </p>
      <p>Contact Number: {data.address.contactNumber}</p>
      <p>Email Address: {data.email}</p>
      <Separator className="my-3" />
      <h1>Product Items</h1>
      <div className="flex flex-col space-y-3 mt-3">
        {data.OrderItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="relative w-24 h-24 border p-0">
              <Image
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-full object-cover"
                fill
              />
            </div>
            <div>
              <h4>{item.product.name}</h4>
              <p>Category: {item.product.categoryTag}</p>
              <p className="text-sm text-muted-foreground">x {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end mb-3 gap-2">
        <Button
          onClick={() => router.push("/admin/orders")}
          variant="secondary"
        >
          &larr; Cancel
        </Button>
        <Button onClick={() => setCompleteOrderModal(true)}>
          Mark as Complete
        </Button>
      </div>
    </>
  );
};

export default OrderForm;
