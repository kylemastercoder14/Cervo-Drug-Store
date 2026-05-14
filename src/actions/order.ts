/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { CheckoutValidation } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const createOrder = async (
  values: z.infer<typeof CheckoutValidation>,
  userId: string,
  items: any[],
  orderOption: string,
  selectedAddress: string,
  totalPrice: any,
  deliveryFee: number,
  discount: number
) => {
  const validatedField = CheckoutValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { prescription, email, branch } = validatedField.data;

  const orderId = `${String.fromCharCode(
    65 + Math.floor(Math.random() * 26)
  )}${Math.floor(Math.random() * 1000000)}`;

  try {
    const order = await db.orders.create({
      data: {
        orderNumber: orderId,
        deliveryFee,
        userId,
        email,
        addressId: selectedAddress,
        totalAmount: totalPrice,
        method: orderOption,
        orderOption: orderOption,
        prescription,
        branch: branch || "",
        discountPrice: discount,
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
        addressId: true,
      },
    });

    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.id,
      quantity: item.quantity,
    }));

    await db.orderItems.createMany({
      data: orderItems,
    });

    return { success: "Order created successfully", orderData: order };
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
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        discountPrice: true,
        deliveryFee: true,
        status: true,
        orderOption: true,
        method: true,
        email: true,
        branch: true,
        prescription: true,
        createdAt: true,
        updatedAt: true,
        processingAt: true,
        shippedAt: true,
        completedAt: true,
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
      select: {
        id: true,
        orderNumber: true,
        status: true,
        completedAt: true,
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

export const submitShippingFeeOffer = async (
  orderId: string,
  deliveryFee: number
) => {
  try {
    if (!Number.isFinite(deliveryFee) || deliveryFee <= 0) {
      return { error: "Please enter a valid shipping fee amount." };
    }

    const order = await db.orders.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderOption: true,
      },
    });

    if (!order) {
      return { error: "Order not found." };
    }

    if (
      order.orderOption !== "In-House Rider" &&
      order.orderOption !== "Third-Party Courier"
    ) {
      return {
        error:
          "Shipping fee confirmation is only applicable for in-house rider and third-party courier orders.",
      };
    }

    const updatedOrder = await db.orders.update({
      where: { id: orderId },
      data: {
        deliveryFee,
        status: "AWAITING_SHIPPING_FEE_CONFIRMATION",
        processingAt: null,
        shippedAt: null,
        completedAt: null,
      },
      select: {
        id: true,
        deliveryFee: true,
        status: true,
      },
    });

    return {
      success: "Shipping fee sent to customer for confirmation.",
      order: updatedOrder,
    };
  } catch (error: any) {
    return {
      error: `Failed to update shipping fee. ${error.message || ""}`,
    };
  }
};

export const respondToShippingFeeOffer = async (
  orderId: string,
  decision: "accept" | "reject"
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return { error: "Unauthorized." };
    }

    const order = await db.orders.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!order || order.userId !== userId) {
      return { error: "Order not found." };
    }

    if (order.status !== "AWAITING_SHIPPING_FEE_CONFIRMATION") {
      return { error: "This shipping fee offer is no longer awaiting confirmation." };
    }

    const nextStatus =
      decision === "accept" ? "PENDING" : "SHIPPING_FEE_REJECTED";

    const updatedOrder = await db.orders.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        processingAt: null,
        shippedAt: null,
        completedAt: null,
      },
      select: {
        id: true,
        status: true,
        deliveryFee: true,
      },
    });

    return {
      success:
        decision === "accept"
          ? "Shipping fee accepted successfully."
          : "Shipping fee offer rejected.",
      order: updatedOrder,
    };
  } catch (error: any) {
    return {
      error: `Failed to update shipping fee response. ${error.message || ""}`,
    };
  }
};

export async function updateOrderStatus(orderId: string, status: string) {
  const now = new Date();
  const existingOrder = await db.orders.findUnique({
    where: { id: orderId },
    select: {
      orderOption: true,
      status: true,
    },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  const requiresShippingFeeConfirmation =
    existingOrder.orderOption === "In-House Rider" ||
    existingOrder.orderOption === "Third-Party Courier";

  if (
    requiresShippingFeeConfirmation &&
    ["PROCESSING", "SHIPPED", "COMPLETED"].includes(status.toUpperCase()) &&
    ["AWAITING_SHIPPING_FEE_CONFIRMATION", "SHIPPING_FEE_REJECTED"].includes(
      existingOrder.status.toUpperCase()
    )
  ) {
    throw new Error(
      "Customer must accept the shipping fee before the order can be processed."
    );
  }

  let updateData: any = { status };

  switch (status.toUpperCase()) {
    case "PROCESSING":
      updateData.processingAt = now;
      break;
    case "SHIPPED":
      updateData.shippedAt = now;
      break;
    case "COMPLETED":
      updateData.completedAt = now;
      break;
    case "PENDING":
      updateData = {
        status,
        processingAt: null,
        shippedAt: null,
        completedAt: null,
      };
      break;
    case "AWAITING_SHIPPING_FEE_CONFIRMATION":
    case "SHIPPING_FEE_REJECTED":
      updateData = {
        status,
        processingAt: null,
        shippedAt: null,
        completedAt: null,
      };
      break;
  }

  const order = await db.orders.update({
    where: { id: orderId },
    data: updateData,
    select: {
      id: true,
      status: true,
      processingAt: true,
      shippedAt: true,
      completedAt: true,
      updatedAt: true,
    },
  });

  return order;
}
