import { test, expect, type Page } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };

test("saved SQL queries gain missing inputs without replacing snapshots or answers", async ({
  page,
}) => {
  const ids = [
    "sql-null-02",
    "sql-where-02",
    "sql-having-02",
    "sql-count-02",
    "sql-join-02",
    "sql-join-03",
  ];
  const exercises = ids.map((id) =>
    curriculum.exercises.find((ex) => ex.id === id)!,
  );
  await page.addInitScript(
    ({ exercises }) => {
      const key = "learning-coding-daily:v1";
      if (localStorage.getItem(key)) return;
      const date = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Seoul",
      }).format(new Date());
      const items = exercises.map((ex) => ({
        ...ex,
        code: ex.code
          .split("\n")
          .filter((line) => !line.startsWith("--"))
          .join("\n"),
        version: 1,
        response_mode: "choice",
        estimated_seconds: ex.seconds,
        category: "new",
        status: "pending",
        hints: [],
        hints_used: 0,
        attempts_count: 0,
        last_answer: null,
        last_correct: null,
        active_seconds: 0,
        answer: undefined,
        explanation: undefined,
        draft: "",
      }));
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          sessions: [
            {
              id: "saved-sql-inputs",
              track_id: "pandas",
              local_day: date,
              timezone: "Asia/Seoul",
              batch: 0,
              items,
              total: items.length,
              completed_count: 0,
              correct_count: 0,
              finished: false,
            },
          ],
          progress: {},
          attempts: {},
        }),
      );
    },
    { exercises },
  );
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  await page.getByRole("button", { name: "이전 통합 학습 이어서" }).click();
  for (const ex of exercises) {
    await expect(page.locator("#question-title")).toHaveText(ex.title);
    await expect(page.locator(".exercise-card pre")).toHaveText(ex.code);
    await expect(page.getByText(ex.explanation, { exact: true })).toHaveCount(
      0,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    if (ex.id === "sql-null-02") {
      await page.reload();
      await page.getByRole("button", { name: "이전 통합 학습 이어서" }).click();
      await expect(page.locator(".exercise-card pre")).toContainText(
        "VALUES(2),(NULL),(3)",
      );
      await page.screenshot({
        path: "test-results/sql-refund-inputs-320.png",
        fullPage: true,
      });
    }
    await page.getByLabel(ex.answer, { exact: true }).check();
    await page.getByRole("button", { name: "답 확인하기" }).click();
    await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
    await page.getByRole("button", { name: "다음으로", exact: true }).click();
  }
  await page
    .locator(".review-details")
    .first()
    .getByText("문제와 해설 보기", { exact: true })
    .click();
  await expect(
    page.locator(".review-details").first().locator("pre"),
  ).toHaveText(exercises[0].code);
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("learning-coding-daily:v1")!),
  );
  const session = saved.sessions.find(
    (entry: { id: string }) => entry.id === "saved-sql-inputs",
  );
  expect(session.completed_count).toBe(6);
  for (const [index, item] of session.items.entries()) {
    expect(item.version).toBe(1);
    expect(item.code).toBe(
      exercises[index].code
        .split("\n")
        .filter((line) => !line.startsWith("--"))
        .join("\n"),
    );
    expect(item.last_answer).toBe(exercises[index].answer);
    expect(item.attempts_count).toBe(1);
    expect(item.status).toBe("correct");
  }
});

async function seedLegacy(page: Page, completed: number) {
  const ids = [
    "pandas-select-01",
    "pandas-filter-01",
    "pandas-null-01",
    "pandas-sort-01",
    "pandas-group-01",
  ];
  const exercises = ids.map((id) =>
    curriculum.exercises.find((ex) => ex.id === id)!,
  );
  await page.addInitScript(
    ({ exercises, completed }) => {
      const key = "learning-coding-daily:v1";
      if (localStorage.getItem(key)) return;
      const date = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Seoul",
      }).format(new Date());
      const items = exercises.map((ex, i) => ({
        id: ex.id,
        version: 1,
        concept: ex.concept,
        kind: ex.kind,
        title: i < completed ? "기존에 완료한 문제 제목" : "예전 지문 제목",
        prompt: "이전에 저장된 안내",
        code: ex.code,
        choices: ex.choices,
        estimated_seconds: 120,
        category: "new",
        status: i < completed ? "correct" : "pending",
        hints: [],
        hints_used: 0,
        attempts_count: i < completed ? 1 : 0,
        last_answer: i < completed ? ex.answer : null,
        last_correct: i < completed ? true : null,
        active_seconds: i < completed ? 30 : 0,
        ...(i < completed
          ? { answer: ex.answer, explanation: "기존에 저장한 해설" }
          : {}),
      }));
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          sessions: [
            {
              id: "legacy-session",
              track_id: "pandas",
              local_day: date,
              timezone: "Asia/Seoul",
              items,
              completed_count: completed,
              correct_count: completed,
              total: 5,
              finished: completed === 5,
            },
          ],
          progress: Object.fromEntries(
            exercises
              .slice(0, completed)
              .map((ex) => [ex.id, { due: date, completed: 1 }]),
          ),
          attempts: {},
        }),
      );
    },
    { exercises, completed },
  );
  return exercises;
}

test("older completed and pending snapshots survive an app update", async ({
  page,
}) => {
  const exercises = await seedLegacy(page, 1);
  const pending = exercises[1];
  await page.goto("./");
  await page.getByRole("button", { name: "이전 통합 학습 이어서" }).click();
  await expect(
    page.getByRole("heading", { name: "예전 지문 제목" }),
  ).toBeVisible();
  await expect(page.getByText("이전에 저장된 안내")).toBeVisible();
  await expect(page.locator(".lesson-meta")).not.toContainText(pending.concept);
  await page.getByLabel(pending.answer, { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(
    page.getByRole("heading", { name: "작은 한 걸음, 완료!" }),
  ).toBeVisible();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("learning-coding-daily:v1")!),
  );
  expect(stored.sessions[0].completed_count).toBe(2);
  expect(stored.sessions[0].items[0].title).toBe("기존에 완료한 문제 제목");
  expect(stored.sessions[0].items[0].explanation).toBe("기존에 저장한 해설");
  expect(stored.sessions[0].items[1].version).toBe(1);
  expect(stored.progress[exercises[0].id].completed).toBe(1);
});

test("already completed legacy daily goal opens unseen extra questions without a reset", async ({
  page,
}) => {
  const old = await seedLegacy(page, 5);
  await page.goto("./");
  await expect(page.getByRole("region", { name: "누적 학습" })).toContainText(
    "5문제 풀이",
  );
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await expect(page.locator("#question-title")).toBeVisible();
  let stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("learning-coding-daily:v1")!),
  );
  expect(stored.sessions).toHaveLength(2);
  expect(stored.sessions[0].id).toBe("legacy-session");
  expect(stored.sessions[0].completed_count).toBe(5);
  expect(
    stored.sessions[0].items.every(
      (item: { status: string }) => item.status === "correct",
    ),
  ).toBe(true);
  expect(
    stored.sessions[1].items.every(
      (item: { id: string }) => !old.some((done) => done.id === item.id),
    ),
  ).toBe(true);
  expect(
    new Set(stored.sessions[1].items.map((item: { id: string }) => item.id))
      .size,
  ).toBe(5);
  const extraId = stored.sessions[1].id;
  const pendingTitle = stored.sessions[1].items[0].title;
  await page.reload();
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await expect(page.getByRole("heading", { name: pendingTitle })).toBeVisible();
  stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("learning-coding-daily:v1")!),
  );
  expect(stored.sessions).toHaveLength(2);
  expect(stored.sessions[1].id).toBe(extraId);
});
