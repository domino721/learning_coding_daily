import { test, expect, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import curriculum from "../../src/curriculum.json" with { type: "json" };

function item(ex: (typeof curriculum.exercises)[number], status = "correct") {
  return {
    id: ex.id,
    version: ex.version,
    concept: ex.concept,
    concept_id: ex.concept_id,
    difficulty: ex.difficulty,
    domain: ex.domain,
    level: ex.level,
    kind: ex.kind,
    response_mode: ex.response_mode,
    title: ex.title,
    prompt: ex.prompt,
    code: ex.code,
    choices: ex.choices,
    estimated_seconds: ex.seconds,
    category: "new",
    status,
    hints: [],
    hints_used: 0,
    attempts_count: status === "pending" ? 0 : 1,
    last_answer: status === "pending" ? null : ex.answer,
    last_correct: status === "pending" ? null : true,
    active_seconds: 20,
    ...(status !== "pending"
      ? { answer: ex.answer, explanation: ex.explanation }
      : {}),
  };
}
function session(
  id: string,
  day: string,
  items: ReturnType<typeof item>[],
  batch = 0,
) {
  return {
    id,
    track_id: "pandas",
    local_day: day,
    timezone: "Asia/Seoul",
    batch,
    items,
    completed_count: items.filter((i) => i.status !== "pending").length,
    correct_count: items.filter((i) => i.status === "correct").length,
    total: items.length,
    finished: items.every((i) => i.status !== "pending"),
  };
}
function backup(
  sessions: ReturnType<typeof session>[],
  learner = "beta-fixture",
) {
  const progress: Record<string, unknown> = {};
  for (const s of sessions)
    for (const i of s.items)
      if (i.status !== "pending")
        progress[i.id] = { due: s.local_day, completed: 1 };
  const data = {
    version: 1,
    schema_version: 2,
    learner_id: learner,
    sessions,
    progress,
    attempts: {},
    events: [],
  };
  return {
    format: "learning-coding-daily-backup",
    version: 1,
    exported_at: new Date().toISOString(),
    checksum: createHash("sha256").update(JSON.stringify(data)).digest("hex"),
    data,
  };
}
async function upload(page: Page, value: unknown) {
  await page.getByLabel("백업 파일 가져오기").setInputFiles({
    name: "매일코딩-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(value)),
  });
}
async function confirm(page: Page) {
  const owner = page.getByLabel("다른 학습 ID지만 본인의 기록이 맞아요.");
  if (await owner.isVisible()) await owner.check();
  await page.getByRole("button", { name: "확인한 기록 합치기" }).click();
  await expect(
    page.getByText("백업 기록을 합쳤어요. 기존 완료 기록은 유지됩니다."),
  ).toBeVisible();
}
async function total(page: Page) {
  return parseInt(
    (
      await page
        .getByRole("region", { name: "누적 학습" })
        .locator("strong")
        .innerText()
    ).replace(/[^0-9]/g, ""),
  );
}

test("past logs and checked backup merge survive repeat import and corrupted files", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto("./");
  const before = await total(page);
  await page.getByRole("button", { name: "나의 기록" }).click();
  const old = curriculum.exercises.slice(0, 5).map((e) => item(e));
  old[0].title = "베타에서 풀었던 원래 제목";
  old[0].explanation = "베타에서 저장한 원래 해설";
  const value = backup([session("beta-archive-20261001", "2026-10-01", old)]);
  await upload(page, value);
  await expect(
    page.getByRole("group", { name: "백업 복구 확인" }),
  ).toContainText("5문제 풀이");
  await confirm(page);
  await expect.poll(() => total(page)).toBe(before + 5);
  const row = page
    .locator(".history-session")
    .filter({ hasText: "2026-10-01" });
  await row.locator("summary").click();
  await expect(row).toContainText("베타에서 풀었던 원래 제목");
  await expect(row).toContainText("베타에서 저장한 원래 해설");
  await upload(page, value);
  await confirm(page);
  await expect.poll(() => total(page)).toBe(before + 5);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "백업 파일 내려받기" }).click();
  const file = await download;
  const saved = JSON.parse(await readFile((await file.path())!, "utf8"));
  expect(
    saved.data.sessions.some(
      (s: { id: string }) => s.id === "beta-archive-20261001",
    ),
  ).toBe(true);
  expect(
    saved.data.events.filter((e: { kind: string }) => e.kind === "completed")
      .length,
  ).toBeGreaterThanOrEqual(5);
  const tampered = structuredClone(saved);
  tampered.data.sessions[0].items[0].last_answer = "다른 답안";
  await upload(page, tampered);
  await expect(page.getByText(/검증 값이 맞지/)).toBeVisible();
  await expect.poll(() => total(page)).toBe(before + 5);
  await upload(page, { ...saved, version: 99 });
  await expect(
    page.getByText(/지원하는 매일코딩 백업 파일이 아니에요/),
  ).toBeVisible();
  await page.reload();
  await expect.poll(() => total(page)).toBe(before + 5);
});

test("legacy essays remain ungraded with drafts preserved and excluded from new pools", async ({
  page,
}) => {
  const day = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const essay = curriculum.exercises.find((e) => e.id === "numpy-view-03")!;
  const draft = {
    ...item(essay, "pending"),
    draft: "이전에 입력한 답안과 이유",
  };
  const completed = {
    ...item(curriculum.exercises[1], "revealed"),
    response_mode: "essay",
    last_correct: null,
  };
  await page.goto("./");
  await page.getByRole("button", { name: "나의 기록" }).click();
  const value = backup([session("paused-essay", day, [draft, completed])]);
  await upload(page, value);
  await confirm(page);
  const row = page.locator(".history-session").filter({ hasText: draft.draft });
  await row.locator("summary").click();
  await expect(row).toContainText("서술형 보류 · 미채점");
  await expect(row).toContainText(draft.draft);
  await page.reload();
  if (test.info().project.name === "mobile-web") {
    await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
    await expect(page.locator(".question-format")).not.toContainText("서술형");
    await page.getByRole("button", { name: "← 오늘 학습" }).click();
  }
  await page.getByRole("button", { name: "나의 기록" }).click();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "백업 파일 내려받기" }).click();
  const file = await pending;
  const saved = JSON.parse(await readFile((await file.path())!, "utf8"));
  const original = saved.data.sessions.find(
    (s: { id: string }) => s.id === "paused-essay",
  );
  expect(original.items[0].draft).toBe(draft.draft);
  expect(original.items[0].status).toBe("pending");
  expect(original.items[1].last_answer).toBe(completed.last_answer);
  expect(original.items[1].last_correct).toBeNull();
  expect(original.completed_count).toBe(1);
});

test("a missing or damaged primary store recovers from IndexedDB without resetting", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "mobile-web",
    "Browser-only recovery storage",
  );
  await page.goto("./");
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await page
    .getByLabel(curriculum.exercises[0].answer, { exact: true })
    .check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
  await page.evaluate(() =>
    localStorage.removeItem("learning-coding-daily:v1"),
  );
  await page.reload();
  await expect.poll(() => total(page)).toBe(1);
  await expect(
    page.getByText(/보관된 저장본에서 학습 기록을 복구했어요/),
  ).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem("learning-coding-daily:v1", "invalid-primary"),
  );
  await page.reload();
  await expect.poll(() => total(page)).toBe(1);
  expect(
    await page.evaluate(() => localStorage.getItem("learning-coding-daily:v1")),
  ).toBe("invalid-primary");
  await page.getByRole("button", { name: "이어서 학습하기" }).click();
  await expect(page.locator("#question-title")).toHaveText(
    curriculum.exercises[1].title,
  );
});

test("both storage write failures keep the question pending and permit a safe retry", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "mobile-web",
    "Browser-only quota simulation",
  );
  await page.goto("./");
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await expect(page.locator("#question-title")).toHaveText(
    curriculum.exercises[0].title,
  );
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (
      ...args: Parameters<IDBDatabase["transaction"]>
    ) {
      if (args[1] === "readwrite")
        throw new DOMException("Full", "QuotaExceededError");
      return original.apply(this, args);
    };
    Storage.prototype.setItem = function () {
      throw new DOMException("Full", "QuotaExceededError");
    };
  });
  await page
    .getByLabel(curriculum.exercises[0].answer, { exact: true })
    .check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "기록을 저장하지 못했어요",
  );
  await expect(
    page.getByRole("button", { name: "다음으로", exact: true }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("learning-coding-daily:v1")!)
          .sessions[0].completed_count,
    ),
  ).toBe(0);
  await page.reload();
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await page
    .getByLabel(curriculum.exercises[0].answer, { exact: true })
    .check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
});

test("a verified backup can recover an unreadable store while retaining corrupt bytes", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "mobile-web", "Browser-only recovery");
  await page.addInitScript(() => {
    if (!localStorage.getItem("learning-coding-daily:v1"))
      localStorage.setItem("learning-coding-daily:v1", "broken-original");
  });
  await page.goto("./");
  await expect(page.getByRole("alert")).toContainText(
    "기록을 초기화하지 않았습니다",
  );
  const value = backup(
    [
      session(
        "recovery-old",
        "2026-10-01",
        curriculum.exercises.slice(0, 5).map((e) => item(e)),
      ),
    ],
    "recovery-owner",
  );
  await upload(page, value);
  await page
    .getByLabel("읽지 못한 저장본은 보관하고 이 백업으로 복구할게요.")
    .check();
  await confirm(page);
  await expect.poll(() => total(page)).toBe(5);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("learning-coding-daily:v1:unreadable"),
    ),
  ).toBe("broken-original");
  await page.reload();
  await expect.poll(() => total(page)).toBe(5);
});

test("midnight starts a new daily goal while lifetime and earlier history remain", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "mobile-web",
    "Browser timezone rollover",
  );
  await page.clock.install({ time: new Date("2026-10-20T14:59:00Z") });
  await page.goto("./");
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await page
    .getByLabel(curriculum.exercises[0].answer, { exact: true })
    .check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
  await page.clock.setFixedTime(new Date("2026-10-20T15:01:00Z"));
  await page.reload();
  await expect(
    page.getByRole("group", { name: "오늘 누적 학습" }),
  ).toContainText("오늘 총 0문제");
  await expect.poll(() => total(page)).toBe(1);
  await page.getByRole("button", { name: "나의 기록" }).click();
  await expect(page.locator(".history-session")).toContainText("2026-10-20");
});

test("readable legacy records remain visible and exportable when migration writes fail", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "mobile-web",
    "Browser-only read-only migration",
  );
  const old = session(
    "readonly-legacy",
    "2026-10-01",
    curriculum.exercises.slice(0, 5).map((e) => item(e)),
  );
  const data = {
    version: 1,
    sessions: [old],
    progress: Object.fromEntries(
      old.items.map((i) => [i.id, { completed: 1, due: "2026-10-02" }]),
    ),
    attempts: {},
  };
  await page.addInitScript((data) => {
    localStorage.setItem("learning-coding-daily:v1", JSON.stringify(data));
    Object.defineProperty(window, "indexedDB", { value: undefined });
    Storage.prototype.setItem = function () {
      throw new DOMException("Full", "QuotaExceededError");
    };
  }, data);
  await page.goto("./");
  await expect.poll(() => total(page)).toBe(5);
  await expect(
    page.getByText(/기존 기록은 읽었지만 새 기록을 저장할 공간이 부족해요/),
  ).toBeVisible();
  await page.getByRole("button", { name: "나의 기록" }).click();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "백업 파일 내려받기" }).click();
  const file = await pending;
  const saved = JSON.parse(await readFile((await file.path())!, "utf8"));
  expect(saved.data.sessions[0].completed_count).toBe(5);
  expect(saved.data.sessions[0].id).toBe("readonly-legacy");
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("learning-coding-daily:v1")!)
          .sessions[0].completed_count,
    ),
  ).toBe(5);
});
