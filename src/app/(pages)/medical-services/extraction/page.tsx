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
import { Syringe, CheckCircle2, Shield, Clock, Home, Users } from "lucide-react";

const ExtractionServices = () => {
  const services = [
    "Routine Blood Collection",
    "Fasting Blood Sugar (FBS) Collection",
    "Lipid Profile Collection",
    "Complete Blood Count (CBC) Collection",
    "Hormone Level Testing Collection",
    "Home Blood Extraction Service",
    "Pediatric Blood Collection",
    "Specialized Test Collection",
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Safe & Sterile",
      description: "All procedures follow strict safety and sterilization protocols",
    },
    {
      icon: Users,
      title: "Expert Phlebotomists",
      description: "Experienced professionals ensuring minimal discomfort",
    },
    {
      icon: Home,
      title: "Clinic or Home",
      description: "Available at our clinic or in the comfort of your home",
    },
    {
      icon: Clock,
      title: "Quick & Efficient",
      description: "Fast and efficient collection process",
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
              <BreadcrumbLink className="text-[16px]" href="/medical-services">
                Medical Services
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">Blood Extraction</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <Syringe className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Blood Extraction
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Professional blood sample collection services
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">About Blood Extraction</CardTitle>
            <CardDescription className="text-base">
              Our blood extraction service provides professional and safe blood sample collection
              for various laboratory tests. Performed by experienced phlebotomists using sterile
              techniques, we ensure minimal discomfort and maximum safety. Whether you need routine
              blood work, fasting blood sugar tests, or specialized collections, our team is equipped
              to handle all your blood collection needs. We offer both clinic-based and home visit
              services for your convenience.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-6 w-6 text-red-600" />
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Services Offered</CardTitle>
            <CardDescription>
              Comprehensive blood collection services for various testing needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">{service}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 bg-red-50 rounded-lg p-6 border border-red-200">
          <h3 className="font-semibold text-lg mb-2">Schedule Your Blood Extraction</h3>
          <p className="text-gray-700 mb-4">
            Contact us to schedule a blood extraction appointment at our clinic or arrange for
            a home visit. Our professional phlebotomists are ready to assist you.
          </p>
          <Link href="/contact-us">
            <Button className="bg-primary hover:bg-primary/90">
              Contact Us to Schedule
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExtractionServices;

