"use client";

import { useState } from "react";
import { FaCamera } from "react-icons/fa6";

export default function StudioImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 ${className}`}
        role="img"
        aria-label={alt}
      >
        <FaCamera className="text-4xl opacity-40" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      referrerPolicy="no-referrer"
      className={`object-cover ${className}`}
    />
  );
}