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
  Briefcase,
  Heart,
  Users,
  TrendingUp,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import { getActiveCareers } from "@/actions/career";
import CareersClient from "./careers-client";

const Careers = async () => {
  const careersResponse = await getActiveCareers();
  const positions = careersResponse.data || [];

  const benefits = [
    {
      icon: Heart,
      title: "Health Benefits",
      description: "Comprehensive health insurance and wellness programs",
    },
    {
      icon: Award,
      title: "Professional Development",
      description: "Training opportunities and career advancement programs",
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Flexible scheduling and paid time off",
    },
    {
      icon: Users,
      title: "Team Environment",
      description: "Collaborative and supportive workplace culture",
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
              <BreadcrumbPage className="text-[16px]">Careers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mt-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Join Our Team
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Build your career with us and make a difference in healthcare
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Why Work With Us?</CardTitle>
            <CardDescription className="text-base">
              At Cervo Drug Store, we're committed to providing exceptional healthcare services
              to our community. We value our employees and offer a supportive work environment
              where you can grow professionally while making a meaningful impact on people's lives.
              Join our team of dedicated healthcare professionals and be part of a company that
              truly cares about both its patients and its staff.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Open Positions</h2>
          {positions.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {positions.map((position) => (
                <Card key={position.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{position.jobTitle}</CardTitle>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {position.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{position.jobLocation}</span>
                    </div>
                    <div
                      className="text-base text-muted-foreground line-clamp-3 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_li]:mb-1 [&_p]:mb-2"
                      dangerouslySetInnerHTML={{ __html: position.jobDescription || "" }}
                    />
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">
                        Experience: {position.experienceNeeded}
                        {position.yearsOfExperience && ` (${position.yearsOfExperience} years)`}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CareersClient career={position} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600">No open positions at the moment. Please check back later.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Don't See a Position That Fits?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team.
            Submit a general application and we'll keep you in mind for future opportunities.
          </p>
          <CareersClient career={null} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;

