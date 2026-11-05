"use client";

import { useState } from "react";

export default function Avatar({
  name,
  image,
  className = "h-10 w-10",
}: {
  name?: string | null;
  image?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = (name?.trim()[0] ?? "?").toUpperCase();

  if (image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "User avatar"}
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer"
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-primary font-bold text-primary-content`}
    >
      {initial}
    </span>
  );
}