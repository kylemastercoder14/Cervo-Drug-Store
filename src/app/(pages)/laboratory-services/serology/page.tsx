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
import { Activity, CheckCircle2 } from "lucide-react";

const SerologyServices = () => {
  const tests = [
    "Hepatitis B surface Antigen (HBsAG) Screening",
    "Syphilis (RPR) Test",
    "HIV Screening",
    "T3, T4, FT3, FT4, TSH",
    "Dengue NS1",
    "Dengue IgG IgM",
    "Prostate Specific Antigen (PSA)",
    "Carcinoembryonic Antigen (CEA)",
    "Alpha Fetoprotein (AFP)",
    "CA-125 (Ovaria CA)",
    "CA 15-3 (Breast CA)",
    "C-Reactive Protein (CRP)",
    "Rheumatoid Factor (RF)",
    "Anti Streptolysin O (ASO)",
    "H. pylori Antibody",
    "H. pylori Antigen",
    "HS-Troponin I",
    "D-Dimer",
    "NTpro BNP",
    "Vitamin D",
    "Ferritin",
    "Beta-HCG",
    "CK-MB",
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
              <BreadcrumbPage className="text-[16px]">Serology & Immunology</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Serology & Immunology
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Advanced immunological testing for infectious diseases, hormones, and tumor markers
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">About Serology & Immunology</CardTitle>
            <CardDescription className="text-base">
              Serology and immunology tests detect antibodies, antigens, and other immune system
              markers in blood. These tests are crucial for diagnosing infectious diseases,
              monitoring hormone levels, detecting cancer markers, and assessing autoimmune conditions.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Available Tests</CardTitle>
            <CardDescription>
              Comprehensive serological and immunological testing services
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
            our serology and immunology services.
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

export default SerologyServices;

