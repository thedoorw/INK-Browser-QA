#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageChops
import hashlib, json, re, sys
import numpy as np

ROOT=Path(__file__).resolve().parents[2]
MANIFEST=ROOT/'visual_test_assets/asset_manifest.json'
ENTRY=ROOT/'RA0_9_AI_Review_Mode_Candidate.html'
OUT=ROOT/'qa/evidence/ai_review_mode/VISUAL_ASSET_TEST_REPORT.json'

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    checks={}; details={}; failures=[]
    m=json.loads(MANIFEST.read_text(encoding='utf-8'))
    checks['classification']=m.get('classification')=='TEST_ONLY_NON_AUTHORITATIVE'
    checks['lockedEvidencePackageHash']=m.get('sourceEvidencePackage',{}).get('sha256')=='213cde7a0227ce0ef8b495182519f1a94ef2e7f3297192534acaab2987a3e334'
    html=ENTRY.read_text(encoding='utf-8')
    mm=re.search(r'<script id="ra65-cases" type="application/json">(.*?)</script>',html,re.S)
    cases={c['id']:c for c in json.loads(mm.group(1))} if mm else {}
    image_metrics={}
    for cid,role in [('PL-015','Accepted'),('PL-036','Diagnostic')]:
        rec=m['cases'][cid]; d=ROOT/'visual_test_assets'/cid
        ref=d/'reference.png'; run=d/'runtime.png'; casef=d/'case.json'; targets=d/'targets.json'
        for key,p in [('reference',ref),('runtime',run),('case',casef),('targets',targets)]:
            checks[f'{cid}.{key}.present']=p.is_file()
        checks[f'{cid}.role']=rec.get('role')==role
        checks[f'{cid}.reference.hash']=sha(ref)==rec['reference']['sha256']
        checks[f'{cid}.runtime.hash']=sha(run)==rec['runtime']['sha256']
        ri=Image.open(ref).convert('RGB'); ui=Image.open(run).convert('RGB')
        checks[f'{cid}.samePixelSize']=ri.size==ui.size==tuple(rec['reference']['pixelSize'])
        checks[f'{cid}.portraitAspect']=abs((ri.width/ri.height)-(1002/1421))<0.01
        checks[f'{cid}.caseExact']=json.loads(casef.read_text(encoding='utf-8'))==cases[cid]
        checks[f'{cid}.targetsExact']=json.loads(targets.read_text(encoding='utf-8'))==cases[cid]['decisionModel']['targets']
        diff=ImageChops.difference(ri,ui)
        bbox=diff.getbbox(); a=np.asarray(ri,dtype=np.int16); b=np.asarray(ui,dtype=np.int16)
        mean_abs=float(np.abs(a-b).mean())
        changed=float(np.any(a!=b,axis=2).mean())
        ident=ImageChops.difference(ri,ri)
        checks[f'{cid}.identityDifferenceZero']=ident.getbbox() is None
        checks[f'{cid}.runtimeNotReference']=bbox is not None and changed>0.01
        image_metrics[cid]={'meanAbsoluteDifference':mean_abs,'changedPixelRatio':changed,'differenceBBox':bbox}
    checks['noHistoricalOverlayDifferenceEmbedded']=not any((ROOT/'visual_test_assets').rglob('*overlay*')) and not any((ROOT/'visual_test_assets').rglob('*difference*'))
    checks['resolverLoadedBeforeUi']=html.index('visual_test_assets/asset_manifest.js')<html.index('ui/ai_review_mode.js')
    failures=[k for k,v in checks.items() if v is not True]
    report={'kind':'ra0.9-ai-review-mode-real-visual-asset-test','version':'1.0','status':'PASS' if not failures else 'FAIL','checks':checks,'imageMetrics':image_metrics,'failures':failures}
    OUT.parent.mkdir(parents=True,exist_ok=True); OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0 if not failures else 1
if __name__=='__main__': raise SystemExit(main())
