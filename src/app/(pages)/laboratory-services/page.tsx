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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  TestTube,
  Microscope,
  Activity,
  FlaskConical,
  Droplets,
} from "lucide-react";

const LaboratoryServices = () => {
  const categories = [
    {
      title: "Hematology",
      description: "Complete blood analysis including CBC, blood typing, and coagulation studies",
      icon: Droplets,
      href: "/laboratory-services/hematology",
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Clinical Chemistry",
      description: "Comprehensive metabolic panels, liver function tests, lipid profiles, and more",
      icon: FlaskConical,
      href: "/laboratory-services/clinical-chemistry",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Serology & Immunology",
      description: "Infectious disease testing, hormone panels, tumor markers, and autoimmune tests",
      icon: Activity,
      href: "/laboratory-services/serology",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Clinical Microscopy",
      description: "Urinalysis, fecalysis, pregnancy tests, and other microscopic examinations",
      icon: Microscope,
      href: "/laboratory-services/clinical-microscopy",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Microbiology & Histopathology",
      description: "Bacterial cultures, gram staining, pap smears, and tissue analysis",
      icon: TestTube,
      href: "/laboratory-services/microbiology",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      iconColor: "text-orange-600",
    },
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
              <BreadcrumbPage className="text-[16px]">
                Laboratory Services
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mt-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Laboratory Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive, accurate, and reliable laboratory testing services.
            Our state-of-the-art facility provides a wide range of diagnostic tests
            to help you maintain optimal health and wellness.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.href} href={category.href}>
                <Card className={`${category.color} transition-all duration-300 cursor-pointer h-full`}>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-lg bg-white ${category.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View Available Tests →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Our Laboratory Services?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Accurate Results</h3>
              <p className="text-gray-600">
                State-of-the-art equipment and certified technicians ensure precise and reliable test results
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <TestTube className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Turnaround</h3>
              <p className="text-gray-600">
                Quick processing times with most results available within 24-48 hours
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Microscope className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Comprehensive Testing</h3>
              <p className="text-gray-600">
                Wide range of tests covering all major diagnostic categories
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Schedule Your Test?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contact us today to schedule your laboratory test or speak with our
            medical professionals about which tests are right for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact-us">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contact Us
              </Button>
            </Link>
            <Link href="/medical-services">
              <Button size="lg" variant="outline">
                View Medical Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LaboratoryServices;

