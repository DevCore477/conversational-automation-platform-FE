// Tiny "build": copy src/ -> dist/, then zip the contents of dist/ into app-bundle.zip.
// The zip is the single artifact you upload to the App Store.

import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT    = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(ROOT, "src");
const OUT_DIR = join(ROOT, "dist");
const ZIP     = join(ROOT, "app-bundle.zip");

async function ensureSrc() {
  try {
    const stats = await stat(SRC_DIR);
    if (!stats.isDirectory()) throw new Error("src/ is not a directory");
  } catch {
    throw new Error("Missing src/ directory next to build.mjs");
  }
}

async function copySrc() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await cp(SRC_DIR, OUT_DIR, { recursive: true });
}

async function zipDist() {
  await rm(ZIP, { force: true });
  // -r recursive, -X strip extra file attrs, -q quiet.
  // Run inside dist/ so the zip has widget/ and admin-config/ at the root.
  const entries = (await readdir(OUT_DIR)).filter((name) => name !== ".DS_Store");
  if (entries.length === 0) throw new Error("dist/ is empty after copy");
  execFileSync("zip", ["-rqX", ZIP, ...entries], { cwd: OUT_DIR, stdio: "inherit" });
}

async function main() {
  await ensureSrc();
  await copySrc();
  await zipDist();
  console.log("Built " + ZIP);
  console.log("Upload this zip with: POST /v4/app-store/app/:app_id/bundle  (field: bundle)");
}

main().catch((err) => {
  console.error("Build failed:", err.message);
  process.exit(1);
});
