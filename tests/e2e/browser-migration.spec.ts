import { test, expect, type Page } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };

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

test("older completed records survive while pending instructions refresh", async ({
  page,
}) => {
  const exercises = await seedLegacy(page, 1);
  const pending = exercises[1];
  await page.goto("./");
  await page.getByRole("button", { name: "이어서 학습하기" }).click();
  await expect(
    page.getByRole("heading", { name: pending.title }),
  ).toBeVisible();
  await expect(page.getByText("이전에 저장된 안내")).toHaveCount(0);
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
  expect(stored.sessions[0].items[1].version).toBe(2);
  expect(stored.progress[exercises[0].id].completed).toBe(1);
});

test("already completed legacy daily goal opens unseen extra questions without a reset", async ({
  page,
}) => {
  const old = await seedLegacy(page, 5);
  const unseen = curriculum.exercises
    .filter((ex) => !old.some((done) => done.id === ex.id))
    .slice(0, 5);
  await page.goto("./");
  await page.getByRole("button", { name: "오늘 학습 돌아보기" }).click();
  await expect(
    page.getByRole("heading", { name: "오늘의 한 걸음, 잘 마쳤어요." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "추가로 5문제 풀기" }).click();
  await expect(
    page.getByRole("heading", { name: unseen[0].title }),
  ).toBeVisible();
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
    stored.sessions[1].items.map((item: { id: string }) => item.id),
  ).toEqual(unseen.map((ex) => ex.id));
  const extraId = stored.sessions[1].id;
  await page.reload();
  await page.getByRole("button", { name: "추가 학습 이어서 풀기" }).click();
  await expect(
    page.getByRole("heading", { name: unseen[0].title }),
  ).toBeVisible();
  stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("learning-coding-daily:v1")!),
  );
  expect(stored.sessions).toHaveLength(2);
  expect(stored.sessions[1].id).toBe(extraId);
});
