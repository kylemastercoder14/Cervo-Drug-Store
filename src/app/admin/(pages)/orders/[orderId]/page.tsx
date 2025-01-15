import React from "react";
import db from "@/lib/db";
import OrderForm from '../_components/order-form';

const OrderId = async ({
  params,
}: {
  params: {
    orderId: string;
  };
}) => {
  const data = await db.orders.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
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
