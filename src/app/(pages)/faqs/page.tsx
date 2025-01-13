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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faqs = () => {
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
                Frequently Asked Questions (FAQs)
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold text-4xl mb-5">FAQs</h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-2xl">
              PAYMENT METHODS
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              <span className="font-semibold">Can I pay using cash?</span>
              <p>
                Yes, Cash on Delivery is available for orders within Metro
                Manila, Rizal and select areas of Pampanga namely Mabalacat,
                Angeles and San Fernando only. We highly encourage you to
                prepare the exact amount of payment.
              </p>
              <span className="font-semibold mt-3">
                Can I pay using my debit or credit card?
              </span>
              <p>
                Currently, we do not offer the option to pay using debit or
                credit cards. However, we are actively working on adding more
                payment methods to provide greater convenience. Please stay
                tuned for updates!
              </p>
              <span className="font-semibold">
                Can I pay via bank deposit or transfer?
              </span>
              <p>
                At this time, we do not support payments through bank deposits
                or transfers. We are continually exploring additional payment
                options to enhance your experience. Please check back soon for
                updates!
              </p>
              <span className="font-semibold">Can I pay via GCash?</span>
              <p>
                Yes. GCash via Paymongo is available on our site. Please note
                that any adjustments on Senior Citizen / PWD discounts will be
                processed via GCash refund in 3 to 5 banking days.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-2xl">
              PRESCRIPTION MEDICINES
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              <span className="font-semibold">
                Do you require prescriptions?
              </span>
              <p>
                Yes, all orders of prescription medicines should be accompanied
                by a valid prescription. You may directly upload your
                prescription on the site and our dedicated pharmacist will
                validate and contact you if necessary.
              </p>
              <p>Type of files and size accepted:</p>
              <p>• .jpg, .jpeg, .pdf, .png</p>
              <p>• Up to 3 files</p>
              <p>• File size up to 5MB</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-2xl">DISCOUNTS</AccordionTrigger>
            <AccordionContent className="text-lg">
              <span className="font-semibold">
                Do you give Senior Citizen / PWD discount?
              </span>
              <p>
                Senior Citizen and PWD discounts are now being offered to
                qualified customers. Documents such as Senior Citizen/PWD ID,
                booklet and valid prescriptions are required to avail the
                discount. Please note that the discount will not be
                automatically applied upon checkout. Final discounted amount
                will be sent via email once we have validated your submitted
                requirements.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-2xl">
              SHIPPING & DELIVERY
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              <span className="font-semibold">
                How does shipping and delivery work?
              </span>
              <p>
                At the moment, we do not offer standard shipping options.
                However, we provide a self-delivery service where our admin can
                book a delivery rider from services such as Lalamove, Toktok, or
                other reliable delivery companies.
              </p>
              <p>
                Customers will be responsible for covering the shipping fee
                directly to the rider upon delivery. Once your order is
                confirmed, you will receive details about the delivery
                arrangement and estimated costs.
              </p>
              <p>
                We are continuously working on improving our shipping and
                delivery options to make your experience more convenient. Thank
                you for your understanding!
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
};

export default Faqs;
