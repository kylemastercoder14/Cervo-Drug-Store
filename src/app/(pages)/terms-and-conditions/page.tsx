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

const TermsConditions = () => {
  return (
    <div className="flex relative min-h-screen w-full flex-col">
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
                Terms & Conditions
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold text-4xl mb-5">Terms & Conditions</h1>
        <p>Last updated: January 15, 2025</p>
        <h3 className="mt-5">AGREEMENT TO OUR LEGAL TERMS</h3>
        <p>
          Cervo Drug Store and Medical Clinic makes this website, including all
          information, products, and services provided by Cervo Drug Store and
          Medical Clinic through the South Star Drug online store, available for
          your use subject to the terms and conditions set forth in this
          document and any changes to this document that Cervo Drug Store and
          Medical Clinic may publish from time to time. By visiting or shopping
          at the South Star Drug online store, you accept to be bound by these
          Terms of Service and agree that you are responsible for compliance
          with any applicable laws and regulations. <br /> <br />
          Cervo Drug Store and Medical Clinic reserves the right to change the
          Terms of Service posted on the website from time to time at its sole
          discretion. Your use of the website will be subject to the most
          current version of the Terms of Service posted on the website at the
          time of such use. We collect and use information about you to reply to
          your request, process your order, and help us personalize your
          shopping experience at the South Star Drug online store. We use the
          same information to identify and contact you, verify and confirm your
          order, and provide customer care services. Please review our Privacy
          Policy for information on our terms and privacy practices. <br /> <br /> The
          content on this website, such as text, graphics, logos, media files,
          and content compilations, is protected by copyright, trademark, and/or
          other intellectual property laws. Content on the South Star Drug
          webstore is provided “as is,” and changes and updates may be made in
          the products and services at any time without notice. South Star Drug,
          Inc. makes no warranties, expressed or implied, and hereby disclaims
          and negates all other warranties, including without limitation,
          implied warranties or conditions of merchantability, fitness for a
          particular purpose, or noninfringement of intellectual property or
          other violation of rights. Further, Cervo Drug Store and Medical
          Clinic does not warrant or make any representations concerning the
          accuracy, likely results, or reliability of the use of the content on
          its website or otherwise relating to such content or on any linked
          websites. <br /> <br /> We shall not be liable for any breach, hindrance, or
          delay in fulfilling orders attributable to any cause beyond our
          reasonable control, including without limitation any natural disaster
          and unavoidable incident, actions of third parties (including, without
          limitation, hackers, suppliers, governments, quasi-governmental,
          supra-national or local authorities), insurrection, riot, civil
          commotion, war, hostilities, warlike operations, national emergencies,
          terrorism, piracy, arrests, restraints or detainments of any competent
          authority, strikes or combinations or lock-out of workmen, epidemic,
          fire, explosion, storm, flood, drought, weather conditions,
          earthquake, natural disaster, accident, mechanical breakdown,
          third-party software, failure or problems with public utility supplies
          (including electrical, telecoms, or Internet failure), shortage of or
          inability to obtain supplies, materials, equipment, or transportation
          (“Event of Force Majeure”), regardless of whether the circumstances in
          question could have been foreseen.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default TermsConditions;
