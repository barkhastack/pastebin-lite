"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function createPaste() {
    setError("");
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setUrl(data.url);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Pastebin Lite</h1>

      <textarea
        rows={8}
        style={{ width: "100%" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={createPaste}>Create Paste</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {url && <p>Share: <a href={url}>{url}</a></p>}
    </main>
  );
}
