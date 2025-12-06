import { z } from "zod";

export const SigninValidation = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .min(1, { message: "Email address is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const OTPValidation = z.object({
  otpCode: z
    .string()
    .min(1, { message: "OTP Code is required" })
    .max(6, { message: "OTP Code must be 6 characters long" }),
});

export const SignupValidation = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phoneNumber: z.string().min(1, { message: "Mobile number is required" }),
  zipCode: z.string().min(1, { message: "Postal code is required" }),
  acceptPolicy: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .min(1, { message: "Email address is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
});

export const SeniorPwdRegistration = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phoneNumber: z.string().min(1, { message: "Mobile number is required" }),
  zipCode: z.string().min(1, { message: "Postal code is required" }),
  acceptPolicy: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .min(1, { message: "Email address is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
  seniorPwdId: z.string().min(1, { message: "Senior/PWD is required" }),
  seniorPwdIdImage: z
    .string()
    .min(1, { message: "Senior/PWD ID image is required" }),
  seniorPwdBookletImage: z
    .string()
    .min(1, { message: "Senior/PWD booklet image is required" }),
});

export const CheckoutValidation = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .min(1, { message: "Email address is required" }),
  acceptPolicy: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
  branch: z.string().min(1, { message: "Branch is required" }),
  prescription: z.string().optional(),
  recipientRemarks: z.string().optional(),
});

export const BannerValidation = z.object({
  image: z.string().min(1, { message: "Banner image is required" }),
});

export const PromotionValidation = z.object({
  image: z.string().min(1, { message: "Promotional image is required" }),
  isFeatured: z.boolean().optional(),
});

export const CategoryValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.string().min(1, { message: "Category image is required" }),
});

export const ProductValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(1, { message: "Price is required" }),
  isFeatured: z.boolean().optional(),
  isVatItem: z.boolean().optional(),
  isPrescriptionRequired: z.boolean().optional(),
  categoryTag: z.string().optional(),
});

export const InventoryValidation = z.object({
  productId: z.string().min(1, { message: "Product is required" }),
  stock: z.number().min(1, { message: "Stock is required" }),
});

export const NewsEventValidation = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  image: z.string().min(1, { message: "Image is required" }),
});

export const StaffValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email address is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.string().min(1, { message: "Role is required" }),
});
