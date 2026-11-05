import { FaCamera, FaFilm, FaMicrophone, FaMusic, FaPalette } from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { StudioCategory } from "@/types";

export const SITE_NAME = "StudioSpace";

export const CATEGORY_META: Record<
  StudioCategory,
  { icon: IconType; blurb: string }
> = {
  "Photo Studio": { icon: FaCamera, blurb: "Cyc walls, strobes and seamless backdrops" },
  "Sound Stage": { icon: FaFilm, blurb: "Large floors for film and video production" },
  "Podcast Room": { icon: FaMicrophone, blurb: "Treated rooms with broadcast-ready mics" },
  "Music Suite": { icon: FaMusic, blurb: "Recording suites, live rooms and mixing desks" },
  "Art Workshop": { icon: FaPalette, blurb: "Bright, flexible space for makers and artists" },
};