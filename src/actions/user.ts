/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";

export const createUser = async (data: any, userId: string) => {
  try {
    await db.user.create({
      data: {
        id: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        contactNumber: data.phoneNumber,
        zipCode: data.zipCode,
        password: data.password,
        userType: "User",
        seniorPwdId: data.seniorPwdId || null,
        seniorPwdBookletImage: data.seniorPwdBookletImage || null,
        seniorPwdIdImage: data.seniorPwdIdImage || null,
      },
    });

    await db.address.create({
      data: {
        homeAddress: "",
        barangay: "",
        city: "",
        province: "",
        region: "",
        zipCode: data.zipCode,
        contactNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        userId,
      },
    });

    return { success: "User created successfully." };
  } catch (error: any) {
    console.error(JSON.stringify(error, null, 2));
    return { error: error.message || "Failed to create user." };
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });
    console.log(user);
    return user;
  } catch (error: any) {
    console.error(JSON.stringify(error, null, 2));
    return { error: error.message || "Failed to get user." };
  }
};

export const createAddress = async (
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    phoneNumber: string;
    isDefaultAddress: boolean;
    region: string;
    province: string;
    municipality: string;
    barangay: string;
  }
) => {
  try {
    const isThereDefaultAddress = await db.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });

    // If a default address exists and the new one is marked as default, update existing default
    if (isThereDefaultAddress && data.isDefaultAddress) {
      await db.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // If no default address exists, make the new address the default
    const isDefault = !isThereDefaultAddress ? true : data.isDefaultAddress;

    await db.address.create({
      data: {
        homeAddress: data.address,
        barangay: data.barangay,
        city: data.municipality,
        province: data.province,
        region: data.region,
        zipCode: data.postalCode,
        contactNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        userId,
        isDefault,
      },
    });

    return { success: "Address created successfully." };
  } catch (error: any) {
    console.error(JSON.stringify(error, null, 2));
    return { error: error.message || "Failed to create address." };
  }
};

export const updateAddress = async (
  id: string,
  data: {
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    phoneNumber: string;
    isDefaultAddress: boolean;
    region: string;
    province: string;
    municipality: string;
    barangay: string;
    userId: string;
  }
) => {
  try {
    if (data.isDefaultAddress) {
      await db.address.updateMany({
        where: {
          userId: data.userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    await db.address.update({
      data: {
        homeAddress: data.address,
        barangay: data.barangay,
        city: data.municipality,
        province: data.province,
        region: data.region,
        zipCode: data.postalCode,
        contactNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        userId: data.userId,
        isDefault: data.isDefaultAddress,
      },
      where: {
        id,
      },
    });

    return { success: "Address updated successfully." };
  } catch (error: any) {
    console.error(JSON.stringify(error, null, 2));
    return { error: error.message || "Failed to update address." };
  }
};
