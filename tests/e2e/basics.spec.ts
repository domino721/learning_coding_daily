import { test, expect } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };
import { enterAnswer } from "./answer";

// CR-017: Python 기초 is its own track. Its first day draws only on the three root concepts,
// never mixes with data-analysis items, and the chosen track survives a reload.
test("Python 기초 track starts from values, strings and lists on a 320px phone", async ({
  page,
}, testInfo) => {
  // Device mode keeps this learner isolated; tests/test_api.py covers the server track.
  test.skip(testInfo.project.name !== "mobile-web", "device-mode UI flow");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  const basics = page.getByRole("button", { name: /Python 기초/ });
  const count = curriculum.tracks.find(
    (track) => track.id === "python-basics",
  )!.exercise_count;
  await expect(basics).toContainText(`${count}문제`);
  await expect(
    page.getByRole("button", { name: /Python 데이터 분석.*pandas/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await basics.click();
  await expect(basics).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#daily-title")).toHaveText("Python 기초");
  await page.reload();
  await expect(
    page.getByRole("button", { name: /Python 기초/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
  await expect(page.locator("#question-title")).toBeVisible();
  const roots = new Set(["py-values", "py-str", "py-list"]);
  const served: string[] = [];
  while (await page.locator("#question-title").count()) {
    const title = await page.locator("#question-title").innerText();
    const ex = curriculum.exercises.find((item) => item.title === title)!;
    expect(ex.domain).toBe("Python");
    expect(ex.level).toBe(1);
    expect(roots.has(ex.concept_id)).toBeTruthy();
    expect(served).not.toContain(ex.id);
    served.push(ex.id);
    await expect(page.locator(".exercise-card pre")).toHaveText(ex.code);
    // The concept name and hints stay hidden until the learner asks or answers.
    await expect(page.getByText(ex.concept, { exact: true })).toHaveCount(0);
    await expect(page.getByText(ex.hints[0], { exact: true })).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await enterAnswer(page, ex);
    await page.getByRole("button", { name: "답 확인하기" }).click();
    await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
    await page.getByRole("button", { name: "다음으로", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toHaveCount(0);
  }
  expect(served).toHaveLength(5);
  expect(served[0]).toBe("py-values-01");
  await expect(page.getByText("Python 기초 · 오늘 풀이 결과")).toBeVisible();
  expect(errors).toEqual([]);
});
