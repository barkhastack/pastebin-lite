import { kv } from "@vercel/kv";

export async function savePaste(id, paste) {
  await kv.set(`paste:${id}`, paste);
}

export async function getPaste(id) {
  return await kv.get(`paste:${id}`);
}

export async function deletePaste(id) {
  await kv.del(`paste:${id}`);
}
