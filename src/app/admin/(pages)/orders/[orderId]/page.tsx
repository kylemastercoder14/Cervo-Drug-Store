import React from "react";
import db from "@/lib/db";
import OrderForm from '../_components/order-form';

const OrderId = async (
  props: {
    params: Promise<{
      orderId: string;
    }>;
  }
) => {
  const params = await props.params;
  const data = await db.orders.findUnique({
    where: {
      id: params.orderId,
    },
    select: {
      id: true,
      orderNumber: true,
      userId: true,
      email: true,
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
      addressId: true,
      user: true,
      address: true,
      OrderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!data) {
    return <div>Order not found</div>;
  }

  return (
    <div className='py-5'>
      <OrderForm data={data} />
    </div>
  );
};

export default OrderId;
