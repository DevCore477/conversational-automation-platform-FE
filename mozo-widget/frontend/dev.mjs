// Tiny static dev server that serves src/ on http://localhost:5175 (override via PORT).
// Defaults to widget/index.html, also serves admin-config/index.html.
// CORS is wide open so the page can call your local backend.

import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const SELF_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SELF_DIR, "src");
const PORT = Number(process.env.PORT) || 5175;

// Not part of the upload bundle (lives outside src/) — stands in for the Mozo
// host so the widget's postMessage handshake can be exercised locally.
const HOST_SIMULATOR = join(SELF_DIR, "host-simulator.html");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg"
};

createServer((req, res) => {
  const reqUrl = req.url === "/" ? "/widget/index.html" : req.url.split("?")[0];

  if (reqUrl === "/host-simulator.html") {
    try {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });
      createReadStream(HOST_SIMULATOR).pipe(res);
    } catch {
      res.writeHead(404);
      res.end("Not found: " + reqUrl);
    }
    return;
  }

  const url  = reqUrl;
  const file = normalize(join(ROOT, url));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }

  try {
    const s = statSync(file);
    if (s.isDirectory()) throw 0;

    res.writeHead(200, {
      "Content-Type": TYPES[extname(file)] || "application/octet-stream",
      "Access-Control-Allow-Origin": "*"
    });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404);
    res.end("Not found: " + url);
  }
}).listen(PORT, () => {
  console.log("Dev server running:");
  console.log("  Widget:       http://localhost:" + PORT + "/widget/index.html");
  console.log("  Admin config: http://localhost:" + PORT + "/admin-config/index.html");
  console.log("  Host sim:     http://localhost:" + PORT + "/host-simulator.html");
});
