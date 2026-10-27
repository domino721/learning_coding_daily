import { test, expect } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };

test("a learner who needed the target explanation receives its foundation and keeps history", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "mobile-web",
    "Browser migration is exercised here; server traces are covered by API tests.",
  );
  const sources = ["ml-split-01", "numpy-shape-01", "ml-scale-01"].map((id) =>
    curriculum.exercises.find((ex) => ex.id === id)!,
  );
  await page.addInitScript(
    ({ sources }) => {
      const key = "learning-coding-daily:v1";
      if (localStorage.getItem(key)) return;
      const today = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Seoul",
      }).format(new Date());
      const shift = (days: number) => {
        const result = new Date(`${today}T12:00:00Z`);
        result.setUTCDate(result.getUTCDate() + days);
        return result.toISOString().slice(0, 10);
      };
      const sessions = sources.map((ex, index) => ({
        id: `path-history-${index}`,
        track_id: "python",
        local_day: shift(-1),
        timezone: "Asia/Seoul",
        batch: index,
        total: 1,
        completed_count: 1,
        correct_count: index === 2 ? 0 : 1,
        finished: true,
        items: [
          {
            ...ex,
            estimated_seconds: ex.seconds,
            category: "new",
            status: index === 2 ? "revealed" : "correct",
            hints: [],
            hints_used: index === 2 ? 1 : 0,
            attempts_count: 1,
            active_seconds: 30,
            last_answer: index === 2 ? null : ex.answer,
            last_correct: index !== 2,
          },
        ],
      }));
      const progress = Object.fromEntries(
        sources.map((ex, index) => [
          ex.id,
          {
            completed: 1,
            due: shift(index === 2 ? 0 : 10),
            last_day: shift(-1),
          },
        ]),
      );
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, sessions, progress, attempts: {} }),
      );
    },
    { sources },
  );
  await page.goto("./");
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await expect(
    page.getByRole("heading", { name: "학습 호출의 반환" }),
  ).toBeVisible();
  await expect(page.getByLabel("이 문제를 고른 이유")).toHaveText(
    "도움이 필요했던 개념의 기초를 먼저 확인해요.",
  );
  await page.getByLabel("True", { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
  await page.reload();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("learning-coding-daily:v1")!),
  );
  expect(
    stored.sessions.find((s: { id: string }) => s.id === "path-history-2")
      .items[0].status,
  ).toBe("revealed");
  const current = stored.sessions.find(
    (s: { recommendation?: unknown }) => !!s.recommendation,
  );
  expect(current.items[0].id).toBe("ml-fit-foundation-01");
  expect(current.items[0].status).toBe("correct");
  expect(current.recommendation.algorithm_version).toBe("learning-paths-2.2");
  expect(
    JSON.parse(
      stored.events.find(
        (event: { kind: string; session_id: string }) =>
          event.kind === "session_started" && event.session_id === current.id,
      ).detail,
    ).items[0].id,
  ).toBe("ml-fit-foundation-01");
});
