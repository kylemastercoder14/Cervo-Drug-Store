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
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Edit } from "lucide-react";

const AddressId = async (props: { params: Promise<{ addressId: string }> }) => {
  const params = await props.params;
  const data = await db.address.findUnique({
    where: {
      id: params.addressId,
    },
  });

  if (!data) {
    return (
      <div className="flex relative min-h-screen w-full flex-col bg-gray-50">
        <Navbar />
        <div className="px-4 xl:px-60 py-8 mt-5">
          <div className="max-w-4xl mx-auto text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Address Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The address you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/my-profile/addresses">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Addresses
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              <BreadcrumbLink
                className="text-[16px]"
                href="/my-profile/addresses"
              >
                Addresses
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Edit className="size-6 text-gray-700" />
            <h1 className="font-bold text-3xl text-gray-900">Edit Address</h1>
          </div>
          <Link href="/my-profile/addresses">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Addresses
            </Button>
          </Link>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Update Address Details
              </h2>
              <p className="text-gray-600">
                Make changes to your delivery address information.
              </p>
            </div>

            <UpdateAddressForm data={data} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddressId;
