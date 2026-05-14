import BlogsCarousel from "@/components/landing-page/blogs-carousel";
import { BrandMarquee } from "@/components/landing-page/brand-marquee";
import CategoriesCarousel from "@/components/landing-page/categories-carousel";
import FeaturedProducts from "@/components/landing-page/featured-products";
import Footer from "@/components/landing-page/footer";
import ImageSlider from "@/components/landing-page/image-slider";
import Navbar from "@/components/landing-page/navbar";
import PromotionContent from "@/components/landing-page/promotion-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Navbar />
      <div className="w-full px-3 py-5 h-full lg:px-20">
        <ImageSlider />
      </div>
      <section className="lg:px-20 px-3 py-5">
        <div className="bg-[#EEEEEE] rounded-lg py-2 px-3 shadow-md border">
          <p className="text-lg font-semibold text-black">Categories</p>
        </div>
        <CategoriesCarousel />
      </section>
      <section className="lg:px-20 px-3 py-5">
        <div className="bg-[#EEEEEE] rounded-lg py-2 px-3 shadow-md border">
          <p className="text-lg font-semibold text-black">
            Explore Our Special Offers
          </p>
        </div>
        <PromotionContent />
      </section>
      <section className="lg:px-20 px-3 bg-[#f5f5f5] py-10">
        <div className="bg-white rounded-lg py-2 px-3 shadow-md border">
          <p className="text-lg font-semibold text-black">Featured Products</p>
        </div>
        <FeaturedProducts />
      </section>
      <section className="bg-white">
        <div className="lg:px-20 px-3 py-5">
          <BrandMarquee />
        </div>
      </section>
      <section id="blogs" className="bg-[#f5f5f5] pb-20">
        <div className="lg:px-20 px-3 py-5 mt-10">
          <div className="grid xl:grid-cols-3 grid-cols-1 gap-5 xl:gap-0">
            <div className="col-span-1 flex items-start">
              <div className="h-20 w-2 bg-[#437634]" />
              <div className="flex flex-col ml-3">
                <p className="font-semibold text-sm text-muted-foreground">
                  READ OUR
                </p>
                <p className="text-4xl font-bold">BLOGS</p>
              </div>
            </div>
            <div className="col-span-2">
              <BlogsCarousel />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-green-800 px-20 relative bg-cover bg-center xl:h-[60vh] h-[80vh]">
        <div className="bg-green-800/80 w-full h-full absolute inset-0" />
        <div className="flex xl:flex-row flex-col items-center xl:gap-20 gap-10 mt-16 px-10">
          <div className="flex flex-col space-y-2 relative">
            <iframe
              src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100063781221493%2Fvideos%2F901886898263575%2F&show_text=false&width=336&t=0"
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              className="rounded-2xl h-[350px] xl:w-[600px] w-[400px]"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
          <div className="flex flex-col z-10">
            <p className="text-4xl font-extrabold text-white">
              Visit Our <br />
              Official Facebook Page
            </p>
            <Link
              href="https://www.facebook.com/profile.php?id=100063781221493"
              target="_blank"
            >
              <Button className="rounded-xl bg-transparent border mt-5 py-6 text-lg border-white hover:bg-white hover:text-black">
                Click Here
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Laboratory Services */}
      <section className="bg-[#f5f5f5]">
        <div className="lg:px-20 px-3 py-14">
          <div className="bg-white shadow-lg border px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#437634] uppercase">
                  Laboratory Services
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  List of Available Laboratory Tests
                </h2>
                <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
                  Our in-house diagnostic laboratory offers a comprehensive range of tests to support
                  accurate and timely clinical decisions.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f3eb] px-4 py-2 text-xs md:text-sm text-[#256029] border border-[#c7e2cf]">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Accredited Clinical Laboratory
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 text-sm text-slate-800 leading-relaxed">
              {/* Column 1 */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base md:text-lg text-slate-900 border-l-4 border-[#437634] pl-3 mb-2">
                    Clinical Chemistry
                  </h3>
                  <ul className="list-disc ml-6 space-y-1.5">
                    <li>Fasting Blood Sugar (FBS)</li>
                    <li>Random Blood Sugar (RBS)</li>
                    <li>
                      Oral Glucose Tolerance Test (2<sup>nd</sup>/3<sup>rd</sup> hr.)
                    </li>
                    <li>2hr Post Prandial Blood Sugar (PPBS)</li>
                    <li>HbA1c</li>
                    <li>
                      Lipid Profile
                      <ul className="list-disc ml-5 space-y-1">
                        <li>Total Cholesterol</li>
                        <li>Triglyceride</li>
                        <li>HDL, LDL, VLDL</li>
                      </ul>
                    </li>
                    <li>Blood Uric Acid (BUA)</li>
                    <li>Blood Urea Nitrogen (BUN)</li>
                    <li>Creatinine</li>
                    <li>ALT / SGPT</li>
                    <li>AST / SGOT</li>
                    <li>Total Protein</li>
                    <li>Albumin</li>
                    <li>TPAG Ratio</li>
                    <li>Total Bilirubin</li>
                    <li>Direct / Indirect Bilirubin</li>
                    <li>Alkaline Phosphatase (ALP)</li>
                    <li>Total Iron Binding Capacity (TIBC)</li>
                    <li>
                      Electrolytes
                      <ul className="list-disc ml-6 space-y-1.5">
                        <li>Sodium (Na)</li>
                        <li>Potassium (K)</li>
                        <li>Chloride (Cl)</li>
                        <li>Ionized Calcium (iCa)</li>
                        <li>Magnesium (Mg)</li>
                        <li>Inorganic Phosphorus</li>
                      </ul>
                    </li>
                    <li>Urine Creatinine</li>
                    <li>Urine Total Protein</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-base md:text-lg text-slate-900 border-l-4 border-[#437634] pl-3 mb-2">
                    Hematology
                  </h3>
                  <ul className="list-disc ml-6 space-y-1.5">
                    <li>Complete Blood Count w/ Platelet Count (CBCPC)</li>
                    <li>Blood Typing w/ Rh</li>
                    <li>Erythrocyte Sedimentation Rate (ESR)</li>
                    <li>Clotting / Bleeding Time</li>
                    <li>Peripheral Blood Smear</li>
                    <li>Reticulocyte Count</li>
                  </ul>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base md:text-lg text-slate-900 border-l-4 border-[#437634] pl-3 mb-2">
                    Clinical Microscopy
                  </h3>
                  <ul className="list-disc ml-6 space-y-1.5">
                    <li>Urinalysis</li>
                    <li>Fecalysis</li>
                    <li>Fecal Occult Blood Test (FOBT)</li>
                    <li>Pregnancy Test Urine / Serum</li>
                    <li>Microalbumin</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-base md:text-lg text-slate-900 border-l-4 border-[#437634] pl-3 mb-2">
                    Serology / Immunology
                  </h3>
                  <ul className="list-disc ml-6 space-y-1.5">
                    <li>Hepatitis B surface Antigen (HBsAg) Screening</li>
                    <li>Syphilis (RPR) Test</li>
                    <li>HIV Screening</li>
                    <li>T3, T4, FT3, FT4, TSH</li>
                    <li>Dengue NS1</li>
                    <li>Dengue IgG IgM</li>
                    <li>Prostate Specific Antigen (PSA)</li>
                    <li>Carcinoembryonic Antigen (CEA)</li>
                    <li>Alpha Fetoprotein (AFP)</li>
                    <li>CA-125 (Ovarian CA)</li>
                    <li>CA 15-3 (Breast CA)</li>
                    <li>C-Reactive Protein (CRP)</li>
                    <li>Rheumatoid Factor (RF)</li>
                    <li>Anti Streptolysin O (ASO)</li>
                    <li>H. pylori Antibody</li>
                    <li>H. pylori Antigen</li>
                    <li>HS-Troponin I</li>
                    <li>D-Dimer</li>
                    <li>NTpro BNP</li>
                    <li>Vitamin D</li>
                    <li>Ferritin</li>
                    <li>Beta-HCG</li>
                    <li>CK-MB</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-base md:text-lg text-slate-900 border-l-4 border-[#437634] pl-3 mb-2">
                    Microbiology &amp; Histopathology
                  </h3>
                  <ul className="list-disc ml-6 space-y-1.5">
                    <li>Gram Stain</li>
                    <li>KOH</li>
                    <li>FNAB (Staining)</li>
                    <li>Pap Smear (Staining)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
