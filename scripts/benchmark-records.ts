import { writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import curriculum from "../src/curriculum.json" with { type: "json" };
import { validateStore, mergeRecords } from "../src/records.ts";
import { learningMetrics } from "../src/learningMetrics.ts";

function history(days: number): any {
  const data: any = {
    version: 1,
    schema_version: 2,
    revision: 1,
    learner_id: "synthetic-only",
    sessions: [],
    attempts: {},
    progress: {},
    catalog: {},
    events: [],
  };
  const pool = curriculum.exercises.filter((e) => e.response_mode !== "essay");
  for (let n = 0; n < days; n++) {
    const date = new Date("2024-01-01T12:00:00Z");
    date.setUTCDate(date.getUTCDate() + n);
    const day = date.toISOString().slice(0, 10),
      id = `synthetic-${n}`;
    const items = Array.from({ length: 5 }, (_, i) => {
      const ex = pool[(n * 5 + i) % pool.length];
      data.catalog[`${id}:${ex.id}`] = ex;
      data.progress[ex.id] = {
        completed: (data.progress[ex.id]?.completed ?? 0) + 1,
        due: day,
        last_day: day,
        streak: 1,
      };
      data.attempts[`${id}-${i}`] = {
        session: id,
        exercise: ex.id,
        answer: ex.answer,
        correct: true,
        hints_used: 0,
        active_seconds: 60,
        response_mode: ex.response_mode,
      };
      return {
        ...ex,
        estimated_seconds: ex.seconds,
        status: "correct",
        category: n < 17 ? "new" : "review",
        hints: [],
        hints_used: 0,
        attempts_count: 1,
        last_answer: ex.answer,
        last_correct: true,
        active_seconds: 60,
      };
    });
    data.sessions.push({
      id,
      track_id: "python",
      local_day: day,
      timezone: "Asia/Seoul",
      batch: 0,
      items,
      total: 5,
      completed_count: 5,
      correct_count: 5,
      finished: true,
    });
  }
  return data;
}
const results = [90, 365].map((days) => {
  const data = history(days);
  const timings: Record<string, number> = {};
  let raw = "";
  function measure(name: string, work: () => unknown) {
    const start = performance.now();
    work();
    timings[name] = Math.round((performance.now() - start) * 100) / 100;
  }
  measure("stringify_ms", () => (raw = JSON.stringify(data)));
  measure("parse_validate_ms", () => validateStore(JSON.parse(raw)));
  measure("merge_ms", () => mergeRecords(data, data));
  measure("metrics_ms", () => learningMetrics(data, "2026-10-18"));
  return {
    days,
    sessions: data.sessions.length,
    answers: Object.keys(data.attempts).length,
    utf8_bytes: Buffer.byteLength(raw),
    local_storage_utf16_bytes: raw.length * 2,
    timings,
  };
});
const report = {
  synthetic: true,
  description:
    "5 answers/day; retained per-session question snapshots; Node timings are not real-device latency",
  node: process.version,
  results,
};
const output = process.argv[2];
if (output) writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
