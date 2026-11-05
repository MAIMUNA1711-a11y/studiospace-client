"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StudioImage from "@/components/ui/StudioImage";

const SLIDES = [
  {
    title: "Find the perfect space for your next shoot",
    text: "Photo studios with cyc walls, strobes and natural light, bookable by the hour.",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=80",
    tint: "from-orange-900/70",
  },
  {
    title: "Record, mix and release without limits",
    text: "Music suites and podcast rooms with treated acoustics and pro-grade gear.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1800&q=80",
    tint: "from-violet-900/70",
  },
  {
    title: "Turn your idle studio into income",
    text: "List your sound stage or workshop and let verified creators fill your calendar.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1800&q=80",
    tint: "from-teal-900/70",
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured highlights">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        style={
          {
            "--swiper-theme-color": "#ffffff",
            "--swiper-navigation-color": "#ffffff",
            "--swiper-navigation-size": "28px",
          } as React.CSSProperties
        }
        className="h-[70vh] min-h-[480px]"
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.title}>
            <div className="relative h-full w-full bg-neutral">
              <StudioImage
                src={s.image}
                alt={s.title}
                className="absolute inset-0 h-full w-full"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${s.tint} via-black/40 to-black/20`}
              />
              <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-14">
                <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
                  {s.title}
                </h1>
                <p className="mt-4 max-w-xl text-lg text-white/85">{s.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/studios" className="btn btn-primary">
                    Explore Studios
                  </Link>
                  <Link
                    href="/studios"
                    className="btn border-white/70 bg-transparent text-white hover:bg-white hover:text-black"
                  >
                    Host Your Space
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}