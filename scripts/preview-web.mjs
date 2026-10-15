import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("web-dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
};
http
  .createServer(async (req, res) => {
    const pathname = new URL(req.url, "http://test").pathname;
    const prefix = "/learning_coding_daily/";
    if (!pathname.startsWith(prefix)) {
      res.writeHead(404);
      res.end();
      return;
    }
    const requested = path.resolve(
      root,
      pathname.slice(prefix.length) || "index.html",
    );
    if (!requested.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      const body = await readFile(requested);
      res.writeHead(200, {
        "Content-Type":
          types[path.extname(requested)] || "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(5175, "127.0.0.1");
