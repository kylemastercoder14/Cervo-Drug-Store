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
import { FlaskConical, CheckCircle2 } from "lucide-react";

const ClinicalChemistryServices = () => {
  const tests = [
    "Fasting Blood Sugar (FBS)",
    "Random Blood Sugar (RBS)",
    "Oral Glucose Tolerance Test (2nd/3rd hr.)",
    "2hr Post Prandial Blood Sugar (PPBS)",
    "HbA1c",
    "Lipid Profile (Total Cholesterol, Triglyceride, HDL, LDL, VLDL)",
    "Blood Uric Acid (BUA)",
    "Blood Urea Nitrogen (BUN)",
    "Creatinine",
    "ALT / SGPT",
    "AST / SGOT",
    "Total Protein",
    "Albumin",
    "TPAG Ratio",
    "Total Bilirubin",
    "Direct / Indirect Bilirubin",
    "Alkaline Phosphatase (ALP)",
    "Total Iron Binding Capacity (TIBC)",
    "Electrolytes (Sodium (Na), Potassium (K), Chloride (Cl), Ionized Calcium (iCa), Magnesium (Mg), Inorganic Phosphorus)",
    "Urine Creatinine",
    "Urine Total Protein",
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
              <BreadcrumbPage className="text-[16px]">Clinical Chemistry</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <FlaskConical className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Clinical Chemistry
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Comprehensive metabolic and biochemical analysis for optimal health monitoring
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">About Clinical Chemistry</CardTitle>
            <CardDescription className="text-base">
              Clinical chemistry tests analyze chemical components in blood, urine, and other
              body fluids to assess organ function, detect diseases, and monitor treatment
              effectiveness. These tests are essential for diagnosing and managing conditions
              like diabetes, liver disease, kidney function, and metabolic disorders.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Available Tests</CardTitle>
            <CardDescription>
              Our clinical chemistry laboratory offers a comprehensive range of biochemical tests
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
            our clinical chemistry services.
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

export default ClinicalChemistryServices;

