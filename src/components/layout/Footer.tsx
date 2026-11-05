import Link from "next/link";
import { FaGithub, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { STUDIO_CATEGORIES } from "@/types";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const SOCIALS = [
  { href: "https://x.com", label: "X", Icon: FaXTwitter },
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
  { href: "https://youtube.com", label: "YouTube", Icon: FaYoutube },
  { href: "https://github.com", label: "GitHub", Icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm opacity-70">
            StudioSpace connects creators with hosts who share photo studios,
            sound stages, podcast rooms, music suites and art workshops, so
            great work never waits for a place to happen.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="btn btn-circle btn-ghost btn-sm text-lg"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="opacity-70 hover:text-primary hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Popular Categories</h3>
          <ul className="space-y-2 text-sm">
            {STUDIO_CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/studios?category=${encodeURIComponent(c)}`}
                  className="opacity-70 hover:text-primary hover:opacity-100"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold">Newsletter</h3>
          <p className="text-sm opacity-70">
            Get new studio listings and creator tips in your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-base-300 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} StudioSpace. All rights reserved. By using
        this site you agree to our Terms of Service and Privacy Policy.
      </div>
    </footer>
  );
}