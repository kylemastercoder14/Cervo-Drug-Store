/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Chatbot from "@/components/landing-page/chatbot";
import Navbar from "@/components/landing-page/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OTPValidation } from "@/lib/validators";
import CustomFormField from "@/components/globals/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { maskEmail } from "@/lib/utils";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUser } from "@/actions/user";
import { Loader2 } from "lucide-react";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmail = ({ searchParams }: PageProps) => {
  const { setActive, isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const email = Array.isArray(searchParams.email)
    ? searchParams.email[0]
    : searchParams.email || "";
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof OTPValidation>>({
    resolver: zodResolver(OTPValidation),
    defaultValues: {
      otpCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof OTPValidation>) => {
    if (!isLoaded) return;

    try {
      setIsPending(true);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.otpCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        // Capture form data and insert into the database
        const data = JSON.parse(localStorage.getItem("Data") || "{}");
        await createUser(data, completeSignUp.createdUserId ?? "").then(
          (data) => {
            if (data?.error) {
              toast.error(data?.error);
            } else {
              toast.success(data?.success);
              localStorage.removeItem("Data");
              router.push("/");
            }
          }
        );
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      toast.error(err.message || "Failed to verify OTP.");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Chatbot />
      <Navbar />
      <div className="px-4 md:px-60 py-14">
        <Card className="rounded-none">
          <CardContent className="p-10">
            <div className="flex flex-col">
              <p className="font-bold text-xl border-b border-[#437634] pb-3">
                Verify Email
              </p>
              <p className="text-muted-foreground text-sm mb-5 mt-3">
                Enter the OTP code that we sent to your email <br />
                <span className="font-bold text-[#437634]">
                  {maskEmail(email)}
                </span>{" "}
                and be careful not to share the code with anyone.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CustomFormField
                    control={form.control}
                    label="OTP Code"
                    name="otpCode"
                    fieldType={FormFieldType.OTP_INPUT}
                    isRequired
                    disabled={isPending}
                  />
                  <Button disabled={isPending} variant="primary" className="mt-5">
                    {isPending && (
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    )}
                    CONTINUE
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
