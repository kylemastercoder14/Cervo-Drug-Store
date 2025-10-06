/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SignupValidation } from "@/lib/validators";
import { Form } from "../ui/form";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";

const SignUpForm = () => {
  const { isLoaded, signUp } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      zipCode: "",
      email: "",
      password: "",
      acceptPolicy: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
    if (!isLoaded) return;
    try {
      setIsLoading(true);
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      // Send OTP to email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push(`/verify-email?email=${values.email}`);
      localStorage.setItem("Data", JSON.stringify(values));
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form autoComplete='off' onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <div className="grid gap-3">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Email Address"
              name="email"
              placeholder="jdelacruz@gmail.com"
              type="email"
              isRequired={true}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-3">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Password"
              name="password"
              placeholder="--------"
              type="password"
              isRequired={true}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="First Name"
              name="firstName"
              placeholder="Juan"
              type="text"
              isRequired={true}
              disabled={isLoading}
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Last Name"
              name="lastName"
              placeholder="Dela Cruz"
              type="text"
              isRequired={true}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              label="Phone Number"
              name="phoneNumber"
              placeholder="09123456789"
              type="phone"
              isRequired={true}
              disabled={isLoading}
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Postal Code / ZIP"
              name="zipCode"
              placeholder="4114"
              type="text"
              isRequired={true}
              disabled={isLoading}
            />
          </div>
          <p className="text-sm">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our privacy policy.
          </p>
          <div className="grid gap-3 mt-2">
            <CustomFormField
              name="acceptPolicy"
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              label="I’ve read and accept the Personal Information Protection Policy"
              isRequired={true}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-5">
            <Button
              type="submit"
              className="w-full"
              variant="secondary"
              disabled={isLoading}
              size="sm"
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
              CREATE AN ACCOUNT
            </Button>
            <Button
              type="button"
              className="w-full"
              variant="default"
              onClick={() =>
                router.push("/senior-and-pwd-account-registration")
              }
              disabled={isLoading}
              size="sm"
            >
              SENIOR/PWD REGISTRATION
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
