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
type PathSpec = {
  concept_id: string;
  level: number;
  role: string;
  family: string;
  requires: string[];
};
const policy = curriculum.learning_paths;
const paths = policy.items as Record<string, PathSpec>;
export function observations(sessions: Session[]) {
  const seen = new Set<string>();
  return [...sessions]
    .sort(
      (a, b) =>
        a.local_day.localeCompare(b.local_day) ||
        (a.batch ?? 0) - (b.batch ?? 0) ||
        a.id.localeCompare(b.id),
    )
    .flatMap((s) =>
      s.items
        .filter((i) => {
          const source = byId.get(i.id);
          if (
            i.status === "pending" ||
            !source ||
            (i.version ?? source.version) !== source.version
          )
            return false;
          const key = `${s.id}:${i.id}:${source.version}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
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
            family: paths[source.id].family,
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
      if (
        o.concept === concept.id &&
        !o.essay &&
        (!daily.has(o.day) || (!daily.get(o.day)!.independent && o.independent))
      )
        daily.set(o.day, o);
    const rows = [...daily.values()],
      good = rows.filter((o) => o.independent);
    const allRows = obs.filter((o) => o.concept === concept.id && !o.essay),
      allGood = allRows.filter((o) => o.independent),
      distinct = new Set(allGood.map((o) => o.id)).size,
      days = new Set(allGood.map((o) => o.day)).size,
      families = new Set(allGood.map((o) => o.family)).size,
      first = new Map<string, string>();
    let retained = false;
    for (const o of allGood) {
      if (!first.has(o.id)) first.set(o.id, o.day);
      if (o.day > first.get(o.id)!) retained = true;
    }
    let support = -1;
    allRows.forEach((o, index) => {
      if (!o.independent) support = index;
    });
    const needsSupport =
        support >= 0 &&
        new Set(
          allRows
            .slice(support + 1)
            .filter((o) => o.independent)
            .map((o) => o.id),
        ).size < policy.rules.recovery_items,
      rules = policy.rules;
    const level =
      distinct >= rules.level3_items &&
      days >= rules.level3_days &&
      new Set(allGood.filter((o) => o.level >= 2).map((o) => o.day)).size >=
        rules.level3_transfer_days &&
      families >= 3 &&
      retained &&
      !needsSupport
        ? 3
        : distinct >= rules.level2_items &&
            days >= rules.level2_days &&
            families >= 2
          ? 2
          : 1;
    return {
      ...concept,
      level,
      label: labels[level],
      independent_count: distinct,
      evidence_days: days,
      observed_count: rows.length,
      family_count: families,
      retention_observed: retained,
      needs_support: needsSupport,
      evidence_status: allRows.length ? "observed" : "unassessed",
      ready_for_probe: !!rows.length && rows.at(-1)!.independent && days >= 2,
      status: needsSupport
        ? "기초 보완 중"
        : !allRows.length
          ? "진단 전"
          : days < 2 || distinct < 2
            ? "관찰 중"
            : level === 2
              ? "적용 연습 중"
              : level === 3
                ? "전이 연습 중"
                : "기초 확인 중",
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
  sessions = sessions.filter((s) => s.local_day <= today);
  const exercises = curriculum.exercises.filter(
      (ex) => ex.response_mode !== "essay" && (!track || inTrack(ex, track)),
    ),
    states = new Map(conceptStates(sessions).map((s) => [s.id, s])),
    doneToday = new Set(
      sessions
        .filter((s) => s.local_day === today)
        .flatMap((s) => s.items.map((i) => i.id)),
    );
  const obs = observations(sessions),
    latest = new Map(obs.filter((o) => !o.essay).map((o) => [o.id, o])),
    obsToday = new Set(
      obs.filter((o) => o.day === today && o.independent).map((o) => o.concept),
    ),
    solvedFamilies = new Map<string, Set<string>>();
  for (const o of obs)
    if (o.independent) {
      if (!solvedFamilies.has(o.concept))
        solvedFamilies.set(o.concept, new Set());
      solvedFamilies.get(o.concept)!.add(o.family);
    }
  const known = (id: string) => {
    if (latest.get(id)?.independent) return true;
    const state = states.get(paths[id].concept_id)!;
    return state.level >= 2 && !state.needs_support;
  };
  const eligible = (ex: Source) => {
    const s = states.get(ex.concept_id)!;
    const limit = s.needs_support
      ? 1
      : s.level >= 2
        ? 3
        : s.independent_count > 0
          ? 2
          : 1;
    return (
      s.prerequisites.every((c) => states.get(c)!.independent_count > 0) &&
      ex.level <= limit &&
      paths[ex.id].requires.every(known)
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
  const counts = new Map(curriculum.concepts.map((c) => [c.domain, 0])),
    conceptPicks = new Map(
      curriculum.concepts.map((c) => [c.id, obsToday.has(c.id) ? 1 : 0]),
    );
  for (const [ex] of selected) {
    counts.set(ex.domain, (counts.get(ex.domain) ?? 0) + 1);
    conceptPicks.set(ex.concept_id, (conceptPicks.get(ex.concept_id) ?? 0) + 1);
  }
  const pool = exercises.filter(
      (ex) => !progress[ex.id] && !doneToday.has(ex.id) && eligible(ex),
    ),
    requiredL1 = new Set(
      exercises
        .filter((ex) => !progress[ex.id])
        .flatMap((ex) => paths[ex.id].requires.filter((req) => !known(req))),
    ),
    progressedConcepts = new Set(
      Object.keys(progress)
        .map((pid) => byId.get(pid)?.concept_id)
        .filter((cid): cid is string => !!cid),
    );
  const rank = (ex: Source): number[] => {
    const st = states.get(ex.concept_id)!,
      fam = paths[ex.id].family,
      newFam = solvedFamilies.get(ex.concept_id)?.has(fam) ? 1 : 0,
      dom = counts.get(ex.domain) ?? 0,
      pick = conceptPicks.get(ex.concept_id) ?? 0,
      idx = exercises.indexOf(ex);
    if (st.needs_support) return [0, dom, 0, 0, ex.level, 0, newFam, idx];
    if (!progressedConcepts.has(ex.concept_id))
      return [1, dom, 0, pick, 1, ex.level - 1, 0, idx];
    const redundantL1 =
        ex.level === 1 && st.independent_count > 0 && !requiredL1.has(ex.id)
          ? 1
          : 0,
      target = st.independent_count === 0 ? 1 : st.level === 1 ? 2 : 3,
      probeReady =
        st.independent_count > 0 &&
        st.level === 1 &&
        ex.level === 2 &&
        newFam === 0
          ? 0
          : 1;
    return [
      1,
      dom,
      redundantL1,
      pick,
      probeReady,
      Math.abs(target - ex.level),
      newFam,
      idx,
    ];
  };
  while (pool.length && selected.length < 5) {
    pool.sort((a, b) => {
      const ra = rank(a),
        rb = rank(b);
      for (let i = 0; i < ra.length; i++)
        if (ra[i] !== rb[i]) return ra[i] - rb[i];
      return 0;
    });
    const ex = pool.shift()!;
    selected.push([ex, "new"]);
    counts.set(ex.domain, (counts.get(ex.domain) ?? 0) + 1);
    conceptPicks.set(ex.concept_id, (conceptPicks.get(ex.concept_id) ?? 0) + 1);
    if (!solvedFamilies.has(ex.concept_id))
      solvedFamilies.set(ex.concept_id, new Set());
    solvedFamilies.get(ex.concept_id)!.add(paths[ex.id].family);
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
export function recommendationTrace(
  selected: [Source, "new" | "review" | "practice"][],
  sessions: Session[],
) {
  const states = new Map(
    conceptStates(sessions).map((state) => [state.id, state]),
  );
  return {
    algorithm_version: policy.version,
    rules: policy.rules,
    items: selected.map(([ex, category]) => {
      const state = states.get(ex.concept_id)!;
      return {
        id: ex.id,
        version: ex.version,
        concept_id: ex.concept_id,
        role: paths[ex.id].role,
        requires: paths[ex.id].requires,
        level: state.level,
        independent_count: state.independent_count,
        evidence_days: state.evidence_days,
        reason:
          category === "review"
            ? "예정된 복습으로 기억을 다시 확인해요."
            : state.needs_support
              ? "도움이 필요했던 개념의 기초를 먼저 확인해요."
              : ex.level === 1
                ? "다음 단계에 필요한 기초를 먼저 확인해요."
                : "확인한 기초를 다른 조건에 적용해요.",
      };
    }),
  };
}
export function recommendationReason(
  session: Session | null,
  id: string,
): string | undefined {
  const items = session?.recommendation?.items;
  if (!Array.isArray(items)) return undefined;
  const match = items.find((item) => item && item.id === id);
  return typeof match?.reason === "string" ? match.reason : undefined;
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
