import curriculum from "../../src/curriculum.json" with { type: "json" };
import { test, expect } from "@playwright/test";

test("design explorer uses the live curriculum and keeps simulations separate", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./design.html");
  await expect(
    page.getByRole("heading", { name: "문제의 난이도와 사용자의 단계는 별개" }),
  ).toBeVisible();
  // Essays and, since CR-022, the held Windows items are stored but not active.
  await expect(page.locator("#catalog-stats")).toContainText(
    String(
      curriculum.exercises.filter(
        (e) => e.response_mode !== "essay" && e.domain !== "Windows",
      ).length,
    ),
  );
  await page.locator("#concept-select").selectOption("win-path");
  await expect(page.locator("#exercise-detail")).toContainText("보류 문항");
  await page.locator("#concept-select").selectOption("ml-preprocessing");
  await expect(page.locator("#exercise-detail")).toContainText(
    "선수에서 목표까지",
  );
  await page.locator("#scenario-select").selectOption("1");
  await expect(page.locator("#simulation-result")).toContainText(
    "학습 호출의 반환",
  );
  await page.locator("#lab-records").fill("not json");
  await page.locator("#simulate").click();
  await expect(page.locator("#lab-error")).not.toBeEmpty();
  expect(errors).toEqual([]);
});

test("quality shows missing evidence and persists explicit seven-day enrollment", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "나의 기록" }).click();
  await page.getByText("학습 품질과 7일 관찰", { exact: true }).click();
  await expect(
    page.locator(".quality-grid dt").filter({ hasText: "독립 정답" }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "오늘부터 7일 관찰 시작" }).click();
  await expect(page.locator(".study-days li")).toHaveCount(7);
  await expect(page.locator(".study-days")).toContainText(
    "실제 기기 관찰 대기",
  );
  await page.reload();
  await page.getByRole("button", { name: "나의 기록" }).click();
  await page.getByText("학습 품질과 7일 관찰", { exact: true }).click();
  await expect(page.locator(".study-days li")).toHaveCount(7);
});
