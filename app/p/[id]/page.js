import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPaste, savePaste, deletePaste } from "@/app/lib/pasteStore";

function getNow() {
  if (process.env.TEST_MODE === "1") {
    const h = headers().get("x-test-now-ms");
    if (h) return Number(h);
  }
  return Date.now();
}

export default async function PastePage({ params }) {
  const paste = await getPaste(params.id);

  if (!paste) notFound();

  const now = getNow();

  // TTL check
  if (paste.expiresAt && now > paste.expiresAt) {
    await deletePaste(params.id);
    notFound();
  }

  // View limit check
  if (paste.max_views !== null) {
    if (paste.views >= paste.max_views) {
      await deletePaste(params.id);
      notFound();
    }
    paste.views += 1;
    await savePaste(params.id, paste);
  }

  return (
    <main style={{ padding: "24px", fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f4f4f4",
          padding: "16px",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
