"use client";

import Chatbot from "@/components/landing-page/chatbot";
import Navbar from "@/components/landing-page/navbar";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing-page/footer";
import { Input } from "@/components/ui/input";
import CheckoutForm from "@/components/form/checkout-form";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const Checkout = () => {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Chatbot />
      <Navbar />
      <div className="px-4 xl:px-60 py-5 mt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {!user && (
          <div className="bg-[#eeeeee] flex justify-between mt-5 items-center rounded-lg py-3 px-5 shadow-md border">
            <p className="font-semibold text-lg">
              Returning Customer?{" "}
              <Link
                href="/my-account"
                className="font-semibold underline text-[#437634] cursor-pointer"
              >
                Click here to login
              </Link>
            </p>
          </div>
        )}
        <p className="mt-4 mb-2 text-sm">
          If you have a coupon code, please apply it below.
        </p>
        <div className="flex items-center gap-2">
          <Input placeholder="Coupon Code" className="w-[200px]" />
          <Button variant="primary">Apply Coupon</Button>
        </div>
        <CheckoutForm user={user} />
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
