"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import StudioImage from "@/components/ui/StudioImage";

export default function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.message ?? "Image upload failed.");
      }
      onChange(json.data.url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste an image URL, or upload a file below"
        className="input input-bordered w-full"
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="file-input file-input-bordered w-full max-w-xs"
          aria-label="Upload cover image"
        />
        {uploading && <span className="loading loading-spinner" />}
      </div>
      {value && (
        <StudioImage
          src={value}
          alt="Cover preview"
          className="h-40 w-full max-w-sm rounded-box"
        />
      )}
    </div>
  );
}