/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import type { CartItem } from "@/hooks/use-cart";
import { CheckoutValidation } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getUserFromCookies } from "@/hooks/use-user";

type OrderCartItem = Partial<CartItem> & {
  productId?: string;
};

type OrderTransactionMeta = {
  staffName?: string;
  remarks?: string;
};

const normalizeOrderTransactionMeta = async (
  orderId: string,
  meta?: OrderTransactionMeta,
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    throw new Error("User not found.");
  }

  const order = await db.orders.findUnique({
    where: {
      id: orderId,
    },
    select: {
      branch: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const branchStaffCount = order.branch
    ? await db.admin.count({
        where: {
          branch: order.branch,
        },
      })
    : 0;
  const requiresManualSignatory = branchStaffCount === 1;
  const staffName = meta?.staffName?.trim() || user.name;

  if (requiresManualSignatory && !meta?.staffName?.trim()) {
    throw new Error("Staff or signatory name is required.");
  }

  return {
    user,
    staffName,
    remarks: requiresManualSignatory ? meta?.remarks?.trim() || null : null,
  };
};

export const createOrder = async (
  values: z.infer<typeof CheckoutValidation>,
  userId: string,
  items: OrderCartItem[],
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

  const { prescription, email, branch, paymentMethod } = validatedField.data;
  const cartItems = Array.isArray(items) ? items : [];
  const validOrderItems = cartItems
    .map((item) => ({
      productId: String(item.id || item.productId || "").trim(),
      quantity: Math.max(1, Math.floor(Number(item.quantity ?? 1))),
    }))
    .filter((item) => item.productId && Number.isFinite(item.quantity));

  if (!userId?.trim()) {
    return { error: "Please sign in before placing your order." };
  }

  if (!selectedAddress?.trim()) {
    return { error: "Please select an address before placing your order." };
  }

  if (validOrderItems.length === 0 || validOrderItems.length !== cartItems.length) {
    return {
      error:
        "Your cart has no valid products. Please remove the item and add it again.",
    };
  }

  const orderId = `${String.fromCharCode(
    65 + Math.floor(Math.random() * 26)
  )}${Math.floor(Math.random() * 1000000)}`;

  try {
    const productIds = validOrderItems.map((item) => item.productId);
    const uniqueProductIds = Array.from(new Set(productIds));
    const productCount = await db.products.count({
      where: {
        id: {
          in: uniqueProductIds,
        },
      },
    });

    if (productCount !== uniqueProductIds.length) {
      return {
        error:
          "One or more products in your cart are no longer available. Please remove them and add the product again.",
      };
    }

    const order = await db.$transaction(async (tx) => {
      const createdOrder = await tx.orders.create({
        data: {
          orderNumber: orderId,
          deliveryFee,
          userId,
          email,
          contactNumber: validatedField.data.contactNumber,
          addressId: selectedAddress,
          totalAmount: totalPrice,
          method: paymentMethod,
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

      await tx.orderItems.createMany({
        data: validOrderItems.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      return createdOrder;
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
    const { userId } = auth();

    if (!userId) {
      return { error: "Unauthorized." };
    }

    const existingOrder = await db.orders.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!existingOrder || existingOrder.userId !== userId) {
      return { error: "Order not found." };
    }

    if (!["SHIPPED", "DELIVERED"].includes(existingOrder.status.toUpperCase())) {
      return { error: "Only delivered orders can be completed." };
    }

    const order = await db.orders.update({
      where: {
        id: orderId,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
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
  deliveryFee: number,
  meta?: OrderTransactionMeta
) => {
  try {
    const { user, staffName, remarks } = await normalizeOrderTransactionMeta(
      orderId,
      meta,
    );

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

    const updatedOrder = await db.$transaction(async (tx) => {
      const orderData = await tx.orders.update({
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

      await tx.orderTransactionRemark.create({
        data: {
          orderId,
          adminId: user.id,
          staffName,
          status: "AWAITING_SHIPPING_FEE_CONFIRMATION",
          remarks,
        },
      });

      return orderData;
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

export const deleteOrder = async (orderId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!orderId) {
    return { error: "Order ID is required." };
  }

  try {
    const data = await db.orders.delete({
      where: {
        id: orderId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted an order ${
          data.orderNumber
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Order deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete order. Please try again. ${error.message || ""}`,
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

export async function updateOrderStatus(
  orderId: string,
  status: string,
  meta?: OrderTransactionMeta,
) {
  const { user, staffName, remarks } = await normalizeOrderTransactionMeta(
    orderId,
    meta,
  );
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

  const order = await db.$transaction(async (tx) => {
    const orderData = await tx.orders.update({
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

    await tx.orderTransactionRemark.create({
      data: {
        orderId,
        adminId: user.id,
        staffName,
        status,
        remarks,
      },
    });

    return orderData;
  });

  return order;
}
