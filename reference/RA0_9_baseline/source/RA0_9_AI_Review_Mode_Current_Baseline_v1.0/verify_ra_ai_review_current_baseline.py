#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
import argparse, hashlib, json, os, shutil, subprocess, sys, tempfile, zipfile

EXPECTED_ROOT='RA0_9_AI_Review_Mode_Current_Baseline_v1.0'
ROOT=Path(__file__).resolve().parent
CORE_SHA='70e6ece15b38724a4a5515d6bb27631d6884595529ac3ef54b98c407185827fd'
PARENT_SHA='72beebf6bcd0d15c7a82ce17d77a78504cb830ba28a5846d9a6d76b3db2689f9'
CANDIDATE_SHA='ad52fb582ed3ae258c0cec36f4aa292d6d4e5fd74421c4a82be64b2861d6673e'
ALLOWED_PARENT_OVERRIDES={'PACKAGE_SCOPE.md','README.md','verify_ra_frozen_toolkit.py','verify_ra_baseline_status.py'}
VOLATILE_PREFIXES=(
 'qa/evidence/ai_review_mode/browser/',
 'qa/evidence/ai_review_mode/visual_browser/',
)
VOLATILE_FILES={
 'qa/evidence/ai_review_mode/CANDIDATE_VERIFICATION_RESULTS.json',
 'qa/evidence/ai_review_mode/PARENT_BASELINE_DIRECT_COMPARISON.json',
 'qa/evidence/ai_review_mode/PARENT_REGRESSION_RESULTS.json',
 'qa/evidence/ai_review_mode/STATIC_TEST_RESULTS.json',
 'qa/evidence/ai_review_mode/VISUAL_ASSET_TEST_REPORT.json',
 'qa/evidence/ai_review_mode/VISUAL_VERIFIED_CANDIDATE_RESULTS.json',
 'qa/evidence/basic_function_freeze/RA_BASIC_FUNCTION_NODE_CONTRACT.json',
 'qa/evidence/basic_function_freeze/RA_BASIC_FUNCTION_TEST_RECIPE.json',
}

def sha(path:Path)->str:return hashlib.sha256(path.read_bytes()).hexdigest()
def run(cmd:list[str],cwd:Path)->dict:
    p=subprocess.run(cmd,cwd=cwd,capture_output=True,text=True,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'})
    return {'returnCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr}
def parse_last_json(text:str):
    text=text.strip()
    try:return json.loads(text)
    except Exception:
        starts=[i for i,c in enumerate(text) if c=='{']
        for i in reversed(starts):
            try:return json.loads(text[i:])
            except Exception:pass
    return None

def verify_dir(root:Path,browser:bool=False)->dict:
    checks={}; details={}; failures=[]
    required=['PACKAGE_SCOPE.md','CURRENT_BASELINE.json','RA0_9_AI_REVIEW_MODE_BASELINE_DECISION_RECORD_v1.0.md','README.md','CHANGELOG.md','KNOWN_LIMITATIONS.md','VISUAL_ASSET_PROVENANCE.md','SHA256_MANIFEST.json','Recipe_Authoring_Workbench_RA0_9_RC4.html','RA0_9_AI_Review_Mode_Candidate.html','visual_test_assets/asset_manifest.json']
    checks['requiredFiles']=all((root/x).is_file() for x in required)
    details['missingRequired']=[x for x in required if not (root/x).is_file()]

    nested=[p.relative_to(root).as_posix() for p in root.rglob('*.zip')]
    cache=[p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and (p.suffix=='.pyc' or '__pycache__' in p.parts)]
    checks['noNestedZip']=not nested; checks['noPycacheOrPyc']=not cache
    details['nestedZip']=nested; details['cacheFiles']=cache

    current=json.loads((root/'CURRENT_BASELINE.json').read_text(encoding='utf-8')) if (root/'CURRENT_BASELINE.json').is_file() else {}
    checks['packageRole']=current.get('packageRole')=='CURRENT_RA_MAIN_AND_TECHNICAL_BASELINE'
    checks['coreStatus']=current.get('coreStatus')=='RA_BASIC_FUNCTION_FROZEN'
    checks['uiStatus']=current.get('uiStatus')=='RA_AI_REVIEW_MODE_ACCEPTED'
    checks['acceptanceDecision']=current.get('acceptanceDecision')=='RA_AI_REVIEW_MODE_ACCEPTED'
    checks['finalStatus']=current.get('finalStatus')=='ACCEPTED_CURRENT_BASELINE'
    checks['parentIdentity']=current.get('parentCoreBaselineSha256')==PARENT_SHA
    checks['candidateIdentity']=current.get('acceptedCandidateSha256')==CANDIDATE_SHA
    scope=(root/'PACKAGE_SCOPE.md').read_text(encoding='utf-8') if (root/'PACKAGE_SCOPE.md').is_file() else ''
    checks['scopeStates']=all(x in scope for x in ['RA_BASIC_FUNCTION_FROZEN','RA_AI_REVIEW_MODE_ACCEPTED','CURRENT_RA_MAIN_AND_TECHNICAL_BASELINE'])

    core=root/'Recipe_Authoring_Workbench_RA0_9_RC4.html'
    checks['frozenMainProgram']=core.is_file() and sha(core)==CORE_SHA

    parent_manifest=json.loads((root/'PACKAGE_SHA256_MANIFEST.json').read_text(encoding='utf-8'))['files'] if (root/'PACKAGE_SHA256_MANIFEST.json').is_file() else {}
    missing=[]; changed=[]; matched=0
    for rel,meta in parent_manifest.items():
        if rel in ALLOWED_PARENT_OVERRIDES:continue
        p=root/rel
        if not p.is_file():missing.append(rel);continue
        if p.stat().st_size!=meta['bytes'] or sha(p)!=meta['sha256']:changed.append(rel)
        else:matched+=1
    checks['frozenParentImmutableFiles']=len(parent_manifest)==99 and not missing and not changed
    details['frozenParentComparison']={'manifestCount':len(parent_manifest),'allowedGovernanceOverrides':sorted(ALLOWED_PARENT_OVERRIDES),'matchedImmutable':matched,'missing':missing,'changed':changed}

    manifest_path=root/'SHA256_MANIFEST.json'; bad=[]
    if manifest_path.is_file():
        manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
        for rel,meta in manifest.get('files',{}).items():
            p=root/rel
            if not p.is_file() or p.stat().st_size!=meta['bytes'] or sha(p)!=meta['sha256']:bad.append(rel)
        checks['currentManifest']=not bad
        details['manifestBad']=bad
    else:checks['currentManifest']=False

    node=run(['node','qa/run_ra_basic_function_freeze_contract.js'],root)
    node_obj=parse_last_json(node['stdout'])
    checks['coreRegression']=node['returnCode']==0 and isinstance(node_obj,dict) and node_obj.get('status')=='PASS'
    details['coreRegression']=node_obj or {'stdout':node['stdout'][-2000:],'stderr':node['stderr'][-2000:]}

    static=run([sys.executable,'-B','qa/ui/test_ai_review_mode.py'],root); static_obj=parse_last_json(static['stdout'])
    checks['aiReviewMode']=static['returnCode']==0 and isinstance(static_obj,dict) and static_obj.get('status')=='PASS'
    details['aiReviewMode']=static_obj or {'stdout':static['stdout'][-2000:],'stderr':static['stderr'][-2000:]}

    assets=run([sys.executable,'-B','qa/visual/test_visual_assets.py'],root); assets_obj=parse_last_json(assets['stdout'])
    checks['visualAssets']=assets['returnCode']==0 and isinstance(assets_obj,dict) and assets_obj.get('status')=='PASS'
    details['visualAssets']=assets_obj or {'stdout':assets['stdout'][-2000:],'stderr':assets['stderr'][-2000:]}

    asset_manifest=json.loads((root/'visual_test_assets/asset_manifest.json').read_text(encoding='utf-8')) if (root/'visual_test_assets/asset_manifest.json').is_file() else {}
    checks['assetClassification']=asset_manifest.get('classification')=='TEST_ONLY_NON_AUTHORITATIVE'
    checks['assetCases']=set(asset_manifest.get('cases',{}))=={'PL-015','PL-036'}
    checks['provenance']=all((root/x).is_file() for x in ['VISUAL_ASSET_PROVENANCE.md','docs/ai_review_mode/VISUAL_ASSET_PROVENANCE.md'])

    report_path=root/'qa/evidence/ai_review_mode/visual_browser/BROWSER_VISUAL_TEST_REPORT.json'
    browser_obj=json.loads(report_path.read_text(encoding='utf-8')) if report_path.is_file() else {}
    checks['browserEvidence']=browser_obj.get('status')=='PASS_VISUAL_BROWSER' and browser_obj.get('visualAssetState')=='VERIFIED_REAL_ASSETS' and not browser_obj.get('failures')
    details['browserEvidence']=browser_obj
    if browser:
        br=run([sys.executable,'-B','qa/visual/run_browser_visual_test.py'],root); br_obj=parse_last_json(br['stdout'])
        checks['browserRerun']=br['returnCode']==0 and isinstance(br_obj,dict) and br_obj.get('status')=='PASS_VISUAL_BROWSER'
        details['browserRerun']=br_obj or {'stdout':br['stdout'][-2000:],'stderr':br['stderr'][-2000:]}
    else:
        details['browserRerun']='NOT_REQUESTED'

    readme=(root/'README.md').read_text(encoding='utf-8') if (root/'README.md').is_file() else ''
    checks['readmeVerifierName']='verify_ra_ai_review_current_baseline.py' in readme
    checks['verifierPresent']=(root/'verify_ra_ai_review_current_baseline.py').is_file()

    failures=[k for k,v in checks.items() if v is not True]
    return {'kind':'ra0.9-ai-review-mode-current-baseline-verification','version':'1.0','status':'ACCEPTED_CURRENT_BASELINE' if not failures else 'BLOCKED_CANDIDATE_VERIFICATION_FAILURE','checks':checks,'failures':failures,'details':details}

def verify_zip(path:Path,browser:bool=False)->dict:
    zchecks={}; zdetails={}
    try:
        with zipfile.ZipFile(path) as z:
            bad=z.testzip(); names=z.namelist()
            roots={n.split('/')[0] for n in names if n}
            zchecks['crc']=bad is None; zdetails['badCrcEntry']=bad
            zchecks['singleRoot']=roots=={EXPECTED_ROOT}; zdetails['roots']=sorted(roots)
            zchecks['noNestedZip']=not any(n.lower().endswith('.zip') for n in names); zdetails['nestedZip']=[n for n in names if n.lower().endswith('.zip')]
            zchecks['noCache']=not any('/__pycache__/' in '/'+n or n.endswith('.pyc') for n in names)
            with tempfile.TemporaryDirectory(prefix='ra_current_verify_') as td:
                z.extractall(td)
                result=verify_dir(Path(td)/EXPECTED_ROOT,browser=browser)
    except Exception as e:
        return {'kind':'ra0.9-ai-review-mode-current-baseline-verification','version':'1.0','status':'BLOCKED_CANDIDATE_VERIFICATION_FAILURE','checks':zchecks,'failures':['zipOpen'],'details':{'error':str(e),**zdetails}}
    result['zipChecks']=zchecks; result['details']['zip']=zdetails
    if not all(zchecks.values()):
        result['status']='BLOCKED_CANDIDATE_VERIFICATION_FAILURE'
        result['failures'] += [f'zip.{k}' for k,v in zchecks.items() if v is not True]
    return result

def main(argv=None):
    ap=argparse.ArgumentParser()
    ap.add_argument('zip_path',nargs='?')
    ap.add_argument('--browser',action='store_true')
    ap.add_argument('--report')
    args=ap.parse_args(argv)
    result=verify_zip(Path(args.zip_path).resolve(),args.browser) if args.zip_path else verify_dir(ROOT,args.browser)
    text=json.dumps(result,ensure_ascii=False,indent=2)
    print(text)
    if args.report:Path(args.report).write_text(text+'\n',encoding='utf-8')
    return 0 if result['status']=='ACCEPTED_CURRENT_BASELINE' else 1
if __name__=='__main__':raise SystemExit(main())
