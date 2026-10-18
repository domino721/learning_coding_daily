import { test, expect } from "@playwright/test";

test("account connection is opt-in and a real CORS sync can be revoked", async ({
  page,
  request,
}) => {
  test.skip(
    test.info().project.name !== "mobile-web",
    "Optional connection belongs to the device web app",
  );
  let external = 0;
  page.on("request", (r) => {
    if (r.url().startsWith("http://127.0.0.1:8002")) external++;
  });
  await page.goto("./");
  await page.getByRole("button", { name: "나의 기록" }).click();
  expect(external).toBe(0);
  await page
    .getByText("선택한 서버에 계정 연결·동기화", { exact: true })
    .click();
  await page
    .getByLabel("계정 서버 주소", { exact: true })
    .fill("http://127.0.0.1:8002");
  await page.getByLabel("아이디", { exact: true }).fill(`e2e-${Date.now()}`);
  await page
    .getByLabel("비밀번호 (12자 이상)", { exact: true })
    .fill("e2e-password-123456");
  await page
    .getByLabel("지정한 서버에 본인의 기록을 전송하고 합치는 데 동의합니다.")
    .check();
  await page.getByRole("button", { name: "계정 만들고 연결" }).click();
  await expect(page.getByText("연결 서버:", { exact: false })).toBeVisible();
  await expect(
    page.getByText("복구 코드를 기기 밖의 안전한 곳에 보관하세요:", {
      exact: false,
    }),
  ).toBeVisible();
  const token = await page.evaluate(
    () =>
      JSON.parse(
        sessionStorage.getItem("learning-coding-daily:sync-connection")!,
      ).token as string,
  );
  expect(
    (
      await request.get("http://127.0.0.1:8002/api/backup", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).status(),
  ).toBe(200);
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "로그인하고 동기화" }),
  ).toBeVisible();
  expect(
    (
      await request.get("http://127.0.0.1:8002/api/backup", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).status(),
  ).toBe(401);
});
