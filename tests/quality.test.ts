import test from "node:test";
import assert from "node:assert/strict";
import cases from "./fixtures/record-contract.json" with { type: "json" };
import { mergeSubmission } from "../src/recordContract.ts";
import { learningMetrics } from "../src/learningMetrics.ts";
import { mergeRecords } from "../src/records.ts";
import curriculum from "../src/curriculum.json" with { type: "json" };

for (const c of cases)
  test(`portable: ${c.name}`, () => {
    if (c.error) assert.throws(() => mergeSubmission(c.a as any, c.b as any));
    else {
      const x = mergeSubmission(c.a as any, c.b as any);
      assert.equal(x.answer, c.a.answer);
    }
  });
test("reordered submissions can merge full backups without mutating sources", () => {
  const data: any = {
    version: 1,
    sessions: [],
    progress: {},
    attempts: {
      a: { session: "s", exercise: "e", answer: "2", correct: true },
    },
  };
  const other = structuredClone(data);
  other.attempts.a = Object.fromEntries(
    Object.entries(other.attempts.a).reverse(),
  );
  const before = JSON.stringify(data);
  const merged = mergeRecords(data, other);
  assert.equal(Object.keys(merged.attempts).length, 1);
  assert.equal(JSON.stringify(data), before);
});
test("quality separates independence, help, revealed, pending, future and delayed reviews", () => {
  const ex = curriculum.exercises[0];
  const session = (
    id: string,
    day: string,
    status: string,
    options: any = {},
  ) => ({
    id,
    local_day: day,
    finished: status !== "pending",
    items: [
      {
        ...ex,
        status,
        hints_used: 0,
        attempts_count: 1,
        active_seconds: 30,
        ...options,
      },
    ],
  });
  const data: any = {
    sessions: [
      session("1", "2026-10-01", "correct"),
      session("2", "2026-10-04", "correct", { category: "review" }),
      session("3", "2026-10-05", "correct", { hints_used: 1 }),
      session("4", "2026-10-06", "revealed", { active_seconds: 0 }),
      session("5", "2026-10-07", "pending", { hints_used: 1 }),
      session("6", "2030-01-01", "correct"),
    ],
    events: [],
  };
  const m = learningMetrics(data, "2026-10-10");
  assert.equal(m.completed, 4);
  assert.equal(m.independent, 2);
  assert.equal(m.assisted, 1);
  assert.equal(m.hinted, 2);
  assert.equal(m.hint_success, 1);
  assert.equal(m.review_independent, 1);
  assert.equal(m.missing_time, 1);
  assert.equal(m.median_seconds, 30);
  assert.equal(m.unfinished_past, 1);
});
