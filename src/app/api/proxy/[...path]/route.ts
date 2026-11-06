import { NextRequest, NextResponse } from "next/server";
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

  const incomingCookie = req.headers.get("cookie");
  const incomingAuth = req.headers.get("authorization");

  const headersToSend: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (incomingAuth) {
    headersToSend["Authorization"] = incomingAuth;
  }

  if (incomingCookie) {
    headersToSend["Cookie"] = incomingCookie;
  }

  const hasBody = !["GET", "HEAD"].includes(req.method);
  let upstream: Response;

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