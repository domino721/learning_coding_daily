import { test, expect, type Page } from "@playwright/test";
import curriculum from "../../src/curriculum.json" with { type: "json" };
import { enterAnswer } from "./answer";

// CR-019/CR-020/CR-021: 터미널, Windows and Git are their own tracks. Each first day draws only on its root
// concepts, terminal output options keep their line breaks, and the chosen track survives a reload.
async function startAboveNavigation(page: Page) {
  // Six track cards (two rows of three) still leave the start button above the fixed navigation.
  const start = page.getByRole("button", { name: "오늘 학습 시작하기" });
  const nav = await page.locator(".bottom-nav").boundingBox();
  const button = await start.boundingBox();
  expect(button!.y + button!.height).toBeLessThanOrEqual(nav!.y);
  await start.click();
  await expect(page.locator("#question-title")).toBeVisible();
}

async function solveFirstDay(page: Page, domain: string, roots: Set<string>) {
  const served: string[] = [];
  while (await page.locator("#question-title").count()) {
    const title = await page.locator("#question-title").innerText();
    const ex = curriculum.exercises.find((item) => item.title === title)!;
    expect(ex.domain).toBe(domain);
    expect(ex.level).toBe(1);
    expect(roots.has(ex.concept_id)).toBeTruthy();
    expect(served).not.toContain(ex.id);
    served.push(ex.id);
    // A line item shows its code as tappable lines instead of one block.
    if (ex.kind === "line")
      await expect(page.locator(".line-picker .code-line code")).toHaveText(
        ex.code.split("\n"),
      );
    else await expect(page.locator(".exercise-card pre")).toHaveText(ex.code);
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
  return served;
}

test("터미널 track starts from paths and quoting on a 320px phone", async ({
  page,
}, testInfo) => {
  // Device mode keeps this learner isolated; tests/test_api.py covers the server track.
  test.skip(testInfo.project.name !== "mobile-web", "device-mode UI flow");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  const terminal = page.getByRole("button", { name: /^터미널/ });
  const count = curriculum.tracks.find(
    (track) => track.id === "terminal-git",
  )!.exercise_count;
  await expect(terminal).toContainText(`${count}문제`);
  await terminal.click();
  await expect(terminal).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#daily-title")).toHaveText("터미널");
  await page.reload();
  await expect(page.getByRole("button", { name: /^터미널/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await startAboveNavigation(page);
  const served = await solveFirstDay(
    page,
    "터미널",
    new Set(["sh-path", "sh-words"]),
  );
  expect(served).toHaveLength(5);
  expect(served[0]).toBe("sh-path-01");
  await expect(page.getByText("터미널 · 오늘 풀이 결과")).toBeVisible();
  expect(errors).toEqual([]);
});

test("Git track starts on its own from status and diff on a 320px phone", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-web", "device-mode UI flow");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  const git = page.getByRole("button", { name: /^Git/ });
  const count = curriculum.tracks.find(
    (track) => track.id === "git",
  )!.exercise_count;
  await expect(git).toContainText(`${count}문제`);
  await git.click();
  await expect(git).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#daily-title")).toHaveText("Git");
  // A learner who never opened the 터미널 track still gets a full first day.
  await startAboveNavigation(page);
  const served = await solveFirstDay(
    page,
    "Git",
    new Set(["git-status", "git-diff"]),
  );
  expect(served).toHaveLength(5);
  expect(served[0].startsWith("git-status-")).toBeTruthy();
  await expect(page.getByText("Git · 오늘 풀이 결과")).toBeVisible();
  expect(errors).toEqual([]);
});

test("Windows track starts on its own from paths, files and variables on a 320px phone", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-web", "device-mode UI flow");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  const windows = page.getByRole("button", { name: /^Windows/ });
  const count = curriculum.tracks.find(
    (track) => track.id === "windows",
  )!.exercise_count;
  await expect(windows).toContainText(`${count}문제`);
  // The 터미널 track no longer counts the Windows sectors.
  await expect(page.getByRole("button", { name: /^터미널/ })).toContainText(
    `${curriculum.exercises.filter((ex) => ex.domain === "터미널").length}문제`,
  );
  await windows.click();
  await expect(windows).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#daily-title")).toHaveText("Windows");
  await page.reload();
  await expect(page.getByRole("button", { name: /^Windows/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  // A learner who never opened the 터미널 track still gets a full first day of PowerShell and cmd.
  await startAboveNavigation(page);
  const served = await solveFirstDay(
    page,
    "Windows",
    new Set(["win-path", "win-files", "win-env"]),
  );
  expect(served).toHaveLength(5);
  await expect(page.getByText("Windows · 오늘 풀이 결과")).toBeVisible();
  expect(errors).toEqual([]);
});

test("every track keeps the start button above the navigation on a 320px phone", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-web", "device-mode UI flow");
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  const nav = await page.locator(".bottom-nav").boundingBox();
  for (const track of curriculum.tracks.filter((t) => t.available)) {
    await page
      .getByRole("button", { name: new RegExp(`^${track.name}`) })
      .click();
    await expect(page.locator("#daily-title")).toHaveText(track.name);
    // Six cards in two rows and a one-line summary leave the button clear of the navigation.
    const start = await page
      .getByRole("button", { name: "오늘 학습 시작하기" })
      .boundingBox();
    expect(start!.y + start!.height, track.id).toBeLessThanOrEqual(nav!.y);
  }
});
