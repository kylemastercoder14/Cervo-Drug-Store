import React from "react";
import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

const CustomerId = async (
  props: {
    params: Promise<{
      customerId: string;
    }>;
  }
) => {
  const params = await props.params;
  const data = await db.user.findUnique({
    where: {
      id: params.customerId,
    },
    include: {
      address: {
        where: {
          isDefault: true,
        },
      },
    },
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Customer not found</h2>
          <Link href="/admin/customers" className="text-blue-600 hover:underline mt-4 inline-block">
            &larr; Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  // Extract address fields or show "N/A" if all are missing
  const address = data.address[0];
  const formattedAddress =
    address?.homeAddress ||
    address?.barangay ||
    address?.city ||
    address?.province
      ? `${address?.homeAddress || ""}, ${address?.barangay || ""}, ${
          address?.city || ""
        }, ${address?.province || ""}, ${address?.region || ""} - ${
          address?.zipCode || ""
        }`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '')
      : "N/A";

  return (
    <div className="min-h-screen py-5">
      <div>
        {/* Back Button */}
        <Link
          href="/admin/customers"
          className="inline-flex items-center hover:text-primary font-medium mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Customers Page
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
        </div>

        {/* Customer Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Personal Information Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="text-base font-medium text-gray-900">
                  {data.firstName} {data.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">User Type</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  data.seniorPwdId
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {data.seniorPwdId ? "Senior Citizen" : "Regular"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="text-base text-gray-900">{data.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                <p className="text-base text-gray-900">{data.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
            <div>
              <p className="text-base text-gray-900">{formattedAddress}</p>
            </div>
          </div>

          {/* Senior Citizen/PWD Information Section */}
          {data.seniorPwdId && (
            <div className="p-6 bg-purple-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Senior Citizen/PWD Information</h2>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">ID Number</p>
                <p className="text-base font-medium text-gray-900">{data.seniorPwdId}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.seniorPwdIdImage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Senior Citizen/PWD ID</p>
                    <div className="relative w-full h-48 bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-purple-400 transition-colors">
                      <Image
                        src={data.seniorPwdIdImage}
                        alt="Senior Citizen/PWD ID"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                )}

                {data.seniorPwdBookletImage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Senior Citizen/PWD Booklet</p>
                    <div className="relative w-full h-48 bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-purple-400 transition-colors">
                      <Image
                        src={data.seniorPwdBookletImage}
                        alt="Senior Citizen/PWD Booklet"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerId;
