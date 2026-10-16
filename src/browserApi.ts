import curriculum from "./curriculum.json";
import { ApiError } from "./errors";
import type { Dashboard, Exercise, Session, ResponseMode } from "./api";

type Source = Omit<
  (typeof curriculum.exercises)[number],
  "choices" | "accepted"
> & { choices: string[]; accepted: string[] };
import {
  KEY,
  loadRecords,
  saveRecords,
  addEvent,
  mergeRecords,
  validateStore,
  migrateStore,
  storageNotice,
  storageCopies,
  type Store,
} from "./records";
import { selectExercises, conceptStates, reviewDue } from "./recommendation";
const TIMEZONE = "Asia/Seoul";
const sources = new Map<string, Source>(
  curriculum.exercises.map((ex) => [ex.id, ex]),
);

function day() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return ["year", "month", "day"]
    .map((key) => parts.find((part) => part.type === key)!.value)
    .join("-");
}
function shift(date: string, days: number) {
  const result = new Date(`${date}T12:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}
let readOnlyNotice = "";
async function read(): Promise<Store> {
  readOnlyNotice = "";
  const data = await loadRecords();
  let dirty = !data.catalog;
  data.catalog ??= {};
  for (const session of data.sessions) {
    session.batch ??= 0;
    session.items = session.items.map((item) => {
      const key = `${session.id}:${item.id}`;
      const source =
        (data.catalog?.[key] as Source | undefined) ?? sources.get(item.id);
      if (!source) return item;
      if (!data.catalog![key]) {
        data.catalog![key] = source;
        dirty = true;
      }
      if (!item.concept_id) dirty = true;
      // Preserve the first saved content snapshot, including pending legacy cards.
      return {
        ...item,
        concept_id: item.concept_id ?? source.concept_id,
        difficulty: item.difficulty ?? source.difficulty,
        domain: item.domain ?? source.domain,
        level: item.level ?? source.level,
        response_mode:
          item.response_mode ?? (item.kind === "choice" ? "choice" : "short"),
      };
    });
  }
  if (dirty || !data.updated_at) {
    try {
      await saveRecords(data);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 500) throw error;
      // A readable legacy snapshot must remain exportable even when migration cannot be written.
      readOnlyNotice =
        "기존 기록은 읽었지만 새 기록을 저장할 공간이 부족해요. 백업 파일을 먼저 내려받아 주세요.";
    }
  }
  return data;
}
function refresh(session: Session) {
  session.completed_count = session.items.filter(
    (item) => item.status !== "pending",
  ).length;
  session.correct_count = session.items.filter(
    (item) => item.status === "correct",
  ).length;
  session.finished = session.completed_count === session.total;
  return session;
}
function makeItem(
  source: Source,
  category: Exercise["category"],
  mode: ResponseMode = source.response_mode as ResponseMode,
): Exercise {
  return {
    concept_id: source.concept_id,
    difficulty: source.difficulty,
    response_mode: mode,
    id: source.id,
    version: source.version,
    concept: source.concept,
    domain: source.domain,
    level: source.level,
    kind: source.kind as Exercise["kind"],
    title: source.title,
    prompt: source.prompt,
    code: source.code,
    choices: source.choices,
    estimated_seconds: source.seconds,
    category,
    status: "pending",
    hints: [],
    hints_used: 0,
    attempts_count: 0,
    last_answer: null,
    last_correct: null,
    active_seconds: 0,
  };
}
function complete(
  data: Store,
  session: Session,
  item: Exercise,
  status: "correct" | "revealed" | "incorrect",
  assisted: boolean,
) {
  const source =
    (data.catalog?.[`${session.id}:${item.id}`] as Source | undefined) ??
    sources.get(item.id)!;
  Object.assign(item, {
    status,
    answer: source.answer,
    explanation: source.explanation,
  });
  const prior = data.progress[item.id] ?? {};
  data.progress[item.id] = {
    ...reviewDue(
      day(),
      prior,
      !assisted && status === "correct" && item.response_mode !== "essay",
    ),
    last_day: day(),
    completed: (data.progress[item.id]?.completed ?? 0) + 1,
  };
  item.completed_at = new Date().toISOString();
  item.draft = "";
  addEvent(
    data,
    "completed",
    session.id,
    item.id,
    `completed:${session.id}:${item.id}`,
    status,
  );
  refresh(session);
}

function normalizeAnswer(value: string): string {
  let result = "",
    quote: string | null = null,
    escaped = false,
    spacing = false;
  const word = (char: string) => /[\p{L}\p{N}_]/u.test(char);
  for (const char of value.trim()) {
    if (spacing && !quote) {
      if (result && word(result.at(-1)!) && word(char)) result += " ";
      spacing = false;
    }
    if (escaped) {
      result += char;
      escaped = false;
    } else if (quote) {
      if (char === "\\") {
        result += char;
        escaped = true;
      } else if (char === quote) {
        result += '"';
        quote = null;
      } else result += char;
    } else if (char === "'" || char === '"') {
      quote = char;
      result += '"';
    } else if (/\s/u.test(char)) spacing = true;
    else result += char;
  }
  if (quote || escaped) return "<unclosed string>" + value;
  if (/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/.test(result))
    return String(Number(result));
  return result;
}

async function handle(path: string, payload?: unknown): Promise<unknown> {
  const url = new URL(path, "https://local.invalid");
  path = url.pathname;
  const track = url.searchParams.get("track_id") ?? "python";
  const body = (payload ?? {}) as Record<string, unknown>;
  let data: Store;
  try {
    data = await read();
  } catch (e) {
    if (
      path !== "/restore" ||
      body.recover_unreadable !== true ||
      (e instanceof Error && e.message.includes("더 새로운"))
    )
      throw e;
    validateStore(body.data);
    data = migrateStore({
      version: 1,
      sessions: [],
      progress: {},
      attempts: {},
    });
  }
  const today = day();
  if (path === "/tracks") return curriculum.tracks;
  if (path === "/backup") return data;
  if (path === "/restore") {
    const incoming = validateStore(body.data);
    if (
      data.sessions.length &&
      incoming.learner_id !== data.learner_id &&
      body.confirm_owner !== true
    )
      throw new ApiError(
        "다른 학습 ID의 기록입니다. 본인의 백업인지 확인해 주세요.",
        422,
      );
    const merged = mergeRecords(data, incoming);
    addEvent(
      merged,
      "imported",
      undefined,
      undefined,
      undefined,
      "검증된 파일 백업 병합",
    );
    await saveRecords(merged);
    return { restored: true };
  }
  if (path === "/history")
    return {
      sessions: [...data.sessions].sort(
        (a, b) =>
          b.local_day.localeCompare(a.local_day) ||
          (b.batch ?? 0) - (a.batch ?? 0),
      ),
      events: [...(data.events ?? [])].reverse(),
    };
  if (path === "/dashboard") {
    const legacy = data.sessions
      .filter((s) => s.track_id === "pandas" && s.local_day === today)
      .sort((a, b) => (b.batch ?? 0) - (a.batch ?? 0));
    const dashboard: Dashboard = {
      track_id: track,
      available_count: selectExercises(
        data.sessions,
        data.progress,
        today,
        true,
        track,
      ).length,
      legacy_session:
        legacy.find((s) =>
          s.items.some(
            (i) => i.status === "pending" && i.response_mode !== "essay",
          ),
        ) ??
        legacy.at(-1) ??
        null,
      local_day: today,
      timezone: TIMEZONE,
      learner_id: data.learner_id,
      storage_notice: readOnlyNotice || storageNotice,
      storage_copies: storageCopies,
      all_time_completed_count: Math.max(
        data.sessions.reduce((sum, s) => sum + s.completed_count, 0),
        Object.values(data.progress).reduce((sum, p) => sum + p.completed, 0),
      ),
      concepts: conceptStates(data.sessions),
      storage_mode: "device",
      learned_count: Object.keys(data.progress).length,
      weekly_days: [
        ...new Set(
          data.sessions
            .filter(
              (s) =>
                s.completed_count > 0 &&
                s.local_day >= shift(today, -6) &&
                s.local_day <= today,
            )
            .map((s) => s.local_day),
        ),
      ].sort(),
      today_sessions: data.sessions
        .filter((s) => s.local_day === today)
        .sort((a, b) => (a.batch ?? 0) - (b.batch ?? 0)),
      extra:
        data.sessions
          .filter(
            (s) =>
              s.local_day === today &&
              s.track_id === track &&
              (s.batch ?? 0) > 0,
          )
          .sort((a, b) => b.batch! - a.batch!)[0] ?? null,
      today_completed_count: data.sessions
        .filter((s) => s.local_day === today)
        .reduce((total, s) => total + s.completed_count, 0),
      today:
        data.sessions.find(
          (s) => s.track_id === track && s.local_day === today && !s.batch,
        ) ?? null,
    };
    return dashboard;
  }
  const requestedMode = body.response_mode;
  const validMode = (mode: unknown): mode is ResponseMode =>
    ["choice", "short", "essay"].includes(mode as string);
  if (
    (path === "/sessions/today" || path === "/sessions/extra") &&
    requestedMode !== undefined &&
    requestedMode !== null &&
    !validMode(requestedMode)
  )
    throw new ApiError("풀이 모드를 확인해 주세요.", 422);
  if (requestedMode === "essay")
    throw new ApiError(
      "서술형은 안정화할 때까지 보류 중이에요. 새로고침 후 학습을 시작해 주세요.",
      422,
    );
  const mode = requestedMode as ResponseMode | undefined;
  const course = body.track_id === "pandas" ? "python" : body.track_id;
  if (path === "/sessions/today") {
    if (!["python", "sql"].includes(course as string))
      throw new ApiError("아직 준비 중인 트랙입니다.", 409);
    const existing = data.sessions.find(
      (s) => s.track_id === course && s.local_day === today && !s.batch,
    );
    if (existing) return existing;
    const selected = selectExercises(
      data.sessions,
      data.progress,
      today,
      false,
      course as string,
    ).map(([ex, category]) => makeItem(ex, category, mode));
    if (!selected.length)
      throw new ApiError(
        "오늘 추천할 새 문제와 예정된 복습을 모두 풀었어요. 다른 트랙을 연습하거나 다음 복습 때 만나요.",
        422,
      );
    const session: Session = {
      id: crypto.randomUUID(),
      track_id: course as string,
      local_day: today,
      timezone: TIMEZONE,
      batch: 0,
      items: selected,
      completed_count: 0,
      correct_count: 0,
      total: selected.length,
      finished: false,
    };
    data.sessions.push(session);
    data.catalog ??= {};
    for (const card of selected)
      data.catalog[`${session.id}:${card.id}`] = sources.get(card.id)!;
    addEvent(data, "session_started", session.id);
    await saveRecords(data);
    return session;
  }
  if (path === "/sessions/extra") {
    if (!["python", "sql"].includes(course as string))
      throw new ApiError("아직 준비 중인 트랙입니다.", 409);
    const daily = data.sessions.find(
      (s) => s.track_id === course && s.local_day === today && !s.batch,
    );
    if (!daily?.finished)
      throw new ApiError(
        "오늘의 기본 학습을 마친 뒤 추가로 풀 수 있어요.",
        409,
      );
    const latest = data.sessions
      .filter((s) => s.track_id === course && s.local_day === today)
      .sort((a, b) => (b.batch ?? 0) - (a.batch ?? 0))[0];
    if (latest.batch && !latest.finished) return latest;
    const selected = selectExercises(
      data.sessions,
      data.progress,
      today,
      true,
      course as string,
    ).map(([ex, category]) => makeItem(ex, category, mode));
    if (!selected.length)
      throw new ApiError(
        "오늘 추천할 새 문제와 예정된 복습을 모두 풀었어요. 다른 트랙을 연습하거나 다음 복습 때 만나요.",
        422,
      );
    const session: Session = {
      id: crypto.randomUUID(),
      track_id: course as string,
      local_day: today,
      timezone: TIMEZONE,
      batch: (latest.batch ?? 0) + 1,
      items: selected,
      completed_count: 0,
      correct_count: 0,
      total: selected.length,
      finished: false,
    };
    data.sessions.push(session);
    data.catalog ??= {};
    for (const card of selected)
      data.catalog[`${session.id}:${card.id}`] = sources.get(card.id)!;
    addEvent(data, "session_started", session.id);
    await saveRecords(data);
    return session;
  }
  const route = path.match(
    /^\/sessions\/([^/]+)(?:\/(answers|hint|reveal|mode|draft))?$/,
  );
  if (!route) throw new ApiError("학습 요청을 찾을 수 없어요.", 404);
  const session = data.sessions.find((s) => s.id === route[1]);
  if (!session) throw new ApiError("학습 세션을 찾을 수 없어요.", 404);
  if (!route[2]) return session;
  if (session.local_day !== today)
    throw new ApiError("날짜가 바뀌었어요. 오늘 학습을 다시 열어 주세요.", 409);
  const item = session.items.find((ex) => ex.id === body.exercise_id);
  if (!item) throw new ApiError("오늘 학습에 포함되지 않은 문제입니다.", 404);
  const source =
    (data.catalog?.[`${session.id}:${item.id}`] as Source | undefined) ??
    sources.get(item.id);
  if (!source)
    throw new ApiError(
      "원본 문제를 찾지 못했어요. 기존 기록을 보존했으니 백업을 먼저 내려받아 주세요.",
      409,
    );
  if (route[2] === "answers" && typeof body.attempt_id === "string") {
    const previous = data.attempts[body.attempt_id];
    if (previous) {
      if (
        previous.session !== session.id ||
        previous.exercise !== item.id ||
        previous.answer !== body.answer
      )
        throw new ApiError(
          "같은 제출 ID를 다른 답안에 사용할 수 없습니다.",
          409,
        );
      return {
        correct: previous.correct,
        session,
      };
    }
  }
  if (route[2] === "reveal" && item.status === "revealed") return session;
  if (item.status !== "pending")
    throw new ApiError("이미 마친 문제입니다. 학습을 새로 불러와 주세요.", 409);
  if (route[2] === "draft") {
    if (typeof body.draft !== "string" || body.draft.length > 2000)
      throw new ApiError("입력한 답안을 확인해 주세요.", 422);
    item.draft = body.draft;
    await saveRecords(data);
    return session;
  }
  if (route[2] === "mode") {
    if (!validMode(body.response_mode) || body.response_mode === "essay")
      throw new ApiError("풀이 모드를 확인해 주세요.", 422);
    for (const pending of session.items)
      if (pending.status === "pending")
        pending.response_mode = body.response_mode;
    await saveRecords(data);
    return session;
  }
  if (item.response_mode === "essay")
    throw new ApiError(
      "서술형은 보류 중이에요. 작성한 답안은 학습 기록에 보관됩니다.",
      422,
    );
  if (route[2] === "hint") {
    item.hints_used = Math.min(item.hints_used + 1, 2);
    item.hints = source.hints.slice(0, item.hints_used);
    addEvent(
      data,
      "hint",
      session.id,
      item.id,
      `hint:${session.id}:${item.id}:${item.hints_used}`,
    );
    await saveRecords(data);
    return session;
  }
  if (route[2] === "reveal") {
    complete(data, session, item, "revealed", true);
    addEvent(
      data,
      "reveal",
      session.id,
      item.id,
      `reveal:${session.id}:${item.id}`,
    );
    await saveRecords(data);
    return session;
  }
  if (
    typeof body.answer !== "string" ||
    !body.answer.trim() ||
    body.answer.length > 200 ||
    typeof body.attempt_id !== "string"
  )
    throw new ApiError("문제에 맞는 답안을 입력해 주세요.", 422);
  if (item.response_mode === "choice" && !source.choices.includes(body.answer))
    throw new ApiError("보기에서 답을 골라 주세요.", 422);
  if (item.response_mode === "choice" && item.attempts_count >= 2) {
    complete(data, session, item, "incorrect", true);
    await saveRecords(data);
    return { correct: false, session };
  }
  const proposed = body.answer.trim();
  const correct =
    source.domain === "SQL" && source.kind === "blank"
      ? proposed.toUpperCase() === source.answer.toUpperCase()
      : [source.answer, ...source.accepted].some(
          (value) => normalizeAnswer(value) === normalizeAnswer(proposed),
        );
  const assisted = item.hints_used > 0 || item.attempts_count > 0;
  item.attempts_count++;
  item.last_answer = body.answer;
  item.last_correct = correct;
  if (typeof body.active_seconds === "number")
    item.active_seconds = Math.max(
      item.active_seconds,
      Math.min(86400, Math.max(0, Math.floor(body.active_seconds))),
    );
  data.attempts[body.attempt_id] = {
    session: session.id,
    exercise: item.id,
    answer: body.answer,
    correct: correct,
    response_mode: item.response_mode,
    created_at: new Date().toISOString(),
    hints_used: item.hints_used,
    active_seconds: item.active_seconds,
  };
  addEvent(
    data,
    "attempt",
    session.id,
    item.id,
    body.attempt_id,
    correct ? "정답" : "오답",
  );
  if (correct) complete(data, session, item, "correct", assisted);
  else if (item.response_mode === "choice" && item.attempts_count >= 2)
    complete(data, session, item, "incorrect", true);
  await saveRecords(data);
  return { correct: correct, session };
}

let queue: Promise<unknown> = Promise.resolve();
export async function browserApi<T>(path: string, body?: unknown): Promise<T> {
  // HTTPS browsers serialize updates from different tabs using Web Locks.
  const work = async () => structuredClone(await handle(path, body)) as T;
  if (navigator.locks) return navigator.locks.request(KEY, work);
  const result = queue.then(work, work);
  queue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}
