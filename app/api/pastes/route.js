import { nanoid } from "nanoid";
import { savePaste } from "@/app/lib/pasteStore";

export async function POST(request) {
  const body = await request.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return Response.json({ error: "content is required" }, { status: 400 });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return Response.json(
      { error: "ttl_seconds must be integer >= 1" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return Response.json(
      { error: "max_views must be integer >= 1" },
      { status: 400 }
    );
  }

  const id = nanoid(10);
  const now = Date.now();

  const paste = {
    content,
    createdAt: now,
    expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views: 0,
  };

  await savePaste(id, paste);

  return Response.json(
    {
      id,
      url: `https://${process.env.VERCEL_URL}/p/${id}`,
    },
    { status: 201 }
  );
}
