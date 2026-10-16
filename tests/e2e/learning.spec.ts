import { test, expect, type Page } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };

test("one start recommends authored formats and preserves basic extra and all-time history", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(
    page.getByRole("button", { name: /데이터 분석.*NumPy/ }),
  ).toContainText("60문제");
  await expect(page.getByRole("group", { name: "풀이 모드" })).toHaveCount(0);
  const today = page.getByRole("group", { name: "오늘 누적 학습" }),
    lifetime = page.getByRole("region", { name: "누적 학습" });
  await expect(today).toContainText("오늘 총 0문제");
  await expect(lifetime).toContainText("0문제 풀이");
  const foot = await page
      .getByRole("region", { name: "최근 7일의 발자국" })
      .boundingBox(),
    card = await page
      .getByRole("region", { name: "데이터를 읽는 작은 습관" })
      .boundingBox();
  expect(foot!.y + foot!.height).toBeLessThan(card!.y);
  await page.screenshot({
    path: `test-results/${test.info().project.name}-home.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  let correct = 0,
    reviewed = 0;
  async function solve() {
    const title = await page.locator("#question-title").innerText(),
      ex = curriculum.exercises.find((e) => e.title === title)!;
    expect(ex).toBeTruthy();
    await expect(page.locator(".lesson-meta")).not.toContainText(ex.concept);
    await expect(page.getByText(ex.hints[0], { exact: false })).toHaveCount(0);
    if (ex.response_mode === "choice")
      await page.getByLabel(ex.answer, { exact: true }).check();
    else
      await page
        .getByRole("textbox")
        .fill(
          ex.response_mode === "essay"
            ? `${ex.answer}\n내가 생각한 이유: ${ex.explanation}`
            : ex.answer,
        );
    await page
      .getByRole("button", {
        name:
          ex.response_mode === "essay"
            ? "답 저장하고 해설 비교하기"
            : "답 확인하기",
        exact: true,
      })
      .click();
    await expect(
      page.getByRole("heading", {
        name:
          ex.response_mode === "essay"
            ? "다음에 다시 꺼내 볼게요."
            : "작은 한 걸음, 완료!",
      }),
    ).toBeVisible();
    if (ex.response_mode === "essay") reviewed++;
    else correct++;
    await page.getByRole("button", { name: "다음으로", exact: true }).click();
  }
  const first = curriculum.exercises[0];
  await expect(page.locator("#question-title")).toHaveText(first.title);
  await page
    .getByLabel(
      first.choices.find((c) => c !== first.answer)!,
      { exact: true },
    )
    .check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("한 번 더 생각해 볼까요?")).toBeVisible();
  await page.getByRole("button", { name: /힌트 보기/ }).click();
  await expect(page.getByText(first.hints[0], { exact: false })).toBeVisible();
  await page.getByLabel(first.answer, { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
  correct++;
  await page.screenshot({
    path: `test-results/${test.info().project.name}-feedback.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "다음으로" }).click();
  await page.getByRole("textbox").fill("(2,3)");
  await expect(page.getByText("입력한 답을 저장했어요.")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "이어서 학습하기" }).click();
  await expect(page.getByRole("textbox")).toHaveValue("(2,3)");
  await solve();
  await page.getByRole("button", { name: "해설 보고 마치기" }).click();
  reviewed++;
  await page.getByRole("button", { name: "다음으로" }).click();
  await solve();
  await solve();
  await expect(
    page.getByRole("heading", { name: "오늘의 한 걸음, 잘 마쳤어요." }),
  ).toBeVisible();
  await expect(today).toContainText("오늘 총 5문제");
  await page.getByRole("button", { name: "오늘 학습으로 돌아가기" }).click();
  await expect(lifetime).toContainText("5문제 풀이");
  await page.getByRole("button", { name: "추가로 5문제 풀기" }).click();
  await solve();
  await page.reload();
  await expect(today).toContainText("오늘 총 6문제");
  await expect(lifetime).toContainText("6문제 풀이");
  await page.getByRole("button", { name: "오늘 학습 돌아보기" }).click();
  await expect(page.locator(".summary-list > li")).toHaveCount(6);
  await page.getByRole("button", { name: "추가 학습 이어서 풀기" }).click();
  for (let i = 0; i < 4; i++) await solve();
  await expect(page.locator(".summary-list > li")).toHaveCount(10);
  await expect(today).toContainText("오늘 총 10문제");
  await page.getByRole("button", { name: "추가로 5문제 풀기" }).click();
  for (let i = 0; i < 5; i++) await solve();
  await expect(page.locator(".summary-list > li")).toHaveCount(15);
  await expect(page.locator(".summary-stats")).toContainText(
    `${correct}정답으로 마침${reviewed}해설로 배움`,
  );
  await page.getByRole("button", { name: "나의 기록" }).click();
  await expect(lifetime).toContainText("15문제 풀이");
  await expect(
    page.getByRole("heading", { name: "내 학습 기록과 백업" }),
  ).toBeVisible();
  await expect(page.locator(".history-session")).toHaveCount(3);
  await page.locator(".history-session").first().locator("summary").click();
  await expect(page.locator(".history-session").first()).toContainText(
    "내 답안:",
  );
  await page.getByText("개념별 학습 경로", { exact: true }).click();
  await expect(page.locator(".concept-grid article")).toHaveCount(18);
  await expect(page.locator(".concept-grid")).toContainText("관찰 중");
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
  await page.route("**/api/dashboard", (r) => r.abort());
  await page.goto("./");
  await expect(page.getByRole("alert")).toContainText("연결하지 못했어요");
  await page.unroute("**/api/dashboard");
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
