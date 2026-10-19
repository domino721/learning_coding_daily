import { test, expect, type Page } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };

async function seed(page: Page, attempts = 0) {
  const exercises = curriculum.exercises
    .filter((ex) => ex.response_mode === "short" && ex.domain !== "SQL")
    .slice(0, 2);
  await page.addInitScript(
    ({ exercises, attempts }) => {
      const key = "learning-coding-daily:v1";
      if (localStorage.getItem(key)) return;
      const date = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Seoul",
      }).format(new Date());
      const items = exercises.map((ex, index) => ({
        ...ex,
        answer: undefined,
        explanation: undefined,
        estimated_seconds: ex.seconds,
        category: "new",
        status: "pending",
        hints: [],
        hints_used: 0,
        attempts_count: index === 0 ? attempts : 0,
        last_answer: index === 0 && attempts ? "previous wrong answer" : null,
        last_correct: index === 0 && attempts ? false : null,
        draft: index === 0 && attempts ? "saved draft" : "",
        active_seconds: 0,
      }));
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          sessions: [
            {
              id: "short-limit-fixture",
              track_id: "python",
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
    { exercises, attempts },
  );
  await page.goto("./");
  await page
    .getByRole("button", { name: /오늘 학습 시작하기|이어서 학습하기/ })
    .click();
  return exercises;
}

test("short answers retain their remaining chance and finalize on the second wrong answer", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "mobile-web",
    "Device storage fixture; API contracts are tested in Python.",
  );
  const exercises = await seed(page);
  await expect(page.getByText("최대 2회 제출 · 남은 기회 2회")).toBeVisible();
  await page.getByRole("textbox").fill("wrong answer");
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("최대 2회 제출 · 남은 기회 1회")).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: /오늘 학습 시작하기|이어서 학습하기/ })
    .click();
  await expect(page.getByText("최대 2회 제출 · 남은 기회 1회")).toBeVisible();
  await page.getByRole("textbox").fill("still wrong");
  await page.getByRole("textbox").press("Enter");
  await expect(page.getByText("오답으로 기록했어요")).toBeVisible();
  await expect(page.getByRole("textbox")).toBeDisabled();
  await expect(page.getByRole("button", { name: "답 확인하기" })).toHaveCount(
    0,
  );
  await expect(page.locator(".solution")).toContainText(exercises[0].answer);
  await page.getByRole("button", { name: "다음으로", exact: true }).click();
  await page.getByRole("textbox").fill("wrong answer");
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("최대 2회 제출 · 남은 기회 1회")).toBeVisible();
  await page.getByRole("textbox").fill(exercises[1].answer);
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
  const data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("learning-coding-daily:v1")!),
  );
  expect(
    data.sessions[0].items.map(
      (item: { status: string; attempts_count: number }) => [
        item.status,
        item.attempts_count,
      ],
    ),
  ).toEqual([
    ["incorrect", 2],
    ["correct", 2],
  ]);
  expect(Object.keys(data.attempts)).toHaveLength(4);
});

test("existing short attempts and drafts are preserved when the new cap is reached", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "mobile-web",
    "Device storage fixture; API contracts are tested in Python.",
  );
  await seed(page, 4);
  await expect(page.getByText("최대 2회 제출 · 남은 기회 0회")).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveValue("saved draft");
  await expect(page.getByRole("textbox")).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "답 확인하기" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "해설 보고 마치기" }).click();
  await expect(page.getByText("해설로 배웠어요")).toBeVisible();
  const data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("learning-coding-daily:v1")!),
  );
  expect(data.sessions[0].items[0]).toMatchObject({
    attempts_count: 4,
    last_answer: "previous wrong answer",
    status: "revealed",
  });
  expect(Object.keys(data.attempts)).toHaveLength(0);
});
