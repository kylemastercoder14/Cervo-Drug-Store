import React from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Microscope } from "lucide-react";
import { getLaboratoryServiceCategoryBySlug } from "@/actions/laboratory-services";
import { notFound } from "next/navigation";
import Link from "next/link";

type LaboratoryServiceCategoryPageProps = {
  params: {
    categorySlug: string;
  };
};

const LaboratoryServiceCategoryPage = async ({
  params,
}: LaboratoryServiceCategoryPageProps) => {
  const response = await getLaboratoryServiceCategoryBySlug(
    params.categorySlug,
  );

  if (!response.data) {
    notFound();
  }

  const category = response.data;

  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Navbar />
      <div className="w-full xl:px-60 px-4 py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-[16px]"
                href="/laboratory-services"
              >
                Laboratory Services
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">
                {category.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <Microscope className="h-8 w-8 text-green-700" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-gray-600 mt-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {category.description && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">About {category.name}</CardTitle>
              <CardDescription className="text-base">
                {category.description}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Available Tests</CardTitle>
            <CardDescription>
              Available laboratory services under {category.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {category.services.map((service) => (
                <div
                  key={service}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">{service}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-lg mb-2">Need More Information?</h3>
          <p className="text-gray-700 mb-4">
            Contact our laboratory team to schedule your test or learn more
            about our laboratory services.
          </p>
          <Link
            href="/contact-us"
            className="text-primary hover:underline font-medium"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LaboratoryServiceCategoryPage;
