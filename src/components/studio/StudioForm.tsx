"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ui/ImageUploader";
import { STUDIO_CATEGORIES, type Studio } from "@/types";

export interface StudioPayload {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  overview: string;
}

const PRESETS = [
  "Wi-Fi",
  "Air conditioning",
  "Parking",
  "Green room",
  "Changing room",
  "Kitchenette",
  "Cyc wall",
  "Studio lighting",
  "Backdrops",
  "Soundproofing",
  "Microphones",
  "Mixing console",
  "Monitor speakers",
  "Projector",
  "Restroom",
  "Wheelchair access",
];

const isHttpUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function StudioForm({
  initial,
  hostName,
  hostEmail,
  submitLabel,
  onSubmit,
}: {
  initial?: Studio;
  hostName: string;
  hostEmail: string;
  submitLabel: string;
  onSubmit: (payload: StudioPayload) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [hourlyRate, setHourlyRate] = useState(initial ? String(initial.hourlyRate) : "");
  const [deposit, setDeposit] = useState(initial ? String(initial.securityDeposit) : "");
  const [capacity, setCapacity] = useState(initial ? String(initial.maxCapacity) : "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [gallery, setGallery] = useState((initial?.gallery ?? []).join("\n"));
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [custom, setCustom] = useState("");
  const [overview, setOverview] = useState(initial?.overview ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const options = [...PRESETS, ...amenities.filter((a) => !PRESETS.includes(a))];

  function toggleAmenity(a: string) {
    setAmenities((list) =>
      list.includes(a) ? list.filter((x) => x !== a) : [...list, a],
    );
  }

  function addCustom() {
    const value = custom.trim();
    if (!value) return;
    if (value.length > 50) {
      toast.error("An amenity can be at most 50 characters.");
      return;
    }
    if (amenities.length >= 30) {
      toast.error("You can add at most 30 amenities.");
      return;
    }
    setAmenities((list) => (list.includes(value) ? list : [...list, value]));
    setCustom("");
  }

  function validate(): StudioPayload | string {
    const rate = Number(hourlyRate);
    const dep = Number(deposit);
    const cap = Number(capacity);
    const extra = gallery
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (title.trim().length < 3) return "Title must be at least 3 characters.";
    if (!category) return "Please choose a category.";
    if (!(rate > 0)) return "Hourly rate must be greater than 0.";
    if (!(dep >= 0) || deposit === "") return "Security deposit cannot be negative.";
    if (!Number.isInteger(cap) || cap < 1) return "Max capacity must be a whole number of at least 1.";
    if (location.trim().length < 3) return "Location must be at least 3 characters.";
    if (!isHttpUrl(imageUrl.trim())) return "Please add a valid cover image URL or upload a file.";
    if (extra.length > 8) return "You can add at most 8 gallery images.";
    if (extra.some((u) => !isHttpUrl(u))) return "Every gallery line must be a valid http(s) URL.";
    if (overview.trim().length < 20) return "Overview must be at least 20 characters.";

    return {
      title: title.trim(),
      category,
      hourlyRate: rate,
      securityDeposit: dep,
      maxCapacity: cap,
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      gallery: extra,
      amenities,
      overview: overview.trim(),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = validate();
    if (typeof result === "string") {
      setError(result);
      toast.error(result);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-box border border-base-300 bg-base-100 p-6"
    >
      {error && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Studio title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="e.g. Northlight Cyclorama Studio"
            className="input input-bordered w-full"
          />
        </Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Select a category</option>
            {STUDIO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Hourly rate ($)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="input input-bordered w-full"
          />
        </Field>
        <Field label="Security deposit ($)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="input input-bordered w-full"
          />
        </Field>
        <Field label="Max capacity (people)">
          <input
            type="number"
            min={1}
            step={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="input input-bordered w-full"
          />
        </Field>
        <Field label="Location / address">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={200}
            placeholder="Street, area, city"
            className="input input-bordered w-full"
          />
        </Field>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Cover image</span>
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      <Field label="More gallery image URLs (optional, one per line, up to 8)">
        <textarea
          value={gallery}
          onChange={(e) => setGallery(e.target.value)}
          rows={3}
          placeholder="https://example.com/photo-2.jpg"
          className="textarea textarea-bordered w-full"
        />
      </Field>

      <div>
        <span className="mb-2 block text-sm font-medium">Amenities</span>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="checkbox checkbox-primary checkbox-sm"
              />
              {a}
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="Add your own amenity"
            className="input input-bordered w-full max-w-xs"
          />
          <button type="button" onClick={addCustom} className="btn btn-outline">
            Add
          </button>
        </div>
      </div>

      <Field label="Detailed overview">
        <textarea
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
          rows={6}
          maxLength={5000}
          placeholder="Describe the space, the equipment, house rules and what makes it great for creators."
          className="textarea textarea-bordered w-full"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Host name">
          <input value={hostName} readOnly className="input input-bordered w-full opacity-70" />
        </Field>
        <Field label="Host email">
          <input value={hostEmail} readOnly className="input input-bordered w-full opacity-70" />
        </Field>
      </div>

      <button type="submit" disabled={submitting} className="btn btn-primary w-full sm:w-auto">
        {submitting ? <span className="loading loading-spinner" /> : submitLabel}
      </button>
    </form>
  );
}