#!/usr/bin/env bash
# Create a new whiteboard video project from the template.
# Usage: new_project.sh <dir> [--vertical]
set -euo pipefail
DIR="${1:?usage: new_project.sh <dir> [--vertical]}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TPL="$HERE/../assets/template"
if [[ -e "$DIR/script.json" ]]; then echo "$DIR already has a script.json, not overwriting" >&2; exit 1; fi
mkdir -p "$DIR"
cp "$TPL/config.json" "$TPL/script.json" "$TPL/voice.json" "$TPL/scenes.js" "$TPL/brief.md" "$DIR/"
cp "$TPL/gitignore.txt" "$DIR/.gitignore"
NAME="$(basename "$DIR")"
python3 - "$DIR/config.json" "$NAME" "${2:-}" <<'PY'
import json, sys
p, name, flag = sys.argv[1], sys.argv[2], sys.argv[3]
c = json.load(open(p)); c["name"] = name
if flag == "--vertical": c["width"], c["height"], c["captionBottom"] = 1080, 1920, 120
json.dump(c, open(p, "w"), indent=2)
PY
echo "created $DIR ($( [[ "${2:-}" == "--vertical" ]] && echo 1080x1920 || echo 1920x1080 ))"
