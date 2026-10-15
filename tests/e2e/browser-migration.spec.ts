import { test, expect } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };

test("older completed records survive while pending instructions refresh", async ({
  page,
}) => {
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
  const pending = exercises[1];
  await page.addInitScript(
    ({ exercises }) => {
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
        title: i === 0 ? "기존에 완료한 문제 제목" : "예전 지문 제목",
        prompt: "이전에 저장된 안내",
        code: ex.code,
        choices: ex.choices,
        estimated_seconds: 120,
        category: "new",
        status: i === 0 ? "correct" : "pending",
        hints: [],
        hints_used: 0,
        attempts_count: i === 0 ? 1 : 0,
        last_answer: i === 0 ? ex.answer : null,
        last_correct: i === 0 ? true : null,
        active_seconds: i === 0 ? 30 : 0,
        ...(i === 0
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
              completed_count: 1,
              correct_count: 1,
              total: 5,
              finished: false,
            },
          ],
          progress: { [exercises[0].id]: { due: date, completed: 1 } },
          attempts: {},
        }),
      );
    },
    { exercises },
  );
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
