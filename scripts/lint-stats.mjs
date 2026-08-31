#!/usr/bin/env node
/**
 * Runs next lint and prints the count of errors and warnings.
 * Usage: node scripts/lint-stats.mjs   or  npm run lint:stats
 */
import { spawn } from "child_process";

const child = spawn("npx", ["next", "lint"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
});

let output = "";
child.stdout?.on("data", (chunk) => {
  const s = chunk.toString();
  output += s;
  process.stdout.write(s);
});
child.stderr?.on("data", (chunk) => {
  const s = chunk.toString();
  output += s;
  process.stderr.write(s);
});

child.on("close", (code) => {
  // Match ESLint/Next lint format: "  7:27  Error: ..." or "  7:27  Warning: ..."
  const errorMatches = output.match(/\s+\d+:\d+\s+Error:/g);
  const warningMatches = output.match(/\s+\d+:\d+\s+Warning:/g);
  const errors = errorMatches?.length ?? 0;
  const warnings = warningMatches?.length ?? 0;

  // console.log("\n---");
  // console.log(`Errors: ${errors}, Warnings: ${warnings}`);
  process.exit(code ?? 0);
});
