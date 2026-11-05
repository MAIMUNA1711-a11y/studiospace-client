"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StudioImage from "@/components/ui/StudioImage";

export default function StudioGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const list = images.length > 0 ? images : [""];

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation={list.length > 1}
      pagination={{ clickable: true }}
      loop={list.length > 1}
      style={
        {
          "--swiper-theme-color": "#ffffff",
          "--swiper-navigation-color": "#ffffff",
          "--swiper-navigation-size": "26px",
        } as React.CSSProperties
      }
      className="h-72 w-full overflow-hidden rounded-box sm:h-[26rem]"
    >
      {list.map((src, i) => (
        <SwiperSlide key={`${src}-${i}`}>
          <StudioImage
            src={src}
            alt={`${title}, photo ${i + 1}`}
            className="h-full w-full"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}