#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 1 ]]; then
  echo "Usage: $0 [version]" >&2
  exit 1
fi

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

version_file=".asset-version"

if [[ $# -eq 1 ]]; then
  version="$1"
else
  if [[ ! -f "$version_file" ]]; then
    echo "Missing $version_file and no version argument provided." >&2
    exit 1
  fi
  version="$(tr -d '[:space:]' < "$version_file")"
fi

if [[ -z "$version" ]]; then
  echo "Version must not be empty." >&2
  exit 1
fi

if [[ "$version" != *[![:space:]]* ]]; then
  echo "Version must contain visible characters." >&2
  exit 1
fi

printf '%s\n' "$version" > "$version_file"

for file in ./*.html; do
  ASSET_VERSION="$version" perl -i -pe '
    s{(href="(?:\./)?style/style\.css)(?:\?[^"]*)?"}{$1 . "?v=" . $ENV{ASSET_VERSION} . "\""}ge;
    s{(src="\./js/[^"?]+\.js)(?:\?[^"]*)?"}{$1 . "?v=" . $ENV{ASSET_VERSION} . "\""}ge;
  ' "$file"
done

echo "Asset version updated to: $version"
