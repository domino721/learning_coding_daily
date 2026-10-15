import { test, expect } from "@playwright/test";

test("mobile daily learning persists, supports hints and distinguishes revealed answers", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "오늘도, 가볍게 한 걸음 더." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /코딩테스트/ })).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: `test-results/${test.info().project.name}-home.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await expect(
    page.getByRole("heading", { name: "필요한 열만 꺼내기" }),
  ).toBeVisible();
  await page.getByLabel("df.amount()", { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("한 번 더 생각해 볼까요?")).toBeVisible();
  await page.getByRole("button", { name: /힌트 보기/ }).click();
  await expect(
    page.getByText("대괄호 안에 필요한 열의 이름을 넣어요."),
  ).toBeVisible();
  await page.getByLabel('df["amount"]', { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(
    page.getByRole("heading", { name: "작은 한 걸음, 완료!" }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/${test.info().project.name}-feedback.png`,
    fullPage: true,
  });
  await page.reload();
  await page.getByRole("button", { name: "이어서 학습하기" }).click();
  await expect(
    page.getByRole("heading", { name: "조건에 맞는 행 찾기" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "해설 보고 마치기" }).click();
  await expect(
    page.getByRole("heading", { name: "다음에 다시 꺼내 볼게요." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "다음으로" }).click();
  await page.getByLabel("1", { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
  await page.getByRole("button", { name: "다음으로" }).click();
  await page.getByLabel("9000", { exact: true }).check();
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
  await page.getByRole("button", { name: "다음으로" }).click();
  await page.getByLabel("빈칸에 들어갈 답").fill("sum");
  await page.getByRole("button", { name: "답 확인하기" }).click();
  await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
  await page.getByRole("button", { name: "다음으로" }).click();
  await expect(
    page.getByRole("heading", { name: "오늘의 한 걸음, 잘 마쳤어요." }),
  ).toBeVisible();
  await expect(page.locator(".summary-stats")).toContainText(
    "4정답으로 마침1해설로 배움",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: `test-results/${test.info().project.name}-summary.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "오늘 학습으로 돌아가기" }).click();
  await page.getByRole("button", { name: "오늘 학습 돌아보기" }).click();
  await expect(
    page.getByRole("heading", { name: "오늘의 한 걸음, 잘 마쳤어요." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "나의 기록" }).click();
  await expect(page.getByText("1일 학습했어요")).toBeVisible();
  await expect(page.getByText("지금까지 만난 문제")).toContainText("5개");
  expect(errors).toEqual([]);
});

test("small screen and network failures keep a recovery action", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const onDevice = test.info().project.name === "mobile-web";
  if (onDevice) {
    await page.goto("./");
    await expect(
      page.getByText("이 기기의 브라우저에 학습 기록이 저장돼요.", {
        exact: false,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.evaluate(() =>
      localStorage.setItem("learning-coding-daily:v1", "invalid"),
    );
    await page.reload();
    await expect(page.getByRole("alert")).toContainText(
      "저장된 학습 기록을 읽지 못했어요",
    );
    expect(
      await page.evaluate(() =>
        localStorage.getItem("learning-coding-daily:v1"),
      ),
    ).toBe("invalid");
    return;
  }
  await page.route("**/api/dashboard", (route) => route.abort());
  await page.goto("./");
  await expect(page.getByRole("alert")).toContainText("연결하지 못했어요");
  await expect(page.getByRole("button", { name: "다시 연결" })).toBeEnabled();
  await page.unroute("**/api/dashboard");
  await page.getByRole("button", { name: "다시 연결" }).click();
  await expect(
    page.getByRole("button", {
      name: /오늘 학습 (시작하기|돌아보기)|이어서 학습하기/,
    }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
