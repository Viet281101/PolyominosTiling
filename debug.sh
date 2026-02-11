#!/usr/bin/env bash
set -euo pipefail

PORT=5124

usage() {
  echo "Usage: $0 [-p|--port PORT] [PORT]"
  exit 1
}

# parse optional args
while [ "$#" -gt 0 ]; do
  case "$1" in
    -p|--port) PORT="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) 
      if [[ "$1" =~ ^[0-9]+$ ]]; then PORT="$1"; shift; else echo "Unknown arg: $1"; usage; fi
      ;;
  esac
done

if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
  echo "⚠️  Port must be a number"; exit 1
fi

PY_CMD=""
PY_VER=""

for cmd in python3 python; do
  if command -v "$cmd" >/dev/null 2>&1; then
    major=$("$cmd" -c 'import sys; print(sys.version_info[0])' 2>/dev/null || echo "")
    if [ "$major" = "3" ]; then
      PY_CMD=("$cmd" "-m" "http.server")
      PY_VER=3
      break
    elif [ "$major" = "2" ]; then
      PY_CMD=("$cmd" "-m" "SimpleHTTPServer")
      PY_VER=2
      break
    fi
  fi
done

if [ -z "${PY_CMD[*]:-}" ]; then
  echo -e "⚠️  Python not found on PATH.\nPlease install Python 3 and re-run this script.\n\nCommon install commands (Linux):\n  Debian/Ubuntu: sudo apt update && sudo apt install -y python3\n  Fedora: sudo dnf install -y python3\n  Arch: sudo pacman -Syu python\nIf you want 'python' to point to Python 3 on Debian/Ubuntu: sudo apt install -y python-is-python3"
  exit 1
fi

echo "🔧 Starting HTTP server (Python ${PY_VER}) on port ${PORT}..."
exec "${PY_CMD[@]}" "$PORT"
