import { notFound } from "next/navigation";
import { getPaste, savePaste, deletePaste } from "@/app/lib/pasteStore";
import { headers } from "next/headers";

function now() {
  if (process.env.TEST_MODE === "1") {
    const h = headers().get("x-test-now-ms");
    if (h) return Number(h);
  }
  return Date.now();
}

export default async function PastePage({ params }) {
  const paste = await getPaste(params.id);
  if (!paste) notFound();

  const currentTime = now();

  // TTL check
  if (paste.expiresAt && currentTime > paste.expiresAt) {
    await deletePaste(params.id);
    notFound();
  }

  // View count check
  if (paste.max_views !== null) {
    if (paste.views >= paste.max_views) {
      await deletePaste(params.id);
      notFound();
    }
    paste.views += 1;
    await savePaste(params.id, paste);
  }

  return (
    <main style={{ padding: 24, fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f4f4f4",
          padding: 16,
          borderRadius: 6,
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
