import { test, expect } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };
import { enterAnswer } from "./answer";

// CR-019: 터미널·Git is its own track. Its first day draws only on the two root concepts (paths;
// spaces, quotes and *), terminal output options keep their line breaks, and the track survives a reload.
test("터미널·Git track starts from paths and quoting on a 320px phone", async ({
  page,
}, testInfo) => {
  // Device mode keeps this learner isolated; tests/test_api.py covers the server track.
  test.skip(testInfo.project.name !== "mobile-web", "device-mode UI flow");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  const terminal = page.getByRole("button", { name: /터미널·Git/ });
  const count = curriculum.tracks.find(
    (track) => track.id === "terminal-git",
  )!.exercise_count;
  await expect(terminal).toContainText(`${count}문제`);
  await terminal.click();
  await expect(terminal).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#daily-title")).toHaveText("터미널·Git");
  await page.reload();
  await expect(
    page.getByRole("button", { name: /터미널·Git/ }),
  ).toHaveAttribute("aria-pressed", "true");
  // Four track cards still leave the start button above the fixed navigation.
  const start = page.getByRole("button", { name: "오늘 학습 시작하기" });
  const nav = await page.locator(".bottom-nav").boundingBox();
  const button = await start.boundingBox();
  expect(button!.y + button!.height).toBeLessThanOrEqual(nav!.y);
  await start.click();
  await expect(page.locator("#question-title")).toBeVisible();
  const roots = new Set(["sh-path", "sh-words"]);
  const served: string[] = [];
  while (await page.locator("#question-title").count()) {
    const title = await page.locator("#question-title").innerText();
    const ex = curriculum.exercises.find((item) => item.title === title)!;
    expect(ex.domain).toBe("터미널");
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
    if (ex.kind === "choice") {
      // Options may differ only in spacing (echo, git status columns): pick by position, and
      // check that the option shows the output with its line breaks and spaces.
      const option = page
        .locator(".choices .choice")
        .nth(ex.choices.indexOf(ex.answer));
      expect(
        await option
          .locator("code")
          .evaluate((element) => (element as HTMLElement).innerText),
      ).toBe(ex.answer);
      await option.locator("input").check();
    } else await enterAnswer(page, ex);
    await page.getByRole("button", { name: "답 확인하기" }).click();
    await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible();
    await page.getByRole("button", { name: "다음으로", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toHaveCount(0);
  }
  expect(served).toHaveLength(5);
  expect(served[0]).toBe("sh-path-01");
  await expect(page.getByText("터미널·Git · 오늘 풀이 결과")).toBeVisible();
  expect(errors).toEqual([]);
});
