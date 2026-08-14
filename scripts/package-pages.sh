#!/usr/bin/env bash
set -euo pipefail

output=${1:-dist}
case "$output" in
  "" | "." | "/")
    echo "Refusing unsafe output directory: $output" >&2
    exit 1
    ;;
esac

public_files=(
  decision-tree.js
  hall-of-shame-data.js
  hall-of-shame-ui.js
  hall-of-shame.html
  index.html
  logo.svg
  og-image.png
  styles.css
  ui.js
)

# git archive reads committed files only. Local tooling, credentials, and
# untracked state cannot leak into the Pages upload.
git ls-files --error-unmatch -- "${public_files[@]}" >/dev/null

temporary=$(mktemp -d)
trap 'rm -rf -- "$temporary"' EXIT
git archive --format=tar HEAD -- "${public_files[@]}" | tar -xf - -C "$temporary"

expected=$(printf '%s\n' "${public_files[@]}" | LC_ALL=C sort)
actual=$(find "$temporary" -type f -printf '%P\n' | LC_ALL=C sort)
if [[ "$actual" != "$expected" ]]; then
  echo "Pages artifact does not match the public-file allowlist." >&2
  diff -u <(printf '%s\n' "$expected") <(printf '%s\n' "$actual") >&2 || true
  exit 1
fi

mkdir -p -- "$(dirname -- "$output")"
rm -rf -- "$output"
mv -- "$temporary" "$output"
trap - EXIT
printf 'Packaged %s tracked public files in %s.\n' "${#public_files[@]}" "$output"
