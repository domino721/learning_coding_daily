import { build } from "vite";
import { mkdtemp, readFile, writeFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const dir = await mkdtemp(path.join(os.tmpdir(), "learning-guide-"));
try {
  await build({
    configFile: false,
    build: {
      outDir: dir,
      emptyOutDir: true,
      lib: {
        entry: "src/design.ts",
        name: "LearningDesign",
        formats: ["iife"],
        fileName: () => "guide.js",
      },
    },
  });
  const files = await readdir(dir);
  const css = (
    await Promise.all(
      files
        .filter((f) => f.endsWith(".css"))
        .map((f) => readFile(path.join(dir, f), "utf8")),
    )
  ).join("\n");
  const js = await readFile(path.join(dir, "guide.js"), "utf8");
  let html = await readFile("design.html", "utf8");
  html = html
    .replace(
      '<link rel="stylesheet" href="/src/design.css"/>',
      `<style>${css}</style>`,
    )
    .replace(
      /<link rel="stylesheet" href="\/src\/design.css"\s*\/>/,
      `<style>${css}</style>`,
    );
  html = html.replace(
    /<script type="module" src="\/src\/design.ts"><\/script>/,
    `<script>${js.replace(/<\/script/gi, "<\\/script")}</script>`,
  );
  const output = process.argv[2] ?? "/tmp/learning-coding-design.html";
  await writeFile(output, html);
  console.log(`Standalone offline guide: ${output}`);
} finally {
  await rm(dir, { recursive: true, force: true });
}
