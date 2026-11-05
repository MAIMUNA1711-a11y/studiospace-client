"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useWishlist } from "@/providers/WishlistProvider";

export default function WishlistButton({ studioId }: { studioId: string }) {
  const { has, toggle } = useWishlist();
  const saved = has(studioId);

  return (
    <button
      type="button"
      onClick={() => toggle(studioId)}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className="btn btn-circle btn-sm absolute bottom-3 right-3 border-0 bg-base-100/90"
    >
      {saved ? <FaHeart className="text-error" /> : <FaRegHeart />}
    </button>
  );
}