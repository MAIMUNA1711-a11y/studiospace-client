import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { API_URL } from "@/lib/api";

type Ctx = { params: Promise<{ path: string[] }> };

async function handler(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;

  if (path.some((p) => p === ".." || p === ".")) {
    return NextResponse.json(
      { success: false, message: "Invalid path" },
      { status: 400 },
    );
  }

  // Session cookie theke short-lived JWT toiri
  let token: string | undefined;
  try {
    const res = await auth.api.getToken({ headers: req.headers });
    token = res?.token;
  } catch {
    token = undefined;
  }

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  }

  const hasBody = !["GET", "HEAD"].includes(req.method);
  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/${path.join("/")}${req.nextUrl.search}`, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Cannot reach the API server" },
      { status: 502 },
    );
  }

  return new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};