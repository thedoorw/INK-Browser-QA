#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EV="$ROOT/Runtime_Evidence/WP8B"
LOGDIR="$EV/unit-files-final"
mkdir -p "$LOGDIR"
cd "$ROOT"
status=0
total=0
passed=0
failed_files=()
: > "$EV/full-unit-tests-by-file-summary.txt"
rm -f "$EV/full-unit-tests-by-file.done"
for f in $(find tests/unit -maxdepth 1 -name '*.test.mjs' | sort); do
  b=$(basename "$f" .test.mjs)
  echo "=== $f ===" >> "$EV/full-unit-tests-by-file-summary.txt"
  if node --test "$f" > "$LOGDIR/$b.log" 2>&1; then
    p=$(grep -E '^# pass ' "$LOGDIR/$b.log" | tail -1 | awk '{print $3}')
    t=$(grep -E '^# tests ' "$LOGDIR/$b.log" | tail -1 | awk '{print $3}')
    p=${p:-0}; t=${t:-0}
    echo "PASS $b $p/$t" >> "$EV/full-unit-tests-by-file-summary.txt"
    passed=$((passed+p)); total=$((total+t))
  else
    rc=$?
    echo "FAIL $b rc=$rc" >> "$EV/full-unit-tests-by-file-summary.txt"
    failed_files+=("$b:$rc")
    status=1
  fi
done
{
 echo "TOTAL_PASS=$passed"
 echo "TOTAL_TESTS=$total"
 echo "FAILED_FILES=${failed_files[*]-}"
 echo "STATUS=$status"
} >> "$EV/full-unit-tests-by-file-summary.txt"
echo "$status" > "$EV/full-unit-tests-by-file.done"
exit "$status"
