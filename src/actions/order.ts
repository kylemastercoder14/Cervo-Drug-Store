/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { CheckoutValidation } from "@/lib/validators";
import { z } from "zod";

export const createOrder = async (
  values: z.infer<typeof CheckoutValidation>,
  userId: string,
  items: any[],
  paymentMethod: string,
  selectedAddress: string,
  totalPrice: any
) => {
  const validatedField = CheckoutValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { prescription, email } = validatedField.data;

  const orderId = `${String.fromCharCode(
    65 + Math.floor(Math.random() * 26)
  )}${Math.floor(Math.random() * 1000000)}`;

  try {
    const orderData = await db.$transaction(async (prisma) => {
      const order = await prisma.orders.create({
        data: {
          orderNumber: orderId,
          userId,
          email,
          addressId: selectedAddress,
          totalAmount: totalPrice,
          paymentMethod,
          prescription,
        },
      });

      const orderItems = items.map((item) => ({
        orderId: order.id,
        productId: item.id,
        quantity: item.quantity,
      }));

      await prisma.orderItems.createMany({
        data: orderItems,
      });

      return order;
    });

    return { success: "Order created successfully", orderData };
  } catch (error: any) {
    return {
      error: `Failed to create order. Please try again. ${error.message || ""}`,
    };
  }
};
