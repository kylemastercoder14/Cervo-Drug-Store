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
  Stethoscope,
  Home,
  Syringe,
  Heart,
  Shield,
  Clock,
} from "lucide-react";

const MedicalServices = () => {
  const services = [
    {
      title: "Medical Consultation",
      description: "Professional medical consultations with licensed physicians for general health concerns, preventive care, and treatment planning",
      icon: Stethoscope,
      href: "/medical-services/consultation",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Home Services",
      description: "Convenient home visit services including health monitoring, medication administration, and patient care",
      icon: Home,
      href: "/medical-services/home-services",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Blood Extraction",
      description: "Professional blood sample collection services available at our clinic or in the comfort of your home",
      icon: Syringe,
      href: "/medical-services/extraction",
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const features = [
    {
      icon: Heart,
      title: "Expert Care",
      description: "Licensed medical professionals dedicated to your health and wellness",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All procedures follow strict safety protocols and medical standards",
    },
    {
      icon: Clock,
      title: "Convenient Scheduling",
      description: "Flexible appointment times to fit your busy schedule",
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
                Medical Services
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mt-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Medical Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive medical care services delivered by experienced healthcare professionals.
            From consultations to home visits, we provide personalized care tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.href} href={service.href}>
                <Card className={`${service.color} transition-all duration-300 cursor-pointer h-full`}>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-lg bg-white ${service.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Our Medical Services?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Schedule Your Appointment?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contact us today to schedule a consultation or learn more about our medical services.
            Our team is here to help you maintain optimal health and wellness.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact-us">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contact Us
              </Button>
            </Link>
            <Link href="/laboratory-services">
              <Button size="lg" variant="outline">
                View Laboratory Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MedicalServices;

