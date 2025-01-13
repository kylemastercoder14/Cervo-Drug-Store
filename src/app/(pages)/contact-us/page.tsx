import React from "react";
import Chatbot from "@/components/landing-page/chatbot";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const ContactUs = () => {
  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Chatbot />
      <Navbar />
      <div className="px-4 xl:px-60 py-5 mt-5">
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
                Contact Us
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold text-4xl">Contact Us</h1>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-10 mt-10 px-20">
          <div className="flex flex-col items-center justify-center text-center bg-[#f5f5f5] p-5 rounded-lg">
            <h1>Online Customer Service & General Inquiries</h1>
            <p className="text-muted-foreground my-3">
              Get assistance with FAQ's, refunds, product availability,
              complaints and general inquiries.
            </p>
            <Link href="mailto:cervodrugstore@gmail.com">
              <Button>Inquire Now</Button>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center text-center bg-[#f5f5f5] p-5 rounded-lg">
            <h1>Online Order Support</h1>
            <p className="text-muted-foreground my-3">
              For online payment status, processing and payments inquiries.
            </p>
            <Link href="mailto:cervodrugstore@gmail.com">
              <Button>Inquire Now</Button>
            </Link>
          </div>
        </div>
        <Separator className="my-10 bg-primary" />
        <div className="flex flex-col items-center justify-center text-center mt-10">
          <h3>We're here to help!</h3>
          <p>
            Cervo Drug Store Customer Support is available daily from 8:00 AM to
            7:00 PM.
          </p>
          <p>Monday - Saturday (except holidays)</p>
          <p className="mb-10">You may reach us at </p>
          <p className="font-semibold my-2">
            Globe: <span className="text-primary">(+63) 912 345 6789</span>
          </p>
          <p className="font-semibold my-2">
            Smart: <span className="text-primary">(+63) 912 345 6789</span>
          </p>
          <p className="font-semibold my-2">
            PLDT: <span className="text-primary">(+63) 912 345 6789</span>
          </p>
          <p className="font-semibold my-2">
            Or via Email:{" "}
            <span className="text-primary">cervodrugstore@gmail.com</span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
