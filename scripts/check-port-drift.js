// check-port-drift.js — fails CI when a rules/ port drifts from the core.
//
// Usage:
//   node scripts/check-port-drift.js
//
// Every file in rules/, plus the root AGENTS.md, is a port of core/magikarp.md. The Splash test, the
// never-cut list, the markers, and the evolve commands must be identical
// across ports — only syntax and host-specific config keys may vary. This
// script asserts each port still carries the normative anchors below and
// exits 1 if any port is missing any of them, so the divergence is caught
// before it ships. It uses only built-in 'fs'/'path' — no dependency, by
// design (nothing asked for one).

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const coreFile = path.join(repoRoot, 'core', 'magikarp.md');
const rulesDir = path.join(repoRoot, 'rules');

// The four markers must survive byte-exact — they are grep anchors and the
// asterisks / vowel counts are load-bearing. Everything else can be matched
// case-insensitively, since a port may legitimately re-case prose.
const EXACT_MARKERS = ['*splash*', 'GYAOOO:', 'GYAOOOOO:', 'FORCE-EVOLVED'];

const CASE_INSENSITIVE_ANCHORS = [
  // Never-cut list keywords
  'correctness',
  'validation',
  'error handling',
  'security',
  'integrity',
  'accessibility',
  // Both Splash-test questions' key phrasing
  'did the spec ask for this',
  'single use',
  // Identity
  'Gyarados',
  'evolve',
  // The Splash flavour line — restraint is announced, not silent
  'but nothing happened',
];

function loadPorts() {
  const entries = fs.readdirSync(rulesDir);
  const ports = entries
    .filter((name) => fs.statSync(path.join(rulesDir, name)).isFile())
    .map((name) => ({
      name,
      content: fs.readFileSync(path.join(rulesDir, name), 'utf8'),
    }));
  // AGENTS.md is the universal port at the repo root — held to the same anchors.
  const agentsFile = path.join(repoRoot, 'AGENTS.md');
  if (fs.existsSync(agentsFile)) {
    ports.push({ name: 'AGENTS.md', content: fs.readFileSync(agentsFile, 'utf8') });
  }
  return ports;
}

// Returns the list of anchors a port is missing (empty list = clean port).
function missingAnchors(content) {
  const lower = content.toLowerCase();
  const missing = [];

  for (const marker of EXACT_MARKERS) {
    if (!content.includes(marker)) missing.push(marker);
  }
  for (const anchor of CASE_INSENSITIVE_ANCHORS) {
    if (!lower.includes(anchor.toLowerCase())) missing.push(anchor);
  }

  return missing;
}

function main() {
  if (!fs.existsSync(coreFile)) {
    console.error(`FAIL: core not found at ${coreFile}`);
    process.exit(1);
  }
  // Read the core so a missing/renamed source of truth fails loudly too.
  fs.readFileSync(coreFile, 'utf8');

  const ports = loadPorts();
  if (ports.length === 0) {
    console.error(`FAIL: no ports found in ${rulesDir}`);
    process.exit(1);
  }

  let anyFailed = false;

  for (const port of ports) {
    const missing = missingAnchors(port.content);
    if (missing.length === 0) {
      console.log(`PASS  ${port.name}`);
    } else {
      anyFailed = true;
      console.log(`FAIL  ${port.name} — missing: ${missing.join(', ')}`);
    }
  }

  console.log(`\n${ports.length} port(s) checked.`);
  process.exit(anyFailed ? 1 : 0);
}

main();
