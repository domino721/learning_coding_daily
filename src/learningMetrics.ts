import curriculum from "./curriculum.json" with { type: "json" };
import type { Store } from "./records";

export function learningMetrics(data: Store, today: string) {
  const rows = data.sessions
    .flatMap((s) =>
      s.items.map((item) => ({ item, day: s.local_day, session: s.id })),
    )
    .filter((r) => r.day <= today && r.item.response_mode !== "essay");
  const finished = rows.filter((r) => r.item.status !== "pending");
  const independent = (i: (typeof rows)[number]["item"]) =>
    i.status === "correct" && i.hints_used === 0 && i.attempts_count === 1;
  const times = finished
    .map((r) => r.item.active_seconds)
    .filter((t) => t > 0)
    .sort((a, b) => a - b);
  const review = finished.filter(
    (r) =>
      r.item.category === "review" &&
      rows.some(
        (p) =>
          p.day < r.day &&
          p.item.id === r.item.id &&
          p.item.version === r.item.version &&
          p.item.status !== "pending",
      ),
  );
  const hinted = rows.filter((r) => r.item.hints_used > 0);
  const family = (id: string) =>
    (curriculum.learning_paths.items as Record<string, { family: string }>)[id]
      ?.family;
  const transfer = finished.filter(
    (r) =>
      (r.item.level ?? 1) >= 2 &&
      rows.some(
        (p) =>
          p.day < r.day &&
          p.item.concept_id === r.item.concept_id &&
          family(p.item.id) &&
          family(r.item.id) &&
          family(p.item.id) !== family(r.item.id) &&
          independent(p.item),
      ),
  );
  const days = [...new Set(finished.map((r) => r.day))].sort();
  const enrolled = data.events?.find((e) => e.kind === "study_enrolled");
  const notes = (data.events ?? [])
    .filter((e) => e.kind === "observation_note")
    .flatMap((e) => {
      try {
        const n = JSON.parse(e.detail ?? "");
        return typeof n.day === "string"
          ? [
              n as {
                day: string;
                device: string;
                difficulty: string;
                comment: string;
                real_device: boolean;
              },
            ]
          : [];
      } catch {
        return [];
      }
    });
  const n = times.length;
  const followups = [1, 7].map((gap) => {
    if (!days.length)
      return { gap, eligible: false, target_day: null, returned: null };
    const d = new Date(`${days[0]}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + gap);
    const target = d.toISOString().slice(0, 10);
    return {
      gap,
      target_day: target,
      eligible: today >= target,
      returned: today >= target ? days.includes(target) : null,
    };
  });
  const items = [
    ...new Set(finished.map((r) => `${r.item.id}@${r.item.version}`)),
  ].map((key) => {
    const group = finished.filter(
      (r) => `${r.item.id}@${r.item.version}` === key,
    );
    const t = group
      .map((r) => r.item.active_seconds)
      .filter((t) => t > 0)
      .sort((a, b) => a - b);
    const n = t.length;
    return {
      key,
      title: group[0].item.title,
      observations: group.length,
      independent: group.filter((r) => independent(r.item)).length,
      hints: group.filter((r) => r.item.hints_used > 0).length,
      median_seconds: n
        ? n % 2
          ? t[(n - 1) / 2]
          : (t[n / 2 - 1] + t[n / 2]) / 2
        : null,
    };
  });
  return {
    completed: finished.length,
    independent: finished.filter((r) => independent(r.item)).length,
    assisted: finished.filter(
      (r) => r.item.status === "correct" && !independent(r.item),
    ).length,
    incorrect: finished.filter((r) => r.item.status === "incorrect").length,
    revealed: finished.filter((r) => r.item.status === "revealed").length,
    hinted: hinted.length,
    hint_success: hinted.filter((r) => r.item.status === "correct").length,
    review: review.length,
    review_independent: review.filter((r) => independent(r.item)).length,
    transfer: transfer.length,
    transfer_independent: transfer.filter((r) => independent(r.item)).length,
    median_seconds: n
      ? n % 2
        ? times[(n - 1) / 2]
        : (times[n / 2 - 1] + times[n / 2]) / 2
      : null,
    measured: n,
    missing_time: finished.length - n,
    over_three_minutes: times.filter((t) => t > 180).length,
    unfinished_past: data.sessions.filter(
      (s) => s.local_day < today && !s.finished,
    ).length,
    pause_events: (data.events ?? []).filter((e) => e.kind === "lesson_paused")
      .length,
    items,
    followups,
    days,
    enrolled_at: enrolled?.occurred_at ?? null,
    notes,
    limitations: [
      "개인 기록의 기술 통계이며 학습 효과의 통계적 입증이 아닙니다.",
      "제출·해설 확인 없이 닫은 구간은 풀이 시간에서 누락될 수 있습니다.",
      "과거 미완료 묶음은 중단 관찰이며 이탈 의도를 확정하지 않습니다.",
      "새 유형은 작성자 유형군 기준이며 자동 능력 점수가 아닙니다.",
    ],
  };
}
