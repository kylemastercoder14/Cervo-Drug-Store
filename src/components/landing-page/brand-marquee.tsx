/* eslint-disable @next/next/no-img-element */
import Marquee from "../magic-ui/marquee";

const reviews = [
  "/brands/1.png",
  "/brands/2.jpg",
  "/brands/3.png",
  "/brands/4.png",
  "/brands/5.png",
  "/brands/6.png",
  "/brands/7.png",
];

const ReviewCard = ({ img }: { img: string }) => {
  return (
    <div className="flex flex-row items-center mx-10">
      <img width="100" height="100" alt="Brands" src={img} />
    </div>
  );
};

export function BrandMarquee() {
  return (
    <div className="relative flex h-[100px] w-full flex-col items-center justify-center overflow-hidden bg-white">
      <Marquee pauseOnHover className="[--duration:20s]">
        {reviews.map((review, index) => (
          <ReviewCard key={index} img={review} />
        ))}
      </Marquee>
    </div>
  );
}
