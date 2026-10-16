import test from "node:test";
import assert from "node:assert/strict";
import cases from "./fixtures/recommendation.json" with { type: "json" };
import curriculum from "../src/curriculum.json" with { type: "json" };
import {
  conceptStates,
  selectExercises,
  reviewDue,
} from "../src/recommendation.ts";
import {
  validateStore,
  mergeRecords,
  createBackup,
  parseBackup,
} from "../src/records.ts";
for (const fixture of cases)
  test(fixture.name, () => {
    const sessions = fixture.records.map((r, index) => {
      const ex = curriculum.exercises.find((e) => e.id === r.id)!;
      return {
        id: `s-${index}`,
        local_day: r.day,
        batch: index,
        items: [
          {
            ...ex,
            status: r.essay ? "revealed" : "correct",
            response_mode: r.essay ? "essay" : "short",
            hints_used: r.hints ?? 0,
            attempts_count: r.attempts ?? 1,
          },
        ],
      };
    });
    const state = conceptStates(sessions as any).find(
      (s) => s.id === fixture.expected.concept,
    )!;
    for (const key of ["level", "independent_count", "evidence_days"] as const)
      assert.equal(state[key], fixture.expected[key]);
    assert.deepEqual(
      selectExercises(sessions as any, {}, fixture.day).map(([ex]) => ex.id),
      fixture.selected,
    );
  });
test("review intervals and same-day cap", () => {
  assert.deepEqual(reviewDue("2026-10-20", {}, false), {
    due: "2026-10-21",
    streak: 0,
  });
  assert.deepEqual(
    reviewDue("2026-10-20", { streak: 2, last_day: "2026-10-19" }, true),
    { due: "2026-11-03", streak: 3 },
  );
  assert.deepEqual(
    reviewDue(
      "2026-10-20",
      { streak: 2, last_day: "2026-10-20", due: "2026-10-27" },
      true,
    ),
    { due: "2026-10-27", streak: 2 },
  );
});
test("unknown backup version is rejected without mutation", () => {
  const data = { version: 9, sessions: [], progress: {}, attempts: {} };
  assert.throws(() => validateStore(data));
  assert.equal(data.version, 9);
});

function sample(id = "portable-session") {
  const ex = curriculum.exercises[0];
  const item = {
    ...ex,
    estimated_seconds: ex.seconds,
    status: "correct",
    category: "new",
    hints: [],
    hints_used: 0,
    attempts_count: 1,
    last_answer: ex.answer,
    last_correct: true,
    active_seconds: 12,
  };
  return {
    version: 1,
    schema_version: 2,
    revision: 0,
    learner_id: "tester",
    sessions: [
      {
        id,
        track_id: "pandas",
        local_day: "2026-10-19",
        timezone: "Asia/Seoul",
        batch: 0,
        items: [item],
        total: 1,
        completed_count: 1,
        correct_count: 1,
        finished: true,
      },
    ],
    progress: { [ex.id]: { due: "2026-10-22", completed: 1 } },
    attempts: {},
    events: [],
  };
}
test("checked portable backup round-trip rejects tampering", async () => {
  const data = sample();
  const file = await createBackup(data as any);
  assert.deepEqual((await parseBackup(JSON.stringify(file))).data, data);
  const changed = structuredClone(file);
  changed.data.sessions[0].items[0].last_answer = "changed";
  await assert.rejects(() => parseBackup(JSON.stringify(changed)), /검증 값/);
});
test("repeat imports do not inflate counts; conflicts leave inputs intact", () => {
  const current = sample(),
    incoming = sample();
  const first = mergeRecords(current as any, incoming as any),
    second = mergeRecords(first, incoming as any);
  assert.equal(second.sessions.length, 1);
  assert.equal(second.progress[curriculum.exercises[0].id].completed, 1);
  const other = sample("other-device");
  const merged = mergeRecords(second, other as any);
  assert.equal(merged.sessions.length, 2);
  assert.equal(merged.progress[curriculum.exercises[0].id].completed, 2);
  assert.deepEqual(
    merged.sessions.map((s) => s.batch),
    [0, 1],
  );
  const before = JSON.stringify(current);
  const bad = sample();
  bad.sessions[0].items[0].last_answer = "conflicting answer";
  assert.throws(() => mergeRecords(current as any, bad as any), /완료 답안/);
  assert.equal(JSON.stringify(current), before);
});

test("merging partial progress never discards hints attempts or drafts", () => {
  const current = sample(),
    incoming = sample();
  for (const d of [current, incoming]) {
    d.sessions[0].items[0].status = "pending";
    d.sessions[0].completed_count = 0;
    d.sessions[0].correct_count = 0;
    d.sessions[0].finished = false;
  }
  current.sessions[0].items[0].attempts_count = 2;
  incoming.sessions[0].items[0].hints_used = 1;
  incoming.sessions[0].items[0].hints = ["hint"];
  const merged = mergeRecords(current as any, incoming as any),
    item = merged.sessions[0].items[0];
  assert.equal(item.attempts_count, 2);
  assert.equal(item.hints_used, 1);
  assert.deepEqual(item.hints, ["hint"]);
  (current.sessions[0].items[0] as any).draft = "current draft";
  (incoming.sessions[0].items[0] as any).draft = "other draft";
  assert.throws(
    () => mergeRecords(current as any, incoming as any),
    /작성 중인 답안/,
  );
});

test("damaged snapshots and prototype keys cannot enter a backup", () => {
  const data = sample();
  (data.sessions[0].items[0] as any).id = "__proto__";
  assert.throws(() => validateStore(data));
  const bad = sample() as any;
  bad.catalog = {
    "portable-session:pandas-select-01": {
      id: "pandas-select-01",
      answer: ["wrong type"],
    },
  };
  assert.throws(() => validateStore(bad));
});

test("course pools exclude pending legacy IDs and suspended essays", () => {
  const day = "2026-10-20";
  const legacy = {
    id: "legacy",
    local_day: day,
    items: curriculum.exercises.map((ex) => ({ id: ex.id, status: "pending" })),
  };
  assert.deepEqual(selectExercises([legacy] as any, {}, day, true), []);
  for (const track of ["python", "sql"]) {
    const selected = selectExercises([], {}, day, false, track);
    assert.ok(selected.length > 0);
    assert.equal(new Set(selected.map(([ex]) => ex.id)).size, selected.length);
    assert.ok(
      selected.every(
        ([ex]) =>
          ex.response_mode !== "essay" &&
          (ex.domain === "SQL") === (track === "sql"),
      ),
    );
  }
  const progress = Object.fromEntries(
    curriculum.exercises.map((ex) => [
      ex.id,
      { due: "2026-10-23", completed: 1 },
    ]),
  );
  assert.deepEqual(selectExercises([], progress, day, true), []);
});

test("final incorrect outcomes survive verified backup and idempotent merge", async () => {
  const data = sample();
  const item = data.sessions[0].items[0];
  item.status = "incorrect";
  item.last_correct = false;
  item.attempts_count = 2;
  data.sessions[0].correct_count = 0;
  const original = JSON.stringify(data);
  const parsed = await parseBackup(
    JSON.stringify(await createBackup(data as any)),
  );
  const merged = mergeRecords(data as any, parsed.data);
  assert.equal(merged.sessions[0].items[0].status, "incorrect");
  assert.equal(merged.sessions[0].completed_count, 1);
  assert.equal(merged.sessions[0].correct_count, 0);
  assert.equal(JSON.stringify(data), original);
});
