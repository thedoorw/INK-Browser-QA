#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

SHA40 = re.compile(r"^[0-9a-f]{40}$")
SHA256 = re.compile(r"^[0-9a-f]{64}$")

def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def add(errors, condition, message):
    if not condition:
        errors.append(message)

def main():
    ap = argparse.ArgumentParser(description="Validate AI development production-line state without external dependencies.")
    ap.add_argument("state")
    ap.add_argument("transitions")
    ap.add_argument("--evidence")
    ap.add_argument("--repo-root", default=".")
    args = ap.parse_args()

    state = load(args.state)
    trans = load(args.transitions)
    evidence = load(args.evidence) if args.evidence else None
    errors = []

    required = ["schema", "schema_version", "program_id", "task_id", "state", "current_owner", "next_owner", "authority", "identity", "required_evidence_layers", "user_checkpoint", "open_blockers", "transition_history", "allowed_transitions"]
    for key in required:
        add(errors, key in state, f"missing required state field: {key}")

    current = state.get("state")
    legal = trans.get("states", {})
    add(errors, current in legal, f"unknown state: {current}")
    if current in legal:
        add(errors, state.get("allowed_transitions") == legal[current], "allowed_transitions does not exactly match transition authority")

    add(errors, isinstance(state.get("current_owner"), str) and bool(state.get("current_owner")), "current_owner must be one non-empty string")
    add(errors, isinstance(state.get("next_owner"), str) and bool(state.get("next_owner")), "next_owner must be one non-empty string")

    identity = state.get("identity", {})
    base_sha = identity.get("base_sha")
    target_sha = identity.get("target_sha")
    add(errors, isinstance(base_sha, str) and bool(SHA40.match(base_sha)), "identity.base_sha must be a 40-char git SHA")
    if target_sha is not None:
        add(errors, isinstance(target_sha, str) and bool(SHA40.match(target_sha)), "identity.target_sha must be null or a 40-char git SHA")

    artifact = identity.get("artifact") or {}
    deployment = identity.get("deployment") or {}
    browser = identity.get("browser_loaded") or {}
    artifact_verified = artifact.get("status") == "VERIFIED"
    deployment_verified = deployment.get("status") == "VERIFIED"
    browser_verified = browser.get("status") == "VERIFIED"

    if current in {"ARTIFACT_READY", "REVIEWING", "USER_CHECKPOINT", "ACCEPTED"}:
        add(errors, target_sha is not None, f"{current} requires identity.target_sha")
        add(errors, artifact_verified, f"{current} requires VERIFIED artifact identity")
        add(errors, bool(SHA256.match(str(artifact.get("sha256", "")))), f"{current} requires artifact.sha256")

    add(errors, not deployment_verified or artifact_verified, "deployment cannot be VERIFIED before artifact identity")
    add(errors, not browser_verified or deployment_verified, "browser_loaded cannot be VERIFIED before deployment identity")

    if artifact_verified and artifact.get("path"):
        p = Path(args.repo_root) / artifact["path"]
        if p.exists():
            digest = hashlib.sha256(p.read_bytes()).hexdigest()
            add(errors, digest == artifact.get("sha256"), f"artifact digest mismatch: expected {artifact.get('sha256')} actual {digest}")

    hist = state.get("transition_history", [])
    add(errors, isinstance(hist, list) and len(hist) > 0, "transition_history must not be empty")
    for i, item in enumerate(hist):
        src, dst = item.get("from"), item.get("to")
        add(errors, src in legal and dst in legal.get(src, []), f"illegal transition_history[{i}]: {src}->{dst}")
    if hist:
        add(errors, hist[-1].get("to") == current, "last transition destination must equal current state")

    blockers = state.get("open_blockers", [])
    if current == "BLOCKED":
        add(errors, bool(blockers), "BLOCKED requires at least one blocker")
        add(errors, all(isinstance(b, dict) and b.get("owner") for b in blockers), "every blocker requires an owner")

    required_layers = set(state.get("required_evidence_layers", []))
    if current in {"REVIEWING", "USER_CHECKPOINT", "ACCEPTED"}:
        add(errors, evidence is not None, f"{current} requires --evidence manifest")
    if evidence is not None:
        records = evidence.get("records", [])
        verified_layers = {r.get("layer") for r in records if r.get("status") == "VERIFIED"}
        if current in {"REVIEWING", "USER_CHECKPOINT", "ACCEPTED"}:
            add(errors, required_layers.issubset(verified_layers), f"missing VERIFIED evidence layers: {sorted(required_layers - verified_layers)}")
        for rec in records:
            add(errors, rec.get("proves") not in (None, [], ""), f"evidence {rec.get('evidence_id')} must explicitly state proves")
            add(errors, rec.get("does_not_prove") not in (None, []), f"evidence {rec.get('evidence_id')} must explicitly state does_not_prove")

    checkpoint = state.get("user_checkpoint", {})
    if current == "ACCEPTED" and checkpoint.get("required"):
        add(errors, checkpoint.get("status") == "ACCEPTED", "ACCEPTED requires accepted USER checkpoint when required")
        if evidence is not None:
            add(errors, any(r.get("layer") == "USER" and r.get("status") == "VERIFIED" for r in evidence.get("records", [])), "ACCEPTED requires VERIFIED USER evidence when checkpoint required")

    if errors:
        print("AI_DEV_STATE INVALID")
        for e in errors:
            print("-", e)
        return 1
    print("AI_DEV_STATE VALID")
    print(f"task={state['task_id']} state={current} current_owner={state['current_owner']} next_owner={state['next_owner']}")
    print("allowed_transitions=" + ",".join(state.get("allowed_transitions", [])))
    return 0

if __name__ == "__main__":
    sys.exit(main())
