import Link from "next/link";
import { TbAperture } from "react-icons/tb";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
      <TbAperture className="text-3xl text-primary" />
      <span>
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}