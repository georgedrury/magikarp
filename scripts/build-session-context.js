// build-session-context.js — regenerate hooks/session-context.json from core/magikarp.md.
//
// The always-on core is injected at session start by a SessionStart hook that
// `cat`s the prebuilt JSON file below — so the shipped hook has ZERO runtime
// dependency (no node/python/jq on the user's PATH). Claude Code is fussy about
// the hook's stdout: it must be (1) a single COMPACT line and (2) ASCII-only.
// A pretty-printed or raw-UTF-8 payload is silently ignored and nothing injects.
// So we escape every non-ASCII char here, at build time.
//
// Usage:
//   node scripts/build-session-context.js          # regenerate the file
//   node scripts/build-session-context.js --check   # CI: exit 1 if out of sync

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const coreFile = path.join(repoRoot, 'core', 'magikarp.md');
const outFile = path.join(repoRoot, 'hooks', 'session-context.json');

function build() {
  const core = fs.readFileSync(coreFile, 'utf8');
  const json = JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: core,
    },
  });
  // JSON.stringify already escapes control chars and quotes. Escape every
  // remaining non-ASCII UTF-16 unit (em-dashes, curly quotes) to \uXXXX so the
  // single line stays ASCII-only — Claude Code drops raw-UTF-8 hook output.
  let out = '';
  for (let i = 0; i < json.length; i++) {
    const code = json.charCodeAt(i);
    out += code > 126 ? '\\u' + code.toString(16).padStart(4, '0') : json[i];
  }
  return out;
}

const built = build();

if (process.argv.includes('--check')) {
  const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
  if (current !== built) {
    console.error('FAIL: hooks/session-context.json is out of sync with core/magikarp.md.');
    console.error('      Run: node scripts/build-session-context.js');
    process.exit(1);
  }
  console.log('PASS  session-context.json in sync with core');
  process.exit(0);
}

fs.writeFileSync(outFile, built);
console.log(`Wrote ${path.relative(repoRoot, outFile)} (${built.length} bytes, ASCII-only, single line)`);
