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
import { Stethoscope, CheckCircle2, Clock, Users, FileText } from "lucide-react";

const ConsultationServices = () => {
  const services = [
    "General Health Consultation",
    "Preventive Care & Health Screening",
    "Chronic Disease Management",
    "Acute Illness Treatment",
    "Health Check-ups & Physical Examinations",
    "Prescription Management",
    "Health Counseling & Education",
    "Referral Services",
  ];

  const benefits = [
    {
      icon: Users,
      title: "Experienced Physicians",
      description: "Consult with licensed and experienced medical professionals",
    },
    {
      icon: FileText,
      title: "Comprehensive Care",
      description: "Thorough evaluation and personalized treatment plans",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Appointments available to fit your schedule",
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
              <BreadcrumbPage className="text-[16px]">Consultation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Medical Consultation
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Professional medical consultations with licensed physicians
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">About Medical Consultation</CardTitle>
            <CardDescription className="text-base">
              Our medical consultation services provide you with access to experienced healthcare
              professionals who can address your health concerns, provide diagnoses, and develop
              personalized treatment plans. Whether you need a routine check-up, have specific
              health concerns, or require ongoing management of a chronic condition, our physicians
              are here to help.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-6 w-6 text-blue-600" />
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
              Comprehensive consultation services to meet your healthcare needs
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

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-lg mb-2">Schedule Your Consultation</h3>
          <p className="text-gray-700 mb-4">
            Contact us to schedule an appointment with one of our experienced physicians.
            We're here to help you maintain optimal health and wellness.
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

export default ConsultationServices;

