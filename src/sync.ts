import { browserApi } from "./browserApi";
import type { Store } from "./records";

const KEY = "learning-coding-daily:sync-connection";
export type Connection = {
  url: string;
  token: string;
  user_id: string;
  expires_at: number;
};
export let syncStatus = "계정을 연결하지 않았어요.";
export function connection(): Connection | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    return typeof c.url === "string" && typeof c.token === "string" ? c : null;
  } catch {
    return null;
  }
}
export function remember(c: Connection | null) {
  if (c) sessionStorage.setItem(KEY, JSON.stringify(c));
  else sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event("learning-sync-status"));
}
export function serverURL(value: string) {
  const u = new URL(value);
  if (u.username || u.password || u.search || u.hash)
    throw Error("서버 주소를 확인해 주세요.");
  if (
    u.protocol !== "https:" &&
    !(
      u.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname)
    )
  )
    throw Error("공개 서버는 HTTPS 주소를 사용해야 합니다.");
  return u.origin + u.pathname.replace(/\/$/, "");
}
export async function requestServer(
  url: string,
  path: string,
  body: unknown,
  token?: string,
) {
  const res = await fetch(`${serverURL(url)}/api${path}`, {
    method: "POST",
    signal: AbortSignal.timeout(20000),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok)
    throw Error(
      typeof data.detail === "string"
        ? data.detail
        : "서버 요청을 처리하지 못했어요.",
    );
  return data;
}
let running: Promise<void> | null = null;
export async function synchronize() {
  if (running) return running;
  const c = connection();
  if (!c) return;
  running = (async () => {
    // Pull/merge/persist under the browser API lock. A concurrent local answer
    // is merged against the current local store when restore finally acquires it.
    const local = await browserApi<Store>("/backup");
    const merged = await requestServer(
      c.url,
      "/sync",
      { data: local, confirm_owner: true },
      c.token,
    );
    await browserApi("/restore", { data: merged, confirm_owner: true });
    syncStatus = `서버와 동기화됨 · ${new Date().toLocaleTimeString("ko-KR")}`;
  })()
    .catch((e) => {
      syncStatus = `기기 기록은 유지됩니다. 동기화 대기: ${e.message}`;
      throw e;
    })
    .finally(() => {
      running = null;
      window.dispatchEvent(new Event("learning-sync-status"));
    });
  return running;
}
