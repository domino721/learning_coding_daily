import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import curriculum from "../../src/curriculum.json" with { type: "json" };
import bank from "../../curriculum/problem_bank.json" with { type: "json" };
import formats from "../../backend/format_content.json" with { type: "json" };
import { enterAnswer } from "./answer";

const added = new Set(formats.exercises.map((ex) => ex.id));
const traps = new Map(
  bank.exercises
    .filter((card) => added.has(card.id))
    .map((card) => [
      card.id,
      Object.keys((card as { distractor_targets: object }).distractor_targets),
    ]),
);

test("line, order and multi items are solved by tapping on a 320px phone", async ({
  page,
}, testInfo) => {
  // Device mode keeps this learner isolated; tests/test_api.py covers server grading.
  test.skip(testInfo.project.name !== "mobile-web", "device-mode UI flow");
  test.slow();
  const previous = curriculum.exercises.filter((ex) => !added.has(ex.id));
  const sessions = previous.map((ex, index) => ({
    id: `before-formats-${ex.id}`,
    track_id: "pandas",
    local_day: new Date(Date.UTC(2025, 7, 1 + index))
      .toISOString()
      .slice(0, 10),
    timezone: "Asia/Seoul",
    batch: index,
    total: 1,
    completed_count: 1,
    correct_count: ex.response_mode === "essay" ? 0 : 1,
    finished: true,
    items: [
      {
        ...ex,
        estimated_seconds: ex.seconds,
        status: ex.response_mode === "essay" ? "revealed" : "correct",
        category: "new",
        hints: [],
        hints_used: 0,
        attempts_count: ex.response_mode === "essay" ? 0 : 1,
        last_answer: ex.answer,
        last_correct: ex.response_mode === "essay" ? null : true,
        active_seconds: 30,
      },
    ],
  }));
  const data = {
    version: 1,
    schema_version: 2,
    learner_id: "formats-test",
    sessions,
    progress: Object.fromEntries(
      previous.map((ex) => [ex.id, { due: "2099-01-01", completed: 1 }]),
    ),
    attempts: {},
    events: [],
  };
  const backup = {
    format: "learning-coding-daily-backup",
    version: 1,
    exported_at: new Date().toISOString(),
    checksum: createHash("sha256").update(JSON.stringify(data)).digest("hex"),
    data,
  };
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  await page.getByRole("button", { name: "나의 기록", exact: true }).click();
  await page.getByLabel("백업 파일 가져오기").setInputFiles({
    name: "before-formats.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  const owner = page.getByLabel("다른 학습 ID지만 본인의 기록이 맞아요.");
  if (await owner.isVisible()) await owner.check();
  await page.getByRole("button", { name: "확인한 기록 합치기" }).click();
  await expect(
    page.getByText("백업 기록을 합쳤어요. 기존 완료 기록은 유지됩니다."),
  ).toBeVisible();
  await page.getByRole("button", { name: "오늘 학습", exact: true }).click();

  const solved = new Set<string>();
  const retried = new Set<string>();
  const shot = new Set<string>();
  for (const track of ["python", "sql"]) {
    const remaining = () =>
      formats.exercises.filter(
        (ex) =>
          !solved.has(ex.id) && (ex.domain === "SQL") === (track === "sql"),
      ).length;
    await page
      .getByRole("button", {
        name: track === "python" ? /Python 데이터 분석.*pandas/ : /SQL 행 조건/,
      })
      .click();
    await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
    while (remaining()) {
      await expect(page.locator("#question-title")).toBeVisible();
      const title = await page.locator("#question-title").innerText();
      const ex = curriculum.exercises.find((item) => item.title === title)!;
      expect(added.has(ex.id)).toBeTruthy();
      const submit = page.getByRole("button", { name: "답 확인하기" });
      await expect(submit).toBeDisabled();
      if (!retried.has(ex.kind)) {
        // One wrong attempt per kind: the authored trap is accepted as an answer, then fixed.
        const trap =
          ex.kind === "multi"
            ? [
                ...ex.answer.split(","),
                String(
                  ex.choices.findIndex(
                    (_, i) => !ex.answer.split(",").includes(String(i + 1)),
                  ) + 1,
                ),
              ]
                .map(Number)
                .sort((a, b) => a - b)
                .join(",")
            : traps.get(ex.id)![0];
        await enterAnswer(page, ex, trap);
        await submit.click();
        await expect(page.getByText("한 번 더 생각해 볼까요?")).toBeVisible();
        if (ex.kind === "order")
          while (
            await page.getByRole("button", { name: /번째에서 빼기/ }).count()
          )
            await page
              .getByRole("button", { name: /번째에서 빼기/ })
              .first()
              .click();
        if (ex.kind === "multi")
          for (const n of trap.split(",").map(Number))
            await page.getByLabel(ex.choices[n - 1], { exact: true }).uncheck();
        retried.add(ex.kind);
      }
      await enterAnswer(page, ex);
      if (!shot.has(ex.kind)) {
        shot.add(ex.kind);
        await page.screenshot({
          path: `test-results/${testInfo.project.name}-format-${ex.kind}.png`,
          fullPage: true,
        });
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await submit.click();
      await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible({
        timeout: 15_000,
      });
      const first = Number(ex.answer.split(",")[0]);
      await expect(page.locator(".solution")).toContainText(
        ex.kind === "line"
          ? `${ex.answer}번 줄 · ${ex.code.split("\n")[first - 1].trim()}`
          : ex.choices[first - 1],
      );
      solved.add(ex.id);
      await page.getByRole("button", { name: "다음으로", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: title, exact: true }),
      ).toHaveCount(0);
      if (
        remaining() &&
        (await page
          .getByRole("button", { name: "오늘 학습으로 돌아가기" })
          .isVisible())
      )
        await page.getByRole("button", { name: /추천 문제 더 풀기/ }).click();
    }
    await page.getByRole("button", { name: "오늘 학습으로 돌아가기" }).click();
  }
  expect(solved).toEqual(added);
  expect(retried).toEqual(new Set(["line", "order", "multi"]));

  // History shows the placed lines, not the stored option numbers.
  const order = formats.exercises.find((ex) => ex.kind === "order")!;
  const firstLine = order.choices[Number(order.answer.split(",")[0]) - 1];
  await page.getByRole("button", { name: "나의 기록", exact: true }).click();
  await expect(
    page
      .locator(".submitted-answer", { hasText: `내 답안: ${firstLine}` })
      .first(),
  ).toBeAttached();
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-formats.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
