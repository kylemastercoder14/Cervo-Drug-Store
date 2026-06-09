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
import LaboratoryServicesSection from "@/components/landing-page/laboratory";

const Home = () => {
  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Navbar />
      <ImageSlider />
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
      <LaboratoryServicesSection />
      <Footer />
    </div>
  );
};

export default Home;
