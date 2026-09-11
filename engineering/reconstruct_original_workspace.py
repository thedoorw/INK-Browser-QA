#!/usr/bin/env python3
"""Reconstruct the authoritative INK source layout from the classified repository.

The import deliberately stores PRODUCT / QA / RESEARCH / ENGINEERING / GOVERNANCE
in separate repository areas. This script recreates the original relative layout in
a disposable workspace so historical tests and build scripts can run without
rewriting their relative imports.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import shutil
from pathlib import Path


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".", help="repository root")
    parser.add_argument("--out", default=".working/original-runtime", help="disposable workspace")
    parser.add_argument("--no-verify", action="store_true", help="skip size/SHA verification")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    inventory = repo / "governance" / "INK_FILE_INVENTORY_v0.1.csv"
    out = (repo / args.out).resolve()
    if not inventory.is_file():
        raise SystemExit(f"inventory missing: {inventory}")

    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    copied = 0
    total_bytes = 0
    with inventory.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            src = repo / row["destination_path"]
            original = Path(row["original_path"])
            parts = original.parts
            rel = Path(*parts[1:]) if parts and parts[0].startswith("INK_Core_Main_Program_") else original
            dst = out / rel
            if not src.is_file():
                raise SystemExit(f"missing repository source: {src}")
            if not args.no_verify:
                expected_size = int(row["bytes"])
                if src.stat().st_size != expected_size:
                    raise SystemExit(f"size mismatch: {src}")
                if sha256(src) != row["sha256"]:
                    raise SystemExit(f"sha256 mismatch: {src}")
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            copied += 1
            total_bytes += src.stat().st_size

    print(f"RECONSTRUCT_PASS files={copied} bytes={total_bytes} workspace={out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
