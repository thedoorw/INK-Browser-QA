#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, re, subprocess, sys, zipfile

ROOT = Path(__file__).resolve().parents[2]
PARENT_MANIFEST = ROOT / 'PACKAGE_SHA256_MANIFEST.json'
ENTRY = ROOT / 'RA0_9_AI_Review_Mode_Candidate.html'
JS = ROOT / 'ui/ai_review_mode.js'
CSS = ROOT / 'ui/ai_review_mode.css'

REQUIRED_STATE_FIELDS = [
    'caseId','targetId','mode','reviewState','formalState','selectedCandidateId',
    'candidateCount','formalEligibleCount','rawBoundaryCount','blockingReasons',
    'warnings','requiredActions','nextRecommendedAction','canConfirm','canReject',
    'canMarkUnresolved','canCompile'
]
REQUIRED_ACTIONS = [
    'enterReviewMode','exitReviewMode','selectTarget','selectCandidate',
    'confirmCandidate','rejectCandidate','markUnresolved','requestMeasurement',
    'showEvidence','showRawBoundary','previousTarget','nextTarget','getTaskState'
]
ALLOWED_CURRENT_BASELINE_OVERRIDES = {
    'PACKAGE_SCOPE.md', 'README.md',
    'verify_ra_frozen_toolkit.py', 'verify_ra_baseline_status.py'
}

REQUIRED_REGIONS = [
    'ai-review-mode','current-target-header','reference-runtime-context','observation',
    'candidate-review','relationship-summary','review-actions','blocking-reason-summary','evidence'
]

def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main() -> int:
    checks = {}
    manifest = json.loads(PARENT_MANIFEST.read_text(encoding='utf-8'))['files']
    changed = []
    missing = []
    for rel, meta in manifest.items():
        if rel in ALLOWED_CURRENT_BASELINE_OVERRIDES:
            continue
        path = ROOT / rel
        if not path.is_file():
            missing.append(rel)
        elif path.stat().st_size != meta['bytes'] or sha(path) != meta['sha256']:
            changed.append(rel)
    checks['parentManifestFilesPresent'] = not missing
    checks['parentManifestFilesUnchanged'] = not changed
    checks['parentMissingFiles'] = missing
    checks['parentChangedFiles'] = changed

    html = ENTRY.read_text(encoding='utf-8') if ENTRY.is_file() else ''
    js = JS.read_text(encoding='utf-8') if JS.is_file() else ''
    css = CSS.read_text(encoding='utf-8') if CSS.is_file() else ''
    checks['candidateEntryPresent'] = ENTRY.is_file()
    checks['uiModulesPresent'] = JS.is_file() and CSS.is_file()
    checks['candidateLoadsUiModules'] = 'ui/ai_review_mode.css' in html and 'ui/ai_review_mode.js' in html
    checks['requiredRegionsPresent'] = all(f'data-ra-region="{x}"' in html for x in REQUIRED_REGIONS)
    checks['requiredActionButtonsPresent'] = all(x in html for x in [
        'CONFIRM','REJECT','MARK UNRESOLVED','REQUEST MEASUREMENT','VIEW EVIDENCE',
        'VIEW RAW BOUNDARY','PREVIOUS TARGET','NEXT TARGET'
    ])
    checks['rawBoundaryDefaultCollapsed'] = '<details id="aiRawBoundaryDetails">' in html and '<details id="aiRawBoundaryDetails" open' not in html
    checks['rawBoundaryLabelsPresent'] = 'Evidence only · Not formal geometry' in html
    checks['taskStateFieldsPresent'] = all(re.search(rf'\b{re.escape(x)}\b', js) for x in REQUIRED_STATE_FIELDS)
    checks['actionHooksPresent'] = all(re.search(rf'\b{re.escape(x)}\b', js) for x in REQUIRED_ACTIONS)
    checks['taskStateEventPresent'] = 'ra:ai-task-state-changed' in js
    checks['taskStateSerializableClone'] = 'JSON.parse(JSON.stringify' in js
    checks['reviewAuthorityDelegation'] = all(x in js for x in ['confirmReviewBtn','rejectReviewBtn','unresolvedReviewBtn'])
    checks['noCompilerRuntimeSchemaWrite'] = not any(x in js for x in ['RAAuthoringSchema=', 'RACompiler=', 'RARuntime=', 'schema.push('])
    checks['keyboardNavigationPresent'] = 'Alt' not in js or ('ArrowLeft' in js and 'ArrowRight' in js)
    checks['cssNonColorStatusSupport'] = 'HARD GATE PASS' in js and 'HARD GATE BLOCK' in js

    node = subprocess.run(['node','--check',str(JS)], cwd=ROOT, capture_output=True, text=True)
    checks['javascriptSyntax'] = node.returncode == 0
    checks['javascriptSyntaxOutput'] = (node.stdout + node.stderr).strip()

    forbidden = [p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file() and (p.suffix == '.pyc' or '__pycache__' in p.parts)]
    nested_zips = [p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*.zip')]
    checks['noPycacheOrPyc'] = not forbidden
    checks['forbiddenCacheFiles'] = forbidden
    checks['noNestedZip'] = not nested_zips
    checks['nestedZipFiles'] = nested_zips

    bool_failures = [k for k,v in checks.items() if isinstance(v,bool) and not v]
    result = {'kind':'ra0.9-ai-review-mode-static-test','version':'1.0','status':'PASS' if not bool_failures else 'FAIL','failures':bool_failures,'checks':checks}
    out = ROOT / 'qa/evidence/ai_review_mode/STATIC_TEST_RESULTS.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not bool_failures else 1

if __name__ == '__main__':
    raise SystemExit(main())
