"use client";

import { useSyncExternalStore } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

const STORAGE_KEY = "studiospace-theme";

function subscribe(callback: () => void) {
  window.addEventListener("themechange", callback);
  return () => window.removeEventListener("themechange", callback);
}
const getSnapshot = () =>
  document.documentElement.getAttribute("data-theme") ?? "studiolight";
const getServerSnapshot = () => "studiolight";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "studiodark";

  function toggle() {
    const next = isDark ? "studiolight" : "studiodark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked, theme still changes for this session */
    }
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <button
      onClick={toggle}
      className="btn btn-ghost btn-circle"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
    </button>
  );
}