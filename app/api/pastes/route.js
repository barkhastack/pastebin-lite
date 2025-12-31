import { savePaste } from "@/app/lib/pasteStore";
import { randomUUID } from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return Response.json({ error: "content required" }, { status: 400 });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return Response.json({ error: "invalid ttl_seconds" }, { status: 400 });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return Response.json({ error: "invalid max_views" }, { status: 400 });
    }

    const id = randomUUID().slice(0, 10);
    const now = Date.now();

    const paste = {
      content,
      createdAt: now,
      expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
      max_views: max_views ?? null,
      views: 0,
    };

    await savePaste(id, paste);

    const origin = new URL(request.url).origin;

    return Response.json(
      { id, url: `${origin}/p/${id}` },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
