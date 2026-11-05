"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBars } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import Avatar from "@/components/ui/Avatar";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const MENU_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-studio", label: "Add New Studio" },
  { href: "/my-listings", label: "My Studio Listings" },
  { href: "/my-bookings", label: "My Bookings" },
];

function closeMenus() {
  (document.activeElement as HTMLElement | null)?.blur();
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    closeMenus();
    await authClient.signOut();
    toast.success("You have been logged out.");
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              aria-label="Open menu"
            >
              <FaBars className="text-lg" />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-10 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
            >
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={closeMenus}
                    className={isActive(l.href) ? "font-semibold text-primary" : ""}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Logo />
        </div>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(l.href)
                    ? "border-primary text-primary"
                    : "border-transparent"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isPending ? (
            <div className="skeleton h-10 w-10 rounded-full" />
          ) : user ? (
            <div className="dropdown dropdown-end dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                aria-label="Open user menu"
              >
                <Avatar name={user.name} image={user.image} />
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-10 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
              >
                <li className="pointer-events-none px-3 py-2">
                  <span className="block text-sm font-bold">{user.name}</span>
                  <span className="block truncate text-xs opacity-60">
                    {user.email}
                  </span>
                </li>
                <div className="divider my-0" />
                {MENU_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={closeMenus}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                <div className="divider my-0" />
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm sm:btn-md">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm sm:btn-md">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}