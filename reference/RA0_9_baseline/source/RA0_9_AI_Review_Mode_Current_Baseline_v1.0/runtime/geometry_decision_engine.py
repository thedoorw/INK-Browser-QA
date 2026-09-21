#!/usr/bin/env python3
from __future__ import annotations
from typing import Any

WEIGHTS={"fitQuality":30,"geometricStability":15,"structuralConsistency":15,"topologyContinuity":15,"representationComplexity":15,"editabilityReplay":10}

class ValidationResult:
    def __init__(self, passed: bool, errors: list[str]):
        self.passed=passed
        self.errors=errors


def validate_candidate(candidate: dict[str,Any]) -> ValidationResult:
    errors=[]
    gate=candidate.get("gate",{})
    checks=gate.get("checks",[])
    computed_gate=all(bool(c.get("passed")) for c in checks)
    if bool(gate.get("passed")) != computed_gate:
        errors.append(f"{candidate.get('id')}: gate.passed does not match gate checks")
    scores=candidate.get("scores",{})
    for key,max_score in WEIGHTS.items():
        value=scores.get(key)
        if not isinstance(value,(int,float)) or value < 0 or value > max_score:
            errors.append(f"{candidate.get('id')}: invalid {key}")
    computed_total=sum(scores.get(k,0) for k in WEIGHTS)
    if scores.get("total") != computed_total:
        errors.append(f"{candidate.get('id')}: total score mismatch")
    ctype=candidate.get("candidateType")
    if ctype in {"SPLINE","SPLINE_FIELD","LAYERED_SPLINE_FIELD"}:
        lower=[c for c in checks if c.get("id")=="lowerOrderRejected"]
        if not lower or not lower[0].get("passed"):
            if candidate.get("decisionState")=="selected":
                errors.append(f"{candidate.get('id')}: selected spline lacks lower-order rejection evidence")
    if "TRACE" in str(ctype).upper() and gate.get("passed"):
        errors.append(f"{candidate.get('id')}: trace candidate cannot pass formal gate")
    return ValidationResult(not errors,errors)


def validate_model(model: dict[str,Any]) -> ValidationResult:
    errors=[]
    if model.get("weights") != WEIGHTS:
        errors.append("weight model mismatch")
    unresolved=[]
    for target in model.get("targets",[]):
        ids={c.get("id") for c in target.get("candidates",[])}
        for c in target.get("candidates",[]):
            errors.extend(validate_candidate(c).errors)
        dec=target.get("decision",{})
        state=dec.get("state")
        selected=dec.get("selected")
        if state=="selected":
            if selected not in ids:
                errors.append(f"{target.get('targetId')}: selected candidate missing")
            else:
                c=next(c for c in target['candidates'] if c['id']==selected)
                if not c['gate']['passed']:
                    errors.append(f"{target.get('targetId')}: selected candidate failed gate")
                if c['scores']['total'] < 80:
                    errors.append(f"{target.get('targetId')}: selected candidate below 80")
        elif state=="unresolved":
            unresolved.append(target.get('targetId'))
            if not dec.get("nextMeasurement"):
                errors.append(f"{target.get('targetId')}: unresolved target lacks next measurement")
        else:
            errors.append(f"{target.get('targetId')}: invalid decision state")
    formal=model.get("formalCompile",{})
    if formal.get("allowed") and unresolved:
        errors.append("formal compile allowed while unresolved targets exist")
    if not formal.get("allowed") and unresolved and not formal.get("blockers"):
        errors.append("blocked formal compile lacks blocker list")
    return ValidationResult(not errors,errors)
