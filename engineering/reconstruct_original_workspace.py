#!/usr/bin/env python3
"""Reconstruct the authoritative INK source layout from the classified repository.

The import stores PRODUCT / QA / RESEARCH / ENGINEERING / GOVERNANCE separately.
This script recreates the original relative layout in a disposable workspace, first
verifying every preserved source against the import inventory, then applying optional
health-overlay files for the active work branch.
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
    parser.add_argument("--no-verify", action="store_true", help="skip authoritative size/SHA verification")
    parser.add_argument("--no-overlay", action="store_true", help="do not apply engineering/health-overlay")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    inventory = repo / "governance" / "INK_FILE_INVENTORY_v0.1.csv"
    out = (repo / args.out).resolve()
    overlay = repo / "engineering" / "health-overlay"
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

    overlay_files = 0
    if not args.no_overlay and overlay.is_dir():
        for src in overlay.rglob("*"):
            if not src.is_file():
                continue
            rel = src.relative_to(overlay)
            dst = out / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            overlay_files += 1

    print(
        f"RECONSTRUCT_PASS authoritative_files={copied} authoritative_bytes={total_bytes} "
        f"overlay_files={overlay_files} workspace={out}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
