import { ApiError } from "./errors.ts";
import type { Session } from "./api";

export type Progress = {
  due: string;
  completed: number;
  last_day?: string;
  streak?: number;
};
export type Submission = {
  session: string;
  exercise: string;
  answer: string;
  correct: boolean | null;
  response_mode?: string;
  created_at?: string;
  hints_used?: number;
  active_seconds?: number;
};
export type LearningEvent = {
  id: string;
  kind: string;
  session_id?: string;
  exercise_id?: string;
  occurred_at: string | null;
  inferred?: boolean;
  detail?: string;
};
export type Store = {
  version: 1;
  schema_version?: number;
  revision?: number;
  learner_id?: string;
  updated_at?: string;
  sessions: Session[];
  progress: Record<string, Progress>;
  attempts: Record<string, Submission>;
  catalog?: Record<string, unknown>;
  events?: LearningEvent[];
};
export const KEY = "learning-coding-daily:v1";
const BACKUP = `${KEY}:backup`;
const MARKER = `${KEY}:initialized`;
export let storageNotice = "";
export let storageCopies = 0;
let dbPromise: Promise<IDBDatabase> | undefined;

function database(): Promise<IDBDatabase> {
  if (!dbPromise)
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (!globalThis.indexedDB) {
        reject(Error("IndexedDB unavailable"));
        return;
      }
      const request = indexedDB.open("learning-coding-daily-records", 1);
      const timeout = setTimeout(
        () => reject(Error("IndexedDB blocked")),
        2500,
      );
      request.onupgradeneeded = () =>
        request.result.createObjectStore("snapshots");
      request.onerror = () => {
        clearTimeout(timeout);
        reject(request.error);
      };
      request.onsuccess = () => {
        clearTimeout(timeout);
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          dbPromise = undefined;
        };
        resolve(db);
      };
    }).catch((error) => {
      dbPromise = undefined;
      throw error;
    });
  return dbPromise;
}
function localGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const count = (v: unknown) => Number.isInteger(v) && (v as number) >= 0;
export function validateStore(input: unknown): Store {
  if (
    !object(input) ||
    input.version !== 1 ||
    (input.schema_version !== undefined &&
      (!count(input.schema_version) || (input.schema_version as number) > 2))
  )
    throw new ApiError(
      "지원하지 않는 기록 버전입니다. 원본을 보존했어요.",
      422,
    );
  if (
    !Array.isArray(input.sessions) ||
    !object(input.progress) ||
    !object(input.attempts)
  )
    throw new ApiError("학습 기록 구조를 확인할 수 없어요.", 422);
  const sessionIds = new Set<string>();
  for (const value of input.sessions) {
    if (
      !object(value) ||
      typeof value.id !== "string" ||
      ["__proto__", "constructor", "prototype"].includes(value.id) ||
      sessionIds.has(value.id) ||
      typeof value.track_id !== "string" ||
      typeof value.local_day !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value.local_day) ||
      !Array.isArray(value.items) ||
      !value.items.length ||
      !count(value.total) ||
      value.total !== value.items.length ||
      !count(value.completed_count) ||
      !count(value.correct_count)
    )
      throw new ApiError("학습 묶음이 손상되었어요. 원본을 보존했어요.", 422);
    sessionIds.add(value.id);
    const ids = new Set<string>();
    for (const item of value.items) {
      if (
        !object(item) ||
        typeof item.id !== "string" ||
        ["__proto__", "constructor", "prototype"].includes(item.id) ||
        ids.has(item.id) ||
        !["pending", "correct", "revealed"].includes(item.status as string) ||
        !count(item.hints_used) ||
        (item.hints_used as number) > 2 ||
        !count(item.attempts_count) ||
        !count(item.active_seconds) ||
        !Array.isArray(item.hints) ||
        !Array.isArray(item.choices) ||
        typeof item.title !== "string" ||
        typeof item.code !== "string" ||
        typeof item.prompt !== "string" ||
        (item.last_answer !== null && typeof item.last_answer !== "string")
      )
        throw new ApiError("문제 기록이 손상되었어요. 원본을 보존했어요.", 422);
      ids.add(item.id);
    }
    if (
      value.items.filter((i: Record<string, unknown>) => i.status !== "pending")
        .length !== value.completed_count ||
      value.items.filter((i: Record<string, unknown>) => i.status === "correct")
        .length !== value.correct_count
    )
      throw new ApiError("학습 합계가 문제 기록과 맞지 않아요.", 422);
  }
  for (const [key, value] of Object.entries(input.progress))
    if (
      ["__proto__", "constructor", "prototype"].includes(key) ||
      !object(value) ||
      typeof value.due !== "string" ||
      !count(value.completed)
    )
      throw new ApiError("진도 기록이 손상되었어요.", 422);
  for (const [id, value] of Object.entries(input.attempts))
    if (
      ["__proto__", "constructor", "prototype"].includes(id) ||
      !object(value) ||
      typeof value.session !== "string" ||
      typeof value.exercise !== "string" ||
      typeof value.answer !== "string" ||
      ![true, false, null].includes(value.correct as boolean | null)
    )
      throw new ApiError("제출 기록이 손상되었어요.", 422);
  if (
    input.events !== undefined &&
    (!Array.isArray(input.events) ||
      input.events.some(
        (e) =>
          !object(e) ||
          typeof e.id !== "string" ||
          typeof e.kind !== "string" ||
          (e.occurred_at !== null && typeof e.occurred_at !== "string"),
      ))
  )
    throw new ApiError("학습 로그가 손상되었어요.", 422);
  if (input.catalog !== undefined) {
    if (!object(input.catalog))
      throw new ApiError("문항 원본 보관함이 손상되었어요.", 422);
    for (const source of Object.values(input.catalog))
      if (
        !object(source) ||
        ![
          "id",
          "answer",
          "explanation",
          "prompt",
          "code",
          "title",
          "concept",
        ].every((k) => typeof source[k] === "string") ||
        !Array.isArray(source.hints) ||
        source.hints.length !== 2 ||
        !source.hints.every((h) => typeof h === "string") ||
        !Array.isArray(source.choices) ||
        !source.choices.every((c) => typeof c === "string") ||
        !Array.isArray(source.accepted) ||
        !source.accepted.every((c) => typeof c === "string")
      )
        throw new ApiError(
          "문항 원본이 손상되었어요. 기존 기록은 보존됩니다.",
          422,
        );
    for (const raw of input.sessions) {
      const s = raw as Session;
      for (const i of s.items) {
        const source = input.catalog[`${s.id}:${i.id}`];
        if (source && object(source) && source.id !== i.id)
          throw new ApiError("문항 원본 ID가 맞지 않아요.", 422);
      }
    }
  }
  if (input.revision !== undefined && !count(input.revision))
    throw new ApiError("기록 버전을 확인해 주세요.", 422);
  return input as Store;
}
export function migrateStore(data: Store): Store {
  data.schema_version = 2;
  data.revision ??= 0;
  data.learner_id ??= crypto.randomUUID();
  data.events ??= [];
  const ids = new Set(data.events.map((e) => e.id));
  for (const session of data.sessions) {
    session.batch ??= 0;
    for (const item of session.items)
      if (item.status !== "pending") {
        const id = `completed:${session.id}:${item.id}`;
        if (!ids.has(id)) {
          data.events.push({
            id,
            kind: "completed",
            session_id: session.id,
            exercise_id: item.id,
            occurred_at: null,
            inferred: true,
            detail: "이전 버전 기록에서 복원. 실제 완료 시각은 알 수 없음",
          });
          ids.add(id);
        }
      }
  }
  const totals = new Map<string, { count: number; day: string }>();
  for (const s of data.sessions)
    for (const i of s.items)
      if (i.status !== "pending") {
        const prior = totals.get(i.id);
        totals.set(i.id, {
          count: (prior?.count ?? 0) + 1,
          day: prior && prior.day > s.local_day ? prior.day : s.local_day,
        });
      }
  for (const [id, total] of totals) {
    if (!data.progress[id]) {
      const due = new Date(`${total.day}T12:00:00Z`);
      due.setUTCDate(due.getUTCDate() + 1);
      data.progress[id] = {
        completed: total.count,
        due: due.toISOString().slice(0, 10),
        last_day: total.day,
        streak: 0,
      };
    } else
      data.progress[id].completed = Math.max(
        data.progress[id].completed,
        total.count,
      );
  }
  return data;
}
export async function loadRecords(): Promise<Store> {
  storageNotice = "";
  storageCopies = 0;
  const primary = localGet(KEY),
    backup = localGet(BACKUP);
  // A future primary schema is not silently replaced by an older recovery copy.
  if (primary) {
    try {
      const value = JSON.parse(primary);
      if (value.schema_version > 2 || value.version > 1)
        throw new ApiError(
          "더 새로운 버전의 기록이에요. 앱을 새로고침해 주세요. 원본은 보존했어요.",
          422,
        );
    } catch (e) {
      if (e instanceof ApiError) throw e;
    }
  }
  let durable: (string | null)[] = [];
  try {
    const db = await database();
    durable = await new Promise((resolve, reject) => {
      const tx = db.transaction("snapshots", "readonly"),
        store = tx.objectStore("snapshots");
      const values: (string | null)[] = [];
      for (const key of ["current", "previous"]) {
        const req = store.get(key);
        req.onsuccess = () => values.push(req.result ?? null);
      }
      tx.oncomplete = () => resolve(values);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* Local copy remains usable. */
  }
  const candidates = [primary, backup, ...durable].filter(
    (v): v is string => v !== null,
  );
  const valid: { raw: string; data: Store }[] = [];
  for (const raw of candidates) {
    try {
      valid.push({ raw, data: validateStore(JSON.parse(raw)) });
    } catch {
      /* Preserve corrupt bytes; try a recovery copy. */
    }
  }
  if (!valid.length) {
    if (candidates.length || localGet(MARKER))
      throw new ApiError(
        "저장된 학습 기록을 읽지 못했어요. 기록을 초기화하지 않았습니다. 백업 파일을 가져오거나 저장 공간을 확인해 주세요.",
        500,
      );
    return migrateStore({
      version: 1,
      sessions: [],
      progress: {},
      attempts: {},
    });
  }
  valid.sort((a, b) => (b.data.revision ?? 0) - (a.data.revision ?? 0));
  const chosen = valid[0];
  storageCopies = (primary ? 1 : 0) + (durable[0] ? 1 : 0);
  if (chosen.raw !== primary)
    storageNotice =
      "보관된 저장본에서 학습 기록을 복구했어요. 백업 파일도 내려받아 주세요.";
  return migrateStore(structuredClone(chosen.data));
}
export async function saveRecords(data: Store): Promise<void> {
  validateStore(data);
  const previousRevision = data.revision ?? 0;
  data.revision = previousRevision + 1;
  data.updated_at = new Date().toISOString();
  const raw = JSON.stringify(data);
  let durable = false,
    local = false,
    stale = false;
  try {
    const db = await database();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("snapshots", "readwrite"),
        store = tx.objectStore("snapshots");
      const req = store.get("current");
      req.onsuccess = () => {
        const previous = req.result as string | undefined;
        if (previous) {
          try {
            if (
              (validateStore(JSON.parse(previous)).revision ?? 0) >
              previousRevision
            ) {
              stale = true;
              tx.abort();
              return;
            }
          } catch {
            /* Keep the raw previous copy. */
          }
          store.put(previous, "previous");
        }
        store.put(raw, "current");
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(Error("Record write aborted"));
    });
    durable = true;
  } catch {
    /* A verified local write can still persist the answer. */
  }
  if (stale)
    throw new ApiError(
      "다른 탭에서 기록이 바뀌었어요. 다시 불러온 뒤 시도해 주세요.",
      409,
    );
  try {
    const previous = localStorage.getItem(KEY);
    if (previous) {
      try {
        validateStore(JSON.parse(previous));
        localStorage.setItem(BACKUP, previous);
      } catch {
        localStorage.setItem(`${KEY}:unreadable`, previous);
      }
    }
    localStorage.setItem(KEY, raw);
    local = localStorage.getItem(KEY) === raw;
    if (local) localStorage.setItem(MARKER, data.learner_id!);
  } catch {
    /* IndexedDB is independent of a localStorage quota failure. */
  }
  if (!durable && !local)
    throw new ApiError(
      "기록을 저장하지 못했어요. 다음 문제로 넘어가지 않았습니다. 저장 공간을 확인해 주세요.",
      500,
    );
  storageCopies = Number(durable) + Number(local);
  if (storageCopies < 2)
    storageNotice =
      "한 저장소만 사용할 수 있어요. 기록 보호를 위해 백업 파일을 내려받아 주세요.";
}
export function addEvent(
  data: Store,
  kind: string,
  session_id?: string,
  exercise_id?: string,
  id: string = crypto.randomUUID(),
  detail?: string,
) {
  data.events ??= [];
  if (!data.events.some((e) => e.id === id))
    data.events.push({
      id,
      kind,
      session_id,
      exercise_id,
      occurred_at: new Date().toISOString(),
      detail,
    });
}
export type Backup = {
  format: "learning-coding-daily-backup";
  version: 1;
  exported_at: string;
  checksum: string;
  data: Store;
};
async function checksum(data: Store) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(data)),
  );
  return [...new Uint8Array(bytes)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
export async function createBackup(data: Store): Promise<Backup> {
  return {
    format: "learning-coding-daily-backup",
    version: 1,
    exported_at: new Date().toISOString(),
    checksum: await checksum(data),
    data,
  };
}
export async function parseBackup(text: string): Promise<Backup> {
  if (new TextEncoder().encode(text).length > 10 * 1024 * 1024)
    throw new ApiError("백업 파일은 10MB까지 가져올 수 있어요.", 422);
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    throw new ApiError(
      "JSON 백업 파일을 읽지 못했어요. 기존 기록은 유지됩니다.",
      422,
    );
  }
  if (
    !object(input) ||
    input.format !== "learning-coding-daily-backup" ||
    input.version !== 1 ||
    typeof input.checksum !== "string"
  )
    throw new ApiError("지원하는 매일코딩 백업 파일이 아니에요.", 422);
  const data = validateStore(input.data);
  if ((await checksum(data)) !== input.checksum)
    throw new ApiError(
      "백업 파일의 검증 값이 맞지 않아요. 기존 기록은 유지됩니다.",
      422,
    );
  return input as Backup;
}
export function mergeRecords(current: Store, incoming: Store): Store {
  validateStore(incoming);
  const merged = migrateStore(structuredClone(current));
  const sessions = new Map(merged.sessions.map((s) => [s.id, s]));
  for (const source of incoming.sessions) {
    const existing = sessions.get(source.id);
    if (!existing) {
      const copy = structuredClone(source);
      const occupied = merged.sessions
        .filter(
          (s) => s.local_day === copy.local_day && s.track_id === copy.track_id,
        )
        .map((s) => s.batch ?? 0);
      if (occupied.includes(copy.batch ?? 0))
        copy.batch = Math.max(...occupied) + 1;
      merged.sessions.push(copy);
      sessions.set(copy.id, copy);
      continue;
    }
    if (
      existing.local_day !== source.local_day ||
      existing.track_id !== source.track_id ||
      existing.items.map((i) => i.id).join() !==
        source.items.map((i) => i.id).join()
    )
      throw new ApiError(
        "같은 묶음 ID의 내용이 달라 가져오지 않았어요. 기존 기록은 유지됩니다.",
        422,
      );
    for (let index = 0; index < source.items.length; index++) {
      const before = existing.items[index],
        after = source.items[index];
      if (
        before.status !== "pending" &&
        after.status !== "pending" &&
        (before.last_answer !== after.last_answer ||
          before.status !== after.status)
      )
        throw new ApiError(
          "같은 문제의 완료 답안이 달라 가져오지 않았어요. 두 파일을 보관해 주세요.",
          422,
        );
      if (
        before.status === "pending" &&
        after.status === "pending" &&
        before.draft &&
        after.draft &&
        before.draft !== after.draft
      )
        throw new ApiError(
          "작성 중인 답안이 서로 달라 가져오지 않았어요. 두 파일을 보관해 주세요.",
          422,
        );
      const chosen =
        before.status === "pending" &&
        (after.status !== "pending" ||
          after.attempts_count > before.attempts_count)
          ? after
          : before;
      existing.items[index] = {
        ...structuredClone(chosen),
        attempts_count: Math.max(before.attempts_count, after.attempts_count),
        hints_used: Math.max(before.hints_used, after.hints_used),
        hints: structuredClone(
          before.hints.length >= after.hints.length
            ? before.hints
            : after.hints,
        ),
        active_seconds: Math.max(before.active_seconds, after.active_seconds),
        draft:
          chosen.status === "pending" ? before.draft || after.draft || "" : "",
      };
    }
    existing.completed_count = existing.items.filter(
      (i) => i.status !== "pending",
    ).length;
    existing.correct_count = existing.items.filter(
      (i) => i.status === "correct",
    ).length;
    existing.finished = existing.completed_count === existing.total;
  }
  for (const [id, attempt] of Object.entries(incoming.attempts)) {
    if (
      merged.attempts[id] &&
      JSON.stringify(merged.attempts[id]) !== JSON.stringify(attempt)
    )
      throw new ApiError("같은 제출 ID의 답안이 달라 가져오지 않았어요.", 422);
    merged.attempts[id] ??= structuredClone(attempt);
  }
  const submissionCounts = new Map<string, number>();
  for (const a of Object.values(merged.attempts)) {
    const key = `${a.session}:${a.exercise}`;
    submissionCounts.set(key, (submissionCounts.get(key) ?? 0) + 1);
  }
  for (const session of merged.sessions)
    for (const item of session.items)
      item.attempts_count = Math.max(
        item.attempts_count,
        submissionCounts.get(`${session.id}:${item.id}`) ?? 0,
      );
  for (const [id, p] of Object.entries(incoming.progress))
    if (!merged.progress[id] || p.completed > merged.progress[id].completed)
      merged.progress[id] = structuredClone(p);
  const counts = new Map<string, number>();
  for (const s of merged.sessions)
    for (const item of s.items)
      if (item.status !== "pending")
        counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
  for (const [id, total] of counts)
    if (merged.progress[id])
      merged.progress[id].completed = Math.max(
        total,
        merged.progress[id].completed,
      );
  merged.catalog ??= {};
  for (const [key, value] of Object.entries(incoming.catalog ?? {}))
    merged.catalog[key] ??= structuredClone(value);
  const events = new Map(
    [...(merged.events ?? []), ...(incoming.events ?? [])].map((e) => [
      e.id,
      e,
    ]),
  );
  merged.events = [...events.values()];
  if (!current.sessions.length && incoming.learner_id)
    merged.learner_id = incoming.learner_id;
  return migrateStore(merged);
}
