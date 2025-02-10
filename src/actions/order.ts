/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { CheckoutValidation } from "@/lib/validators";
import { z } from "zod";

export const createOrder = async (
  values: z.infer<typeof CheckoutValidation>,
  userId: string,
  items: any[],
  orderOption: string,
  selectedAddress: string,
  totalPrice: any
) => {
  const validatedField = CheckoutValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { prescription, email, branch } = validatedField.data;

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
          method: orderOption,
          prescription,
          branch: branch || "",
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

export const getAllOrders = async () => {
  try {
    const data = await db.orders.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        address: true,
        user: true,
        OrderItems: true,
      },
    });

    if (!data) {
      return { error: "No orders found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const completeOrder = async (orderId: string) => {
  try {
    const order = await db.orders.update({
      where: {
        id: orderId,
      },
      data: {
        status: "Order Completed",
      },
      include: {
        OrderItems: {
          include: { product: true },
        },
      },
    });

    return { success: "Order completed successfully", order };
  } catch (error) {
    console.error(error);
    return { error: "Failed to complete order" };
  }
};
