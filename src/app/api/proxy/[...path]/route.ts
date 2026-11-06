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

  // 1. Session cookie theke JWT Token ber korar chesta
  let token: string | undefined;
  try {
    const res = await auth.api.getToken({ headers: req.headers });
    token = res?.token;
  } catch {
    token = undefined;
  }

  // Request Headers toiri kora
  const headersToSend: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 2. Token thakle Bearer header set kora
  if (token) {
    headersToSend["Authorization"] = `Bearer ${token}`;
  }

  // 3. Fallback: Raw Session Cookie extract kore backward compatibility render-e pathano
  const incomingCookie = req.headers.get("cookie");
  if (incomingCookie) {
    headersToSend["Cookie"] = incomingCookie;
  }

  // Token ebong Cookie konoti-i na thakle 401
  if (!token && !incomingCookie) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  }

  const hasBody = !["GET", "HEAD"].includes(req.method);
  let upstream: Response;

  // Path sanitize to prevent double slashes (//)
  const cleanPath = path.join("/");
  const targetUrl = `${API_URL}/${cleanPath}${req.nextUrl.search}`;

  try {
    upstream = await fetch(targetUrl, {
      method: req.method,
      headers: headersToSend,
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