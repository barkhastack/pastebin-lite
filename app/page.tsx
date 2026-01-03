async function createPaste() {
  setError("");
  setUrl("");

  try {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setUrl(data.url);
  } catch (e) {
    setError("Network error");
  }
}
