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
import db from "@/lib/db";
import Link from "next/link";
import UpdateAddressForm from "@/components/form/update-address-form";

const AddressId = async ({ params }: { params: { addressId: string } }) => {
  const data = await db.address.findUnique({
    where: {
      id: params.addressId,
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
          <UpdateAddressForm data={data} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddressId;
