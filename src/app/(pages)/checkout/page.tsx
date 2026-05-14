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
import Footer from "@/components/landing-page/footer";
import CheckoutForm from "@/components/form/checkout-form";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

const Checkout = async () => {
  const { userId } = auth();
  const user = await db.user.findUnique({
    where: {
      id: userId as string,
    },
    include: {
      address: true,
    },
  });
  return (
    <div className="flex relative min-h-screen w-full flex-col">
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
        <CheckoutForm user={user} email={user?.email as string} />
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
