import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024;

const fail = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return fail("Authentication required", 401);

  const key = process.env.IMGBB_API_KEY;
  if (!key) return fail("Image upload is not configured on the server.", 503);

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("image");
    if (f instanceof File) file = f;
  } catch {
    /* handled below */
  }
  if (!file) return fail("No image file was provided.", 400);
  if (!file.type.startsWith("image/")) return fail("Only image files are allowed.", 400);
  if (file.size > MAX_BYTES) return fail("Image must be 5 MB or smaller.", 413);

  const body = new FormData();
  body.append("image", file);

  let res: Response;
  try {
    res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`,
      { method: "POST", body },
    );
  } catch {
    return fail("Could not reach the image host.", 502);
  }

  const json = await res.json().catch(() => null);
  const url: string | undefined = json?.data?.display_url ?? json?.data?.url;
  if (!res.ok || !url) return fail("Image upload failed. Please try again.", 502);

  return NextResponse.json({ success: true, data: { url } });
}