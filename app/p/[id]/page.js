import { notFound } from "next/navigation";
import { getPaste, deletePaste } from "@/app/lib/pasteStore";
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

  if (paste.expiresAt && now() > paste.expiresAt) {
    await deletePaste(params.id);
    notFound();
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
