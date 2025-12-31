import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPaste, savePaste, deletePaste } from "@/app/lib/pasteStore";

export default async function PastePage({ params }) {
  const paste = await getPaste(params.id);
  if (!paste) notFound();

  return (
    <main>
      <pre>{paste.content}</pre>
    </main>
  );
}
