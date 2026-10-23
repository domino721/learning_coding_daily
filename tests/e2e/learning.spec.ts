import { test, expect, type Page } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };

test("independent courses use unique pools, capped choices and preserved history", async ({
  page,
}) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  const clock = new Date("2026-10-16T00:00:00Z");
  await page.clock.install({ time: clock });
  await page.clock.pauseAt(clock);
  await page.goto("./");
  const theme = page.getByRole("button", { name: "다크 테마" });
  await expect(theme).toHaveAttribute("aria-pressed", "false");
  await theme.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const python = page.getByRole("button", {
    name: /Python 데이터 분석.*pandas/,
  });
  const sql = page.getByRole("button", { name: /SQL 행 조건/ });
  await expect(python).toContainText(
    `${curriculum.tracks.find((track) => track.id === "python")!.exercise_count}문제`,
  );
  await expect(sql).toContainText(
    `${curriculum.tracks.find((track) => track.id === "sql")!.exercise_count}문제`,
  );
  await expect(python).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("group", { name: "풀이 모드" })).toHaveCount(0);
  const today = page.getByRole("group", { name: "오늘 누적 학습" }),
    lifetime = page.getByRole("region", { name: "누적 학습" });
  await expect(lifetime).toContainText("0문제 풀이");
  await page.setViewportSize({ width: 565, height: 740 });
  const headingBox = (await page.locator(".page-heading").boundingBox())!;
  const wideActivityBox = (await page.locator(".activity").boundingBox())!;
  const totalBox = (await today.locator("p").boundingBox())!;
  const daysBox = (await today.locator(".activity-days").boundingBox())!;
  const breakdownBox = (await today.locator(".today-breakdown").boundingBox())!;
  expect(wideActivityBox.x).toBeGreaterThan(headingBox.x + headingBox.width);
  expect(wideActivityBox.y).toBe(headingBox.y);
  expect(breakdownBox.x).toBeGreaterThan(totalBox.x + totalBox.width);
  expect(daysBox.y + daysBox.height).toBeLessThanOrEqual(totalBox.y);
  expect(breakdownBox.y).toBeLessThan(daysBox.y);
  await page.setViewportSize({ width: 320, height: 740 });
  const startButton = page.getByRole("button", {
    name: "오늘 학습 시작하기",
  });
  const startBox = (await startButton.boundingBox())!;
  const navBox = (await page.getByRole("navigation").boundingBox())!;
  const activityBox = (await page.locator(".activity").boundingBox())!;
  // The primary action must fit above the fixed navigation without scrolling.
  expect(startBox.y + startBox.height).toBeLessThan(navBox.y);
  expect(activityBox.y + activityBox.height).toBeLessThan(startBox.y);
  expect(activityBox.height).toBeLessThan(240);
  await page.screenshot({
    path: `test-results/${test.info().project.name}-home.png`,
    fullPage: true,
  });
  const resume = () =>
    page
      .getByRole("button", { name: /오늘 학습 시작하기|이어서 학습하기/ })
      .click();
  await resume();
  const timer = page.getByRole("timer", { name: "풀이 경과 시간" });
  await expect(timer).toHaveText("경과 0:00");
  await page.clock.runFor(3000);
  await expect(timer).toHaveText("경과 0:03");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(5000);
  await expect(timer).toHaveText("경과 0:03");
  await page.evaluate(() => {
    delete (document as Document & { hidden?: boolean }).hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(2000);
  await expect(timer).toHaveText("경과 0:05");
  await page.clock.resume();
  const first = curriculum.exercises[0];
  const wrong = first.choices.find((c) => c !== first.answer)!;
  await page.getByLabel(wrong, { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("남은 기회 1회", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: /힌트 보기/ }).click();
  await expect(page.getByText(first.hints[0], { exact: false })).toBeVisible();
  await page.reload();
  await expect(theme).toHaveAttribute("aria-pressed", "true");
  await resume();
  await expect(page.getByText("남은 기회 1회", { exact: false })).toBeVisible();
  await page.getByLabel(wrong, { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("오답으로 기록했어요")).toBeVisible();
  await expect(page.locator(".result-symbol")).toHaveText("×");
  const completedTime = await timer.innerText();
  await page.clock.fastForward(3000);
  await expect(timer).toHaveText(completedTime);
  await expect(page.getByRole("button", { name: "답 확인하기" })).toHaveCount(
    0,
  );
  await expect(page.locator(".solution")).toContainText(first.answer);
  await page.screenshot({
    path: `test-results/${test.info().project.name}-feedback.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "다음으로", exact: true }).click();
  await page.getByRole("textbox").fill("(2, 3)");
  await expect(page.getByText("입력한 답을 저장했어요.")).toBeVisible();
  await page.reload();
  await resume();
  await expect(page.getByRole("textbox")).toHaveValue("(2, 3)");
  const seen = new Set<string>([first.id]);
  let count = 1;
  async function solve(track: string) {
    const title = await page.locator("#question-title").innerText();
    const ex = curriculum.exercises.find((e) => e.title === title)!;
    expect(ex.response_mode).not.toBe("essay");
    expect(ex.domain === "SQL").toBe(track === "sql");
    expect(seen.has(ex.id)).toBe(false);
    seen.add(ex.id);
    if (ex.response_mode === "choice")
      await page.getByLabel(ex.answer, { exact: true }).check();
    else await page.getByRole("textbox").fill(ex.answer);
    await page.getByRole("button", { name: "답 확인하기" }).click();
    await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
    count++;
    await page.getByRole("button", { name: "다음으로", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toHaveCount(0);
  }
  while (await page.locator("#question-title").count()) await solve("python");
  await expect(today).toContainText("오늘 총 5문제");
  const review = page.locator(".summary-list > li").first();
  await review.getByText("문제와 해설 보기", { exact: true }).click();
  await expect(review.locator("pre")).toHaveText(first.code);
  await expect(
    review.getByRole("list", { name: "문제 보기" }).locator("li"),
  ).toHaveCount(first.choices.length);
  await expect(review).toContainText(wrong);
  await expect(review).toContainText(first.explanation);
  // Every extra session consumes at least one unseen active question.
  const pythonPool = curriculum.tracks.find(
    (track) => track.id === "python",
  )!.exercise_count;
  for (let batch = 0; batch < pythonPool; batch++) {
    const more = page.getByRole("button", {
      name: /추천 문제 더 풀기|추가 학습 이어서 풀기/,
    });
    if (await more.isDisabled()) break;
    await more.click();
    await expect(page.locator("#question-title")).toBeVisible();
    while (await page.locator("#question-title").count()) await solve("python");
  }
  await expect(
    page.getByText("오늘 추천할 문제를 모두 풀었어요.", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".summary-list > li")).toHaveCount(count);
  await page.getByRole("button", { name: "오늘 학습으로 돌아가기" }).click();
  await expect(lifetime).toContainText(`${count}문제 풀이`);
  await sql.click();
  await expect(sql).toHaveAttribute("aria-pressed", "true");
  await expect(lifetime).toContainText(`${count}문제 풀이`);
  await resume();
  await expect(page.locator("#question-title")).toBeVisible();
  await expect(
    page
      .locator(".syntax-keyword")
      .filter({ hasText: /SELECT/i })
      .first(),
  ).toBeVisible();
  while (await page.locator("#question-title").count()) await solve("sql");
  await page.getByRole("button", { name: "나의 기록" }).click();
  await expect(lifetime).toContainText(`${count}문제 풀이`);
  await expect(page.locator(".history-session")).toContainText(["SQL"]);
  await page.getByText("개념별 학습 경로", { exact: true }).click();
  await expect(page.locator(".concept-grid article")).toHaveCount(18);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: `test-results/${test.info().project.name}-records.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("small screen and network failures keep a recovery action", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const onDevice = test.info().project.name === "mobile-web";
  if (onDevice) {
    await page.addInitScript(() =>
      localStorage.setItem("learning-coding-daily:v1", "invalid"),
    );
    await page.goto("./");
    await expect(page.getByRole("alert")).toContainText(
      "저장된 학습 기록을 읽지 못했어요",
    );
    expect(
      await page.evaluate(() =>
        localStorage.getItem("learning-coding-daily:v1"),
      ),
    ).toBe("invalid");
    await expect(page.getByLabel("백업 파일 가져오기")).toBeVisible();
    return;
  }
  await page.route("**/api/dashboard*", (r) => r.abort());
  await page.goto("./");
  await expect(page.getByRole("alert")).toContainText("연결하지 못했어요");
  await page.unroute("**/api/dashboard*");
  await page.getByRole("button", { name: "다시 연결" }).click();
  await expect(
    page.getByRole("button", {
      name: /오늘 학습 시작하기|오늘 학습 돌아보기|이어서 학습하기/,
    }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
