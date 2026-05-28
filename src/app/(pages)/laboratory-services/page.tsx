import React from "react";
import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";
import { getActiveLaboratoryServiceCategories } from "@/actions/laboratory-services";
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
  Activity,
  ArrowRight,
  Droplets,
  FlaskConical,
  Microscope,
  TestTube,
} from "lucide-react";

const categoryStyles = [
  {
    icon: Droplets,
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: FlaskConical,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Activity,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Microscope,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: TestTube,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const LaboratoryServices = async () => {
  const response = await getActiveLaboratoryServiceCategories();
  const categories = response.data || [];

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

        <div className="mt-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Laboratory Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive, accurate, and reliable laboratory testing services.
            Our facility provides a wide range of diagnostic tests to help you
            maintain optimal health and wellness.
          </p>
        </div>

        {categories.length === 0 ? (
          <Card className="mb-12 border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-lg font-semibold text-gray-900">
                No laboratory services are available yet.
              </p>
              <p className="mt-2 text-gray-600">
                Please check back soon or contact us for the latest available
                tests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category, index) => {
              const style = categoryStyles[index % categoryStyles.length];
              const Icon = style.icon;

              return (
                <Link
                  key={category.id}
                  href={`/laboratory-services/${category.slug}`}
                >
                  <Card
                    className={`${style.color} transition-all duration-300 cursor-pointer h-full`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-2">
                        <div
                          className={`p-3 rounded-lg bg-white ${style.iconColor}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">
                          {category.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {category.description ||
                          `${category.services.length} available laboratory service(s).`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        View Available Tests
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

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
                State-of-the-art equipment and trained staff support reliable
                test results.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <TestTube className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Turnaround</h3>
              <p className="text-gray-600">
                Efficient processing helps patients receive results as quickly
                as possible.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Microscope className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Comprehensive Testing
              </h3>
              <p className="text-gray-600">
                Services are organized by category so patients can easily find
                available tests.
              </p>
            </div>
          </div>
        </div>

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
