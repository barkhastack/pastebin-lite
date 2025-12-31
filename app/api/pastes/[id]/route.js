import { getPaste, savePaste, deletePaste } from "@/app/lib/pasteStore";

function getNow(request) {
  if (process.env.TEST_MODE === "1") {
    const h = request.headers.get("x-test-now-ms");
    if (h) return Number(h);
  }
  return Date.now();
}

export async function GET(request, { params }) {
  const paste = await getPaste(params.id);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(request);

  // TTL check
  if (paste.expiresAt && now > paste.expiresAt) {
    await deletePaste(params.id);
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // View limit check
  if (paste.max_views !== null) {
    if (paste.views >= paste.max_views) {
      await deletePaste(params.id);
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    paste.views += 1;
    await savePaste(params.id, paste);
  }

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - paste.views, 0),
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}
