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
import { Droplets, CheckCircle2 } from "lucide-react";

const HematologyServices = () => {
  const tests = [
    "Complete Blood Count w/ Platelet Count (CBCPC)",
    "Blood Typing w/ Rh",
    "Erythrocyte Sedimentation Rate (ESR)",
    "Clotting / Bleeding Time",
    "Peripheral Blood Smear",
    "Reticulocyte Count",
  ];

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
              <BreadcrumbLink className="text-[16px]" href="/laboratory-services">
                Laboratory Services
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">Hematology</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <Droplets className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Hematology
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Comprehensive blood analysis and blood-related testing services
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">About Hematology</CardTitle>
            <CardDescription className="text-base">
              Hematology is the branch of medicine concerned with the study, diagnosis,
              treatment, and prevention of diseases related to blood, blood-forming organs,
              and blood disorders. Our hematology laboratory provides comprehensive blood
              analysis to help diagnose and monitor various conditions.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Available Tests</CardTitle>
            <CardDescription>
              We offer a comprehensive range of hematology tests to assess your blood health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {tests.map((test, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">{test}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-lg mb-2">Need More Information?</h3>
          <p className="text-gray-700 mb-4">
            Contact our laboratory team to schedule your test or learn more about
            our hematology services.
          </p>
          <a href="/contact-us" className="text-primary hover:underline font-medium">
            Contact Us →
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HematologyServices;

