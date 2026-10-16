import curriculum from "./curriculum.json" with { type: "json" };
import type { Session } from "./api";
import type { Progress } from "./records";
export type Source = (typeof curriculum.exercises)[number];
const labels: Record<number, string> = {
  1: "기초 확인",
  2: "적용",
  3: "조건 변화·전이",
};
const byId = new Map(curriculum.exercises.map((ex) => [ex.id, ex]));
export function observations(sessions: Session[]) {
  return [...sessions]
    .sort(
      (a, b) =>
        a.local_day.localeCompare(b.local_day) ||
        (a.batch ?? 0) - (b.batch ?? 0) ||
        a.id.localeCompare(b.id),
    )
    .flatMap((s) =>
      s.items
        .filter((i) => i.status !== "pending" && byId.has(i.id))
        .map((item) => {
          const source = byId.get(item.id)!;
          const mode =
            item.response_mode ?? (item.kind === "choice" ? "choice" : "short");
          return {
            day: s.local_day,
            id: item.id,
            concept: source.concept_id,
            level: item.level ?? source.level,
            essay: mode === "essay",
            independent:
              item.status === "correct" &&
              item.hints_used === 0 &&
              item.attempts_count === 1 &&
              mode !== "essay",
          };
        }),
    );
}
export function conceptStates(sessions: Session[]) {
  const obs = observations(sessions);
  return curriculum.concepts.map((concept) => {
    const daily = new Map<string, (typeof obs)[number]>();
    for (const o of obs)
      if (o.concept === concept.id && !o.essay && !daily.has(o.day))
        daily.set(o.day, o);
    const rows = [...daily.values()],
      good = rows.filter((o) => o.independent),
      distinct = new Set(good.map((o) => o.id)).size,
      days = good.length;
    let level =
      distinct >= 3 && days >= 3 && good.filter((o) => o.level >= 2).length >= 2
        ? 3
        : distinct >= 2 && days >= 2
          ? 2
          : 1;
    if (rows.length >= 2 && rows.slice(-2).every((o) => !o.independent))
      level = Math.max(1, level - 1);
    return {
      ...concept,
      level,
      label: labels[level],
      independent_count: distinct,
      evidence_days: days,
      observed_count: rows.length,
      ready_for_probe: !!rows.length && rows.at(-1)!.independent && days >= 2,
      status:
        days < 2 || distinct < 2
          ? "관찰 중"
          : level === 2
            ? "적용 연습 중"
            : level === 3
              ? "전이 연습 중"
              : "기초 보완 중",
    };
  });
}
export function inTrack(ex: { domain?: string }, track: string) {
  return track === "sql"
    ? ex.domain === "SQL"
    : track === "python"
      ? ex.domain !== "SQL"
      : true;
}
export function selectExercises(
  sessions: Session[],
  progress: Record<string, Progress>,
  today: string,
  extra = false,
  track?: string,
): [Source, "new" | "review" | "practice"][] {
  const exercises = curriculum.exercises.filter(
      (ex) => ex.response_mode !== "essay" && (!track || inTrack(ex, track)),
    ),
    states = new Map(conceptStates(sessions).map((s) => [s.id, s])),
    doneToday = new Set(
      sessions
        .filter((s) => s.local_day === today)
        .flatMap((s) => s.items.map((i) => i.id)),
    );
  const eligible = (ex: Source) => {
    const s = states.get(ex.concept_id)!;
    const limit =
      s.level >= 2 || s.ready_for_probe ? 3 : s.independent_count > 0 ? 2 : 1;
    const min = Math.min(
      ...exercises
        .filter((x) => x.concept_id === ex.concept_id)
        .map((x) => x.level),
    );
    return (
      s.prerequisites.every((c) => states.get(c)!.independent_count > 0) &&
      ex.level <= Math.max(min, limit)
    );
  };
  const due = exercises
    .filter(
      (ex) =>
        progress[ex.id]?.due <= today && !doneToday.has(ex.id) && eligible(ex),
    )
    .sort(
      (a, b) =>
        progress[a.id].due.localeCompare(progress[b.id].due) ||
        exercises.indexOf(a) - exercises.indexOf(b),
    );
  const selected: [Source, "new" | "review" | "practice"][] = extra
    ? []
    : due.slice(0, 3).map((ex) => [ex, "review"]);
  const counts = new Map(curriculum.concepts.map((c) => [c.domain, 0]));
  for (const [ex] of selected)
    counts.set(ex.domain, (counts.get(ex.domain) ?? 0) + 1);
  const pool = exercises.filter(
    (ex) => !progress[ex.id] && !doneToday.has(ex.id) && eligible(ex),
  );
  while (pool.length && selected.length < 5) {
    pool.sort(
      (a, b) =>
        (counts.get(a.domain) ?? 0) - (counts.get(b.domain) ?? 0) ||
        a.level - b.level ||
        exercises.indexOf(a) - exercises.indexOf(b),
    );
    const ex = pool.shift()!;
    selected.push([ex, "new"]);
    counts.set(ex.domain, (counts.get(ex.domain) ?? 0) + 1);
    if (ex.level === 3)
      for (let i = pool.length - 1; i >= 0; i--)
        if (pool[i].level === 3) pool.splice(i, 1);
  }
  if (extra)
    for (const ex of due) {
      if (selected.length >= 5) break;
      if (!selected.some(([x]) => x.id === ex.id))
        selected.push([ex, "review"]);
    }
  return selected;
}
export function reviewDue(
  today: string,
  prior: Partial<Progress>,
  independent: boolean,
): { due: string; streak: number } {
  const streak = independent
      ? (prior.streak ?? 0) + Number(prior.last_day !== today)
      : 0,
    gap = !independent ? 1 : streak <= 1 ? 3 : streak === 2 ? 7 : 14;
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + gap);
  return {
    due:
      independent && prior.last_day === today && prior.due
        ? prior.due
        : date.toISOString().slice(0, 10),
    streak,
  };
}
