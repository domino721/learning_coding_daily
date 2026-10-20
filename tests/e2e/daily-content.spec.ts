import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createServer } from "node:net";
import { spawn, type ChildProcess } from "node:child_process";
import curriculum from "../../src/curriculum.json" with { type: "json" };
import firstBatch from "../../backend/content_batches/2026-10-17.json" with { type: "json" };
import sqlBatch from "../../backend/content_batches/2026-10-18.json" with { type: "json" };
import expansion from "../../curriculum/reviews/2026-10-19-expansion.json" with { type: "json" };

import daily20261020 from "../../backend/content_batches/2026-10-20.json" with { type: "json" };

import expansion20 from "../../curriculum/reviews/2026-10-20-expansion.json" with { type: "json" };

let isolatedApi: ChildProcess | undefined;
test.afterEach(async () => {
  if (isolatedApi && isolatedApi.exitCode === null) {
    const exited = new Promise<void>((resolve) =>
      isolatedApi!.once("exit", () => resolve()),
    );
    isolatedApi.kill();
    await exited;
  }
  isolatedApi = undefined;
});

for (const batch of [
  firstBatch,
  sqlBatch,
  expansion,
  daily20261020,
  expansion20,
]) {
  test(`daily batch ${batch.date}${batch === expansion20 ? " expansion" : ""} is reachable while earlier snapshots survive`, async ({
    page,
  }, testInfo) => {
    // Every batch imports and re-exports the whole growing historical catalog.
    test.slow();
    await page.emulateMedia({ reducedMotion: "reduce" });
    // This imports an entire historical catalog, so it must not share the suite's
    // personal API database with the fresh-learner and recovery scenarios.
    if (testInfo.project.name === "mobile-chromium") {
      const port = await new Promise<number>((resolve, reject) => {
        const server = createServer();
        server.on("error", reject);
        server.listen(0, "127.0.0.1", () => {
          const address = server.address();
          const port =
            typeof address === "object" && address ? address.port : 0;
          server.close(() => resolve(port));
        });
      });
      const database = testInfo.outputPath("isolated-learning.sqlite3");
      mkdirSync(dirname(database), { recursive: true });
      let startupError = "";
      isolatedApi = spawn(
        ".venv/bin/python",
        [
          "-m",
          "uvicorn",
          "backend.main:app",
          "--host",
          "127.0.0.1",
          "--port",
          String(port),
        ],
        {
          env: { ...process.env, APP_DB_PATH: database },
          stdio: ["ignore", "ignore", "pipe"],
        },
      );
      isolatedApi.stderr?.on("data", (data) => {
        startupError += data.toString();
      });
      isolatedApi.on("error", (error) => {
        startupError += error.message;
      });
      await expect
        .poll(
          async () => {
            if (isolatedApi!.exitCode !== null)
              throw new Error(`Isolated API exited: ${startupError}`);
            try {
              return (
                await fetch(`http://127.0.0.1:${port}/api/health`, {
                  signal: AbortSignal.timeout(1000),
                })
              ).ok;
            } catch {
              return false;
            }
          },
          { timeout: 15_000 },
        )
        .toBeTruthy();
      await page.route("**/api/**", async (route) => {
        const url = new URL(route.request().url());
        url.hostname = "127.0.0.1";
        url.port = String(port);
        await route.fulfill({
          response: await route.fetch({ url: url.toString() }),
        });
      });
    }
    const added = new Set(batch.exercises.map((ex) => ex.id));
    const previous = curriculum.exercises.filter((ex) => !added.has(ex.id));
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const sessions = previous.map((ex, index) => {
      const essay = ex.response_mode === "essay";
      return {
        id: `before-batch-${ex.id}`,
        track_id: "pandas",
        local_day: new Date(Date.UTC(2025, 7, 1 + index))
          .toISOString()
          .slice(0, 10),
        timezone: "Asia/Seoul",
        batch: index,
        total: 1,
        completed_count: 1,
        correct_count: essay ? 0 : 1,
        finished: true,
        items: [
          {
            ...ex,
            title: index === 0 ? "배치 추가 전 저장한 제목" : ex.title,
            explanation:
              index === 0 ? "배치 추가 전 저장한 해설" : ex.explanation,
            estimated_seconds: ex.seconds,
            status: essay ? "revealed" : "correct",
            category: "new",
            hints: [],
            hints_used: 0,
            attempts_count: essay ? 0 : 1,
            last_answer: ex.answer,
            last_correct: essay ? null : true,
            active_seconds: 30,
          },
        ],
      };
    });
    const data = {
      version: 1,
      schema_version: 2,
      learner_id: "daily-batch-test",
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
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto("./");
    await expect(
      page.getByRole("group", { name: "오늘 누적 학습" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "나의 기록", exact: true }).click();
    await page.getByLabel("백업 파일 가져오기").setInputFiles({
      name: "before-batch.json",
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
    for (const track of ["python", "sql"]) {
      const expectedCount = batch.exercises.filter(
        (ex) => (ex.domain === "SQL") === (track === "sql"),
      ).length;
      if (!expectedCount) continue;
      await page
        .getByRole("button", {
          name:
            track === "python" ? /Python 데이터 분석.*pandas/ : /SQL 행 조건/,
        })
        .click();
      await page.getByRole("button", { name: "오늘 학습 시작하기" }).click();
      for (let index = 0; index < expectedCount; index++) {
        await expect(page.locator("#question-title")).toBeVisible();
        const title = await page.locator("#question-title").innerText();
        const ex = curriculum.exercises.find((item) => item.title === title)!;
        expect(added.has(ex.id)).toBeTruthy();
        expect(solved.has(ex.id)).toBeFalsy();
        expect(ex.domain === "SQL").toBe(track === "sql");
        await expect(page.locator(".exercise-card pre")).toHaveText(ex.code);
        await expect(page.getByText(ex.concept, { exact: true })).toHaveCount(
          0,
        );
        await expect(page.getByText(ex.hints[0], { exact: true })).toHaveCount(
          0,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBeTruthy();
        if (ex.response_mode === "choice")
          await page.getByLabel(ex.answer, { exact: true }).check();
        else {
          const answer =
            batch === expansion || batch === expansion20
              ? (ex.accepted[0] ?? ex.answer.replace(/,\s+/g, ","))
              : ex.answer;
          await page.getByRole("textbox").fill(answer);
        }
        await page.getByRole("button", { name: "답 확인하기" }).click();
        await expect(page.getByText("작은 한 걸음, 완료!")).toBeVisible({
          timeout: 15_000,
        });
        solved.add(ex.id);
        await page
          .getByRole("button", { name: "다음으로", exact: true })
          .click();
        await expect(
          page.getByRole("heading", { name: title, exact: true }),
        ).toHaveCount(0);
        // Transfer practice remains capped at one per session. Larger additions
        // must be reachable through the existing optional extra-study flow.
        if (
          index + 1 < expectedCount &&
          (await page
            .getByRole("button", { name: "오늘 학습으로 돌아가기" })
            .isVisible())
        ) {
          await page.getByRole("button", { name: /추천 문제 더 풀기/ }).click();
        }
      }
      await page
        .getByRole("button", { name: "오늘 학습으로 돌아가기" })
        .click();
    }
    expect(solved).toEqual(added);
    await page.reload();
    await expect(
      page.getByRole("group", { name: "오늘 누적 학습" }),
    ).toContainText(`오늘 총 ${batch.exercises.length}문제`);
    await page.getByRole("button", { name: "나의 기록", exact: true }).click();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "백업 파일 내려받기" }).click();
    const file = await download;
    const saved = JSON.parse(await readFile((await file.path())!, "utf8"));
    const archived = saved.data.sessions.find(
      (session: { id: string }) => session.id === sessions[0].id,
    );
    expect(archived.items[0].title).toBe("배치 추가 전 저장한 제목");
    expect(archived.items[0].explanation).toBe("배치 추가 전 저장한 해설");
    expect(archived.items[0].last_answer).toBe(previous[0].answer);
    for (const id of added)
      expect(
        saved.data.sessions
          .flatMap((s: { items: { id: string; status: string }[] }) => s.items)
          .find((i: { id: string }) => i.id === id).status,
      ).toBe("correct");
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `test-results/${test.info().project.name}-codex-${batch.date}${batch === expansion20 ? "-expansion" : ""}-records.png`,
      fullPage: true,
    });
  });
}
