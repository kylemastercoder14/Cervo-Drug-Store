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
import { Home, CheckCircle2, Heart, Shield, Clock, MapPin } from "lucide-react";

const HomeServices = () => {
  const services = [
    "Home Health Monitoring",
    "Medication Administration",
    "Vital Signs Monitoring",
    "Wound Care & Dressing",
    "Health Assessment Visits",
    "Post-Surgical Care",
    "Elderly Care Services",
    "Chronic Disease Management at Home",
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Comfort of Home",
      description: "Receive quality care in the comfort and privacy of your own home",
    },
    {
      icon: Shield,
      title: "Professional Care",
      description: "Licensed healthcare professionals providing safe and reliable services",
    },
    {
      icon: Clock,
      title: "Convenient Scheduling",
      description: "Flexible visit times that work with your schedule",
    },
    {
      icon: MapPin,
      title: "Local Service",
      description: "Serving your community with prompt and reliable home visits",
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
              <BreadcrumbPage className="text-[16px]">Home Services</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <Home className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Home Services
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Convenient medical care delivered to your doorstep
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">About Home Services</CardTitle>
            <CardDescription className="text-base">
              Our home services bring professional medical care directly to you. Whether you're
              recovering from surgery, managing a chronic condition, or simply prefer the comfort
              of receiving care at home, our licensed healthcare professionals provide comprehensive
              services in the comfort of your own residence. This service is especially beneficial
              for elderly patients, those with mobility issues, or anyone who prefers the convenience
              of home-based care.
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
                    <Icon className="h-6 w-6 text-green-600" />
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
              Comprehensive home healthcare services tailored to your needs
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

        <div className="mt-8 bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="font-semibold text-lg mb-2">Schedule a Home Visit</h3>
          <p className="text-gray-700 mb-4">
            Contact us to schedule a home visit or learn more about our home healthcare services.
            Our team is ready to provide quality care in the comfort of your home.
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

export default HomeServices;

