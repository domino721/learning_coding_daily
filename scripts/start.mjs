// One command for local use: install, build, and serve the app on a single process.
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cache = existsSync("/workspace/.cache")
  ? "/workspace/.cache"
  : path.join(os.tmpdir(), "learning-coding-daily-cache");
const environment = {
  ...process.env,
  npm_config_cache: path.join(cache, "npm"),
  UV_CACHE_DIR: process.env.UV_CACHE_DIR || path.join(cache, "uv"),
  APP_SERVE_FRONTEND: "1",
};
const port = 8000;
const address = `http://127.0.0.1:${port}`;
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: environment,
    stdio: "inherit",
    // Windows .cmd files require the system shell. All arguments here are fixed.
    shell: process.platform === "win32" && command === npm,
  });
  if (result.error || result.status !== 0) {
    console.error("\n시작하지 못했어요. 위 오류를 확인해 주세요.");
    process.exit(result.status || 1);
  }
}

async function available() {
  await new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(port, "127.0.0.1", () => probe.close(resolve));
  });
}

try {
  await available();
} catch {
  console.error(
    "8000 포트를 이미 사용하고 있어요. 이전에 실행한 앱이 있다면 그 터미널에서 Ctrl+C로 종료한 뒤 다시 시작해 주세요.",
  );
  process.exit(1);
}
if (spawnSync("uv", ["--version"], { stdio: "ignore" }).status !== 0) {
  console.error(
    "Python 환경 도구 uv가 필요합니다. README의 PC 실행 준비 항목을 먼저 진행해 주세요.",
  );
  process.exit(1);
}
console.log(
  "\n매일코딩을 준비하고 있어요. 처음에는 의존성 설치로 시간이 조금 걸립니다.\n",
);
const fingerprint = createHash("sha256")
  .update(readFileSync(path.join(root, "package-lock.json")))
  .digest("hex");
const stamp = path.join(root, "node_modules", ".learning-coding-lock");
if (!existsSync(stamp) || readFileSync(stamp, "utf8") !== fingerprint) {
  run(npm, ["ci"]);
  mkdirSync(path.dirname(stamp), { recursive: true });
  writeFileSync(stamp, fingerprint);
}
run("uv", ["sync", "--frozen"]);
run(npm, ["run", "build"]);
const python = path.join(
  root,
  ".venv",
  process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
);
const server = spawn(
  python,
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
    cwd: root,
    env: environment,
    stdio: "inherit",
  },
);
let stopping = false;
function stop() {
  stopping = true;
  server.kill("SIGTERM");
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.on("exit", (code) => {
  process.exitCode = stopping ? 0 : (code ?? 1);
});
let ready = false;
for (let i = 0; i < 100; i++) {
  if (server.exitCode !== null || stopping) break;
  try {
    const response = await fetch(`${address}/api/health`, {
      signal: AbortSignal.timeout(1000),
    });
    if (response.ok && (await response.json()).status === "ok") {
      ready = true;
      break;
    }
  } catch {
    /* Wait for the process to finish starting. */
  }
  await new Promise((resolve) => setTimeout(resolve, 150));
}
if (ready) {
  console.log(
    "\n시작됐어요! 이 터미널을 열어 두세요. 종료하려면 Ctrl+C를 누르세요.",
  );
  console.log("PC에서 실행했다면 브라우저가 자동으로 열립니다.");
  if (process.stdin.isTTY && process.env.LEARNING_OPEN_BROWSER !== "0") {
    const command =
      process.platform === "win32"
        ? "cmd.exe"
        : process.platform === "darwin"
          ? "open"
          : "xdg-open";
    const args =
      process.platform === "win32"
        ? ["/d", "/c", "start", "", address]
        : [address];
    const browser = spawn(command, args, { stdio: "ignore" });
    browser.on("error", () =>
      console.log(
        "브라우저 자동 실행을 지원하지 않는 환경입니다. README를 확인해 주세요.",
      ),
    );
    browser.unref();
  }
} else if (!stopping) {
  console.error("서버 준비를 확인하지 못했어요. 위 오류를 확인해 주세요.");
  stop();
  process.exitCode = 1;
}
