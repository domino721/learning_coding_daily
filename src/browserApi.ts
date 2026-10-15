import curriculum from "./curriculum.json";
import { ApiError } from "./errors";
import type { Dashboard, Exercise, Session } from "./api";

type Source = Omit<
  (typeof curriculum.exercises)[number],
  "choices" | "accepted"
> & { choices: string[]; accepted: string[] };
type Progress = { due: string; completed: number };
type Submission = {
  session: string;
  exercise: string;
  answer: string;
  correct: boolean;
};
type Store = {
  version: 1;
  sessions: Session[];
  progress: Record<string, Progress>;
  attempts: Record<string, Submission>;
};
const KEY = "learning-coding-daily:v1";
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
function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null)
      return { version: 1, sessions: [], progress: {}, attempts: {} };
    const data = JSON.parse(raw);
    if (
      data.version !== 1 ||
      !Array.isArray(data.sessions) ||
      !data.progress ||
      !data.attempts
    )
      throw Error();
    // Preserve completed records; refresh only pending cards from the current curriculum.
    for (const session of data.sessions as Session[]) {
      session.batch ??= 0;
      session.items = session.items.map((item) => {
        const source = sources.get(item.id);
        if (!source) return item;
        if (item.status !== "pending")
          return {
            ...item,
            domain: item.domain ?? source.domain,
            level: item.level ?? source.level,
          };
        const updated = makeItem(source, item.category);
        return {
          ...updated,
          hints_used: item.hints_used,
          hints: source.hints.slice(0, item.hints_used),
          attempts_count: item.attempts_count,
          last_answer: item.last_answer,
          last_correct: item.last_correct,
          active_seconds: item.active_seconds,
        };
      });
    }
    return data;
  } catch {
    throw new ApiError(
      "저장된 학습 기록을 읽지 못했어요. 브라우저 데이터는 지우지 않았습니다. 저장 공간과 브라우저 설정을 확인해 주세요.",
      500,
    );
  }
}
function save(data: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    throw new ApiError(
      "기록을 저장하지 못했어요. 브라우저 저장 공간을 확인해 주세요. 기존 기록은 유지됩니다.",
      500,
    );
  }
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
function makeItem(source: Source, category: Exercise["category"]): Exercise {
  return {
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
  status: "correct" | "revealed",
  assisted: boolean,
) {
  const source = sources.get(item.id)!;
  Object.assign(item, {
    status,
    answer: source.answer,
    explanation: source.explanation,
  });
  data.progress[item.id] = {
    due: shift(day(), assisted || status === "revealed" ? 1 : 3),
    completed: (data.progress[item.id]?.completed ?? 0) + 1,
  };
  refresh(session);
}

function handle(path: string, payload?: unknown): unknown {
  const data = read();
  const today = day();
  const body = (payload ?? {}) as Record<string, unknown>;
  if (path === "/tracks") return curriculum.tracks;
  if (path === "/dashboard") {
    const dashboard: Dashboard = {
      local_day: today,
      timezone: TIMEZONE,
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
        .filter((s) => s.local_day === today && s.track_id === "pandas")
        .sort((a, b) => (a.batch ?? 0) - (b.batch ?? 0)),
      extra:
        data.sessions
          .filter(
            (s) =>
              s.local_day === today &&
              s.track_id === "pandas" &&
              (s.batch ?? 0) > 0,
          )
          .sort((a, b) => b.batch! - a.batch!)[0] ?? null,
      today_completed_count: data.sessions
        .filter((s) => s.local_day === today)
        .reduce((total, s) => total + s.completed_count, 0),
      today:
        data.sessions.find(
          (s) => s.track_id === "pandas" && s.local_day === today && !s.batch,
        ) ?? null,
    };
    return dashboard;
  }
  if (path === "/sessions/today") {
    if (body.track_id !== "pandas")
      throw new ApiError("아직 준비 중인 트랙입니다.", 409);
    const existing = data.sessions.find(
      (s) => s.track_id === "pandas" && s.local_day === today && !s.batch,
    );
    if (existing) return existing;
    const due = curriculum.exercises
      .filter((ex) => data.progress[ex.id]?.due <= today)
      .sort((a, b) =>
        data.progress[a.id].due.localeCompare(data.progress[b.id].due),
      )
      .slice(0, 3);
    const selected = due.map((ex) => makeItem(ex, "review"));
    const unseen = curriculum.exercises.filter((ex) => !data.progress[ex.id]);
    selected.push(
      ...unseen.slice(0, 5 - selected.length).map((ex) => makeItem(ex, "new")),
    );
    if (selected.length < 5) {
      const ids = new Set(selected.map((ex) => ex.id));
      const practice = curriculum.exercises
        .filter((ex) => !ids.has(ex.id))
        .sort((a, b) =>
          (data.progress[a.id]?.due ?? today).localeCompare(
            data.progress[b.id]?.due ?? today,
          ),
        );
      selected.push(
        ...practice
          .slice(0, 5 - selected.length)
          .map((ex) => makeItem(ex, "practice")),
      );
    }
    const session: Session = {
      id: crypto.randomUUID(),
      track_id: "pandas",
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
    save(data);
    return session;
  }
  if (path === "/sessions/extra") {
    if (body.track_id !== "pandas")
      throw new ApiError("아직 준비 중인 트랙입니다.", 409);
    const daily = data.sessions.find(
      (s) => s.track_id === "pandas" && s.local_day === today && !s.batch,
    );
    if (!daily?.finished)
      throw new ApiError(
        "오늘의 기본 학습을 마친 뒤 추가로 풀 수 있어요.",
        409,
      );
    const latest = data.sessions
      .filter((s) => s.track_id === "pandas" && s.local_day === today)
      .sort((a, b) => (b.batch ?? 0) - (a.batch ?? 0))[0];
    if (latest.batch && !latest.finished) return latest;
    const selected = curriculum.exercises
      .filter((ex) => !data.progress[ex.id])
      .slice(0, 5)
      .map((ex) => makeItem(ex, "new"));
    const ids = new Set(selected.map((ex) => ex.id));
    const lastSeen = new Map<string, number>();
    const history = [...data.sessions].sort(
      (a, b) =>
        a.local_day.localeCompare(b.local_day) ||
        (a.batch ?? 0) - (b.batch ?? 0),
    );
    let sequence = 0;
    for (const session of history)
      for (const item of session.items)
        if (item.status !== "pending") lastSeen.set(item.id, sequence++);
    const practice = curriculum.exercises
      .filter((ex) => !ids.has(ex.id))
      .sort((a, b) => (lastSeen.get(a.id) ?? -1) - (lastSeen.get(b.id) ?? -1));
    selected.push(
      ...practice
        .slice(0, 5 - selected.length)
        .map((ex) => makeItem(ex, "practice")),
    );
    const session: Session = {
      id: crypto.randomUUID(),
      track_id: "pandas",
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
    save(data);
    return session;
  }
  const route = path.match(/^\/sessions\/([^/]+)(?:\/(answers|hint|reveal))?$/);
  if (!route) throw new ApiError("학습 요청을 찾을 수 없어요.", 404);
  const session = data.sessions.find((s) => s.id === route[1]);
  if (!session) throw new ApiError("학습 세션을 찾을 수 없어요.", 404);
  if (!route[2]) return session;
  if (session.local_day !== today)
    throw new ApiError("날짜가 바뀌었어요. 오늘 학습을 다시 열어 주세요.", 409);
  const item = session.items.find((ex) => ex.id === body.exercise_id);
  if (!item) throw new ApiError("오늘 학습에 포함되지 않은 문제입니다.", 404);
  const source = sources.get(item.id)!;
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
      return { correct: previous.correct, session };
    }
  }
  if (route[2] === "reveal" && item.status === "revealed") return session;
  if (item.status !== "pending")
    throw new ApiError("이미 마친 문제입니다. 학습을 새로 불러와 주세요.", 409);
  if (route[2] === "hint") {
    item.hints_used = Math.min(item.hints_used + 1, 2);
    item.hints = source.hints.slice(0, item.hints_used);
    save(data);
    return session;
  }
  if (route[2] === "reveal") {
    complete(data, session, item, "revealed", true);
    save(data);
    return session;
  }
  if (
    typeof body.answer !== "string" ||
    !body.answer.trim() ||
    body.answer.length > 200 ||
    typeof body.attempt_id !== "string"
  )
    throw new ApiError("문제에 맞는 답안을 입력해 주세요.", 422);
  if (item.kind === "choice" && !source.choices.includes(body.answer))
    throw new ApiError("보기에서 답을 골라 주세요.", 422);
  const proposed = body.answer.trim();
  const correct =
    source.domain === "SQL" && source.kind === "blank"
      ? proposed.toUpperCase() === source.answer.toUpperCase()
      : [source.answer, ...source.accepted].includes(proposed);
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
    correct,
  };
  if (correct) complete(data, session, item, "correct", assisted);
  save(data);
  return { correct, session };
}

export async function browserApi<T>(path: string, body?: unknown): Promise<T> {
  // HTTPS browsers serialize updates from different tabs using Web Locks.
  const work = () => structuredClone(handle(path, body)) as T;
  if (navigator.locks) return navigator.locks.request(KEY, work);
  return work();
}
