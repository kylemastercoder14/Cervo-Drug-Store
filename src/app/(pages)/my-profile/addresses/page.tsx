import React from "react";
import Chatbot from "@/components/landing-page/chatbot";
import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getUserByEmail } from "@/actions/user";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddressForm from '@/components/form/address-form';

const MyAddresses = async () => {
  const { userId } = auth();
  const user = await db.user.findUnique({
    where: {
      id: userId as string,
    },
    include: {
      address: true,
      orders: true,
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
              <BreadcrumbLink className="text-[16px]" href="/my-profile">
                Account
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">Address</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold text-4xl mb-5">My Addresses</h1>
        <div className="mt-5 flex flex-col items-center justify-center">
          <Link
            className="hover:text-black text-muted-foreground mt-3 mb-3"
            href="/my-profile"
          >
            &larr; Return to account details
          </Link>
          <AddressForm user={user} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAddresses;
