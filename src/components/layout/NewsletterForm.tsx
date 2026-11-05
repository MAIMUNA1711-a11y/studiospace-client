"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're subscribed to StudioSpace updates!");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="input input-bordered w-full min-w-0"
        aria-label="Newsletter email"
      />
      <button type="submit" className="btn btn-primary">
        Join
      </button>
    </form>
  );
}