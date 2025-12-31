export async function POST(request) {
  const body = await request.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return Response.json({ error: "content is required" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return Response.json({ error: "ttl_seconds must be >= 1" }, { status: 400 });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return Response.json({ error: "max_views must be >= 1" }, { status: 400 });
  }

  const id = crypto.randomUUID().slice(0, 10);
  const now = Date.now();

  const paste = {
    content,
    createdAt: now,
    expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views: 0,
  };

  await savePaste(id, paste);

  // ✅ IMPORTANT FIX — derive base URL from request
  const origin = new URL(request.url).origin;

  return Response.json(
    {
      id,
      url: `${origin}/p/${id}`,
    },
    { status: 201 }
  );
}
