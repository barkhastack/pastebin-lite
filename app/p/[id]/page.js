import { getPaste, savePaste, deletePaste } from "@/app/lib/pasteStore";
import { notFound } from "next/navigation";

function now(headers) {
  if (process.env.TEST_MODE === "1") {
    const h = headers.get("x-test-now-ms");
    if (h) return Number(h);
  }
  return Date.now();
}

export default async function PastePage({ params, headers }) {
  const paste = await getPaste(params.id);

  if (!paste) notFound();

  const currentTime = now(headers);

  if (paste.expiresAt && currentTime > paste.expiresAt) {
    await deletePaste(params.id);
    notFound();
  }

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
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {paste.content}
      </pre>
    </main>
  );
}
