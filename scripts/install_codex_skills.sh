#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/codex_skills"
TARGET_DIR="$HOME/.codex/skills"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source directory not found: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"

for skill_dir in "$SOURCE_DIR"/*; do
  [[ -d "$skill_dir" ]] || continue

  skill_name="$(basename "$skill_dir")"
  target_skill_dir="$TARGET_DIR/$skill_name"

  mkdir -p "$target_skill_dir"
  cp "$skill_dir/SKILL.md" "$target_skill_dir/SKILL.md"
  echo "Installed skill: $skill_name"
done

echo "All repo-managed Codex skills were installed to $TARGET_DIR"
