import { getPaste, savePaste, deletePaste } from "@/app/lib/pasteStore";
import { headers } from "next/headers";

function now() {
  if (process.env.TEST_MODE === "1") {
    const h = headers().get("x-test-now-ms");
    if (h) return Number(h);
  }
  return Date.now();
}

export async function GET(request, { params }) {
  const paste = await getPaste(params.id);
  if (!paste) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const currentTime = now();

  // TTL check
  if (paste.expiresAt && currentTime > paste.expiresAt) {
    await deletePaste(params.id);
    return Response.json({ error: "expired" }, { status: 404 });
  }

  // View count check
  if (paste.max_views !== null) {
    if (paste.views >= paste.max_views) {
      await deletePaste(params.id);
      return Response.json({ error: "view limit exceeded" }, { status: 404 });
    }
    paste.views += 1;
    await savePaste(params.id, paste);
  }

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null ? null : paste.max_views - paste.views,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}
