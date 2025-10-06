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
import { MapPin, ArrowLeft } from "lucide-react";

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
    <div className="flex relative min-h-screen w-full flex-col bg-gray-50">
      <Navbar />
      <div className="px-4 xl:px-60 py-8 mt-5">
        <Breadcrumb className="mb-6">
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

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MapPin className="size-6 text-gray-700" />
            <h1 className="font-bold text-3xl text-gray-900">My Addresses</h1>
          </div>
          <Link href="/my-profile">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Account
            </Button>
          </Link>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Manage Your Addresses
              </h2>
              <p className="text-gray-600">
                Add, edit, or remove delivery addresses for your orders.
              </p>
            </div>

            <AddressForm user={user} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAddresses;
