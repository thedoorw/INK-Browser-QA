#!/usr/bin/env python3
"""RA6.3 segment candidate engine. Manual fit points only; no contour-to-recipe path."""
from __future__ import annotations
import math
import numpy as np
THRESHOLDS={'lineRmse': 3.0, 'lineMax': 6.0, 'arcRmse': 6.0, 'arcMax': 10.0, 'splineRmse': 4.0, 'splineMax': 7.0}
def arr(p): return np.asarray(p,dtype=float)
def f4(v): return round(float(v),4)
def pjson(p): return {"x":f4(p[0]),"y":f4(p[1])}

def fit_line(points):
    P=arr(points); p0,p1=P[0],P[-1]; v=p1-p0; L=float(np.linalg.norm(v))
    if L < 1e-9: raise ValueError('zero length line span')
    n=np.array([-v[1],v[0]])/L; residual=(P-p0)@n
    return {"start":pjson(p0),"end":pjson(p1),"angleDeg":f4(math.degrees(math.atan2(v[1],v[0]))),"rmse":f4(np.sqrt(np.mean(residual**2))),"maxResidual":f4(np.max(np.abs(residual)))}

def golden_min(fn,lo=-2000.0,hi=2000.0,iters=120):
    gr=(math.sqrt(5)-1)/2; c=hi-gr*(hi-lo); d=lo+gr*(hi-lo); fc,fd=fn(c),fn(d)
    for _ in range(iters):
        if fc < fd: hi,d,fd=d,c,fc; c=hi-gr*(hi-lo); fc=fn(c)
        else: lo,c,fc=c,d,fd; d=lo+gr*(hi-lo); fd=fn(d)
    return (lo+hi)/2

def fit_arc(points):
    P=arr(points); p0,p1=P[0],P[-1]; chord=p1-p0; L=float(np.linalg.norm(chord))
    if L < 1e-9: raise ValueError('zero chord')
    mid=(p0+p1)/2; n=np.array([-chord[1],chord[0]])/L
    def objective(t):
        c=mid+t*n; r=np.linalg.norm(p0-c); e=np.linalg.norm(P-c,axis=1)-r; return float(np.mean(e*e))
    t=golden_min(objective); c=mid+t*n; r=float(np.linalg.norm(p0-c)); e=np.linalg.norm(P-c,axis=1)-r
    V=P-c; sweep=0.0
    for a,b in zip(V[:-1],V[1:]): sweep += math.atan2(a[0]*b[1]-a[1]*b[0],float(np.dot(a,b)))
    a0=math.atan2(p0[1]-c[1],p0[0]-c[0]); a1=a0+sweep
    return {"center":pjson(c),"radius":f4(r),"startAngleDeg":f4(math.degrees(a0)%360),"endAngleDeg":f4(math.degrees(a1)%360),"sweepDeg":f4(math.degrees(sweep)),"clockwiseScreen":bool(sweep>0),"rmse":f4(np.sqrt(np.mean(e*e))),"maxResidual":f4(np.max(np.abs(e)))}

def fit_spline(points):
    P=arr(points); ds=np.linalg.norm(np.diff(P,axis=0),axis=1); t=np.r_[0,np.cumsum(ds)]; t=t/t[-1]
    p0,p3=P[0],P[-1]; b0=(1-t)**3; b1=3*(1-t)**2*t; b2=3*(1-t)*t*t; b3=t**3
    A=np.c_[b1,b2]; rhs=P-b0[:,None]*p0-b3[:,None]*p3; p1,p2=np.linalg.lstsq(A,rhs,rcond=None)[0]
    B=b0[:,None]*p0+b1[:,None]*p1+b2[:,None]*p2+b3[:,None]*p3; err=np.linalg.norm(B-P,axis=1)
    return {"p0":pjson(p0),"p1":pjson(p1),"p2":pjson(p2),"p3":pjson(p3),"controlPointCount":4,"rmse":f4(np.sqrt(np.mean(err*err))),"maxResidual":f4(np.max(err))}

def candidate(typ,metrics,selected):
    if typ=='LINE': passed=metrics['rmse']<=THRESHOLDS['lineRmse'] and metrics['maxResidual']<=THRESHOLDS['lineMax']; checks=[('residualWithinLineGate',passed,f"rmse={metrics['rmse']}, max={metrics['maxResidual']}")]
    elif typ=='ARC': passed=metrics['rmse']<=THRESHOLDS['arcRmse'] and metrics['maxResidual']<=THRESHOLDS['arcMax']; checks=[('centerRadiusPresent',True,f"center={metrics['center']}, radius={metrics['radius']}"),('residualWithinArcGate',passed,f"rmse={metrics['rmse']}, max={metrics['maxResidual']}")]
    else:
        passed=metrics['rmse']<=THRESHOLDS['splineRmse'] and metrics['maxResidual']<=THRESHOLDS['splineMax']
        checks=[('lowerOrderRejected',selected, 'LINE and ARC residual gates failed for this span.' if selected else 'Spline is not selected unless lower-order candidates fail.'),('residualWithinSplineGate',passed,f"rmse={metrics['rmse']}, max={metrics['maxResidual']}")]
        passed=passed and selected
    return {"candidateType":typ,"metrics":metrics,"gate":{"passed":bool(passed),"checks":[{"id":i,"passed":bool(ok),"reason":reason,"evidence":evidence} for i,ok,evidence in checks for reason in [i]],"failReasons":[] if passed else ["candidate gate not satisfied"]},"decisionState":"selected" if selected else "rejected"}

def analyze_family(name,points,specs):
    segments=[]
    for idx,(selected_type,a,b) in enumerate(specs,1):
        span=points[a:b+1]
        lm,am,sm=fit_line(span),fit_arc(span),fit_spline(span)
        line_ok=lm['rmse']<=THRESHOLDS['lineRmse'] and lm['maxResidual']<=THRESHOLDS['lineMax']
        arc_ok=am['rmse']<=THRESHOLDS['arcRmse'] and am['maxResidual']<=THRESHOLDS['arcMax']
        if selected_type=='LINE' and not line_ok: raise AssertionError((name,idx,'LINE gate'))
        if selected_type=='ARC' and not arc_ok: raise AssertionError((name,idx,'ARC gate'))
        if selected_type=='SPLINE' and (line_ok or arc_ok): raise AssertionError((name,idx,'lower order not rejected',lm,am))
        selected_metrics={'LINE':lm,'ARC':am,'SPLINE':sm}[selected_type]
        seg={"id":f"PL-036-{name}-segment-{idx:02d}","pointRange":[a,b],"sourcePoints":[pjson(x) for x in span],"selectedPrimitive":selected_type,"selectedParameters":selected_metrics,"candidates":[]}
        for typ,met in [('LINE',lm),('ARC',am),('SPLINE',sm)]:
            c=candidate(typ,met,typ==selected_type); c['id']=seg['id']+'-'+typ.lower(); c['reason']=("Lowest-order candidate passed measured gate." if typ==selected_type and typ!='SPLINE' else "Spline selected only after measured LINE and ARC rejection." if typ==selected_type else "Rejected by residual gate or prototype ladder.")
            seg['candidates'].append(c)
        segments.append(seg)
    counts={t:sum(s['selectedPrimitive']==t for s in segments) for t in ['LINE','ARC','SPLINE']}
    max_selected=max(s['selectedParameters']['maxResidual'] for s in segments)
    return {"familyId":f"PL-036-{name}-channel-program","source":"RA6.2 manually authored baseFitPoints","offsetPitch":45.0,"offsets":[-67.5,-22.5,22.5,67.5],"segments":segments,"summary":{"segmentCount":len(segments),"typeCounts":counts,"arcCentersMeasured":counts['ARC'],"splineLowerOrderRejections":counts['SPLINE'],"maxSelectedResidual":f4(max_selected),"allSegmentsResolved":True}}

