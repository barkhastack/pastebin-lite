import { randomUUID } from "crypto";
import { savePaste } from "@/app/lib/pasteStore";

export async function POST(request) {
  const body = await request.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = randomUUID();
  const now = Date.now();

  const paste = {
    content,
    max_views: max_views ?? null,
    views: 0,
    expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
  };

  await savePaste(id, paste);

  return Response.json(
    { id, url: `${request.nextUrl.origin}/p/${id}` },
    { status: 201 }
  );
}
