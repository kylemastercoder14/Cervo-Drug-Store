"use client";

import Link from "next/link";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from 'sonner';

const Footer = () => {
  const handleClick = () => {
    toast.success("Subscribed to newsletter!");
  }
  return (
    <>
      <footer className="bg-black px-4 xl:px-60 gap-20 text-white py-8 grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1">
        <div className="flex flex-col col-span-2">
          <p className="font-semibold text-xl mb-2">About</p>
          <p className="text-md text-muted-foreground">
            Your trusted partner for health and wellness, now just a click away!
            At Cervo, we offer a seamless online platform where you can
            conveniently purchase medicines and health essentials from the
            comfort of your home. With a commitment to quality and care, our
            licensed pharmacy ensures safe and reliable delivery straight to
            your door.
          </p>
          <p className="font-semibold text-xl mt-3">Newsletter</p>
          <p className="text-md text-muted-foreground mb-3">
            Subscribe to our newsletter to get the best deals and promos.
          </p>
          <p></p>
          <div className="flex items-center gap-2">
            <Input placeholder="Type your email address" />
            <Button onClick={handleClick} variant="primary">Subscribe</Button>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-xl mb-2">Quick Links</p>
          <Link
            href="/privacy-policy"
            className="text-muted-foreground hover:text-white font-semibold text-md"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="text-muted-foreground hover:text-white font-semibold text-md"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/faqs"
            className="text-muted-foreground hover:text-white font-semibold text-md"
          >
            FAQs
          </Link>
          <Link
            href="/contact-us"
            className="text-muted-foreground hover:text-white font-semibold text-md"
          >
            Contact Us
          </Link>
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-xl mb-2">Opening Hours</p>
          <p className="text-muted-foreground text-md font-semibold">
            Mon-Sat 8:00am to 7:00pm
          </p>
          <p className="font-semibold text-xl mt-3 mb-2">Branches</p>
          <p className="text-muted-foreground text-md font-semibold">
            <span className="text-lg">•</span> No. 472-A Elisco Rd., Brgy. San
            Joaquin, Pasig City
          </p>
          <p className="text-muted-foreground text-md font-semibold">
            <span className="text-lg">•</span> 152-A 12th Avenue, J.P Rizal
            Ext., East Rembo, Taguig City
          </p>
        </div>
      </footer>
      <div className="bg-white px-4 xl:px-60 py-5 grid xl:grid-cols-3 grid-cols-1 xl:gap-20 gap-10">
        <p className="text-muted-foreground text-sm">
          Cervo Drugstore and Medical Clinic
        </p>
        <div className="flex flex-col">
          <p className="text-[#437634] font-semibold">
            MEDICINE DELIVERY SERVICES
          </p>
          <div className="flex items-center mt-2 gap-3">
            <Image
              src="/brands/lalamove.webp"
              alt="lalamove"
              width={80}
              height={80}
            />
            <Image src="/brands/lbc.png" alt="lbc" width={50} height={50} />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-[#437634] font-semibold">PAYMENT ACCEPTED</p>
          <div className="flex items-center mt-2 gap-3">
            <Image src="/brands/gcash.png" alt="gcash" width={50} height={50} />
            <Image src="/brands/maya.png" alt="maya" width={80} height={80} />
          </div>
        </div>
      </div>
      <div className="px-4 md:px-60 py-3 bg-[#437634]">
        <p className="text-lg text-center text-white">
          &copy; 2024{" "}
          <span className="font-semibold underline">
            Cervo Drugstore and Medical Clinic
          </span>
          . All Rights Reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
