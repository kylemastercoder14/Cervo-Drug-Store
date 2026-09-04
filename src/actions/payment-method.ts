/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { PaymentMethodValidation } from "@/lib/validators";
import { z } from "zod";

export const getAllPaymentMethods = async () => {
  try {
    const data = await db.paymentMethod.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No payment methods found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createPaymentMethod = async (
  values: z.infer<typeof PaymentMethodValidation>
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = PaymentMethodValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { type, name, accountName, accountNumber, qrCode, isActive } =
    validatedField.data;

  try {
    const data = await db.paymentMethod.create({
      data: {
        type,
        name,
        accountName,
        accountNumber,
        qrCode: qrCode || null,
        isActive: isActive ?? true,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} created a payment method ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Payment method created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create payment method. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updatePaymentMethod = async (
  values: z.infer<typeof PaymentMethodValidation>,
  paymentMethodId: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!paymentMethodId) {
    return { error: "Payment method ID is required." };
  }

  const validatedField = PaymentMethodValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { type, name, accountName, accountNumber, qrCode, isActive } =
    validatedField.data;

  try {
    const data = await db.paymentMethod.update({
      where: {
        id: paymentMethodId,
      },
      data: {
        type,
        name,
        accountName,
        accountNumber,
        qrCode: qrCode || null,
        isActive: isActive ?? true,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated a payment method ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Payment method updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update payment method. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deletePaymentMethod = async (paymentMethodId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!paymentMethodId) {
    return { error: "Payment method ID is required." };
  }

  try {
    const data = await db.paymentMethod.delete({
      where: {
        id: paymentMethodId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted a payment method ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Payment method deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete payment method. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
