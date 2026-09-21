(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.RAGeometryMeasurement=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const EPS=1e-9;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const round=(v,n=4)=>Number(Number(v).toFixed(n));
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const finitePoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
  function bbox(points){
    const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
    return {x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
  }
  function normalizeAngleDeg(a){let v=a%360;if(v<0)v+=360;return v;}
  function angleDeltaDeg(a,b){let d=Math.abs(normalizeAngleDeg(a)-normalizeAngleDeg(b));return d>180?360-d:d;}
  function fitLine(points){
    if(!Array.isArray(points)||points.length<2)throw new Error('LINE needs at least 2 points');
    const n=points.length;
    let cx=0,cy=0;for(const p of points){cx+=p.x;cy+=p.y;}cx/=n;cy/=n;
    let sxx=0,syy=0,sxy=0;for(const p of points){const x=p.x-cx,y=p.y-cy;sxx+=x*x;syy+=y*y;sxy+=x*y;}
    const theta=.5*Math.atan2(2*sxy,sxx-syy);
    const dx=Math.cos(theta),dy=Math.sin(theta),nx=-dy,ny=dx;
    let minT=Infinity,maxT=-Infinity,sum2=0,maxR=0;
    for(const p of points){const x=p.x-cx,y=p.y-cy,t=x*dx+y*dy,r=Math.abs(x*nx+y*ny);minT=Math.min(minT,t);maxT=Math.max(maxT,t);sum2+=r*r;maxR=Math.max(maxR,r);}
    const start={x:cx+minT*dx,y:cy+minT*dy},end={x:cx+maxT*dx,y:cy+maxT*dy};
    const rmse=Math.sqrt(sum2/n),length=dist(start,end),diag=Math.max(1,Math.hypot(bbox(points).width,bbox(points).height));
    return {
      candidateType:'LINE',
      parameters:{start:{x:round(start.x),y:round(start.y)},end:{x:round(end.x),y:round(end.y)},angleDeg:round(Math.atan2(dy,dx)*180/Math.PI)},
      metrics:{pointCount:n,length:round(length),rmse:round(rmse),maxResidual:round(maxR),normalizedRmse:round(rmse/diag,6),coverage:1}
    };
  }
  function solve3(A,b){
    const m=A.map((r,i)=>[...r,b[i]]);
    for(let col=0;col<3;col++){
      let pivot=col;for(let r=col+1;r<3;r++)if(Math.abs(m[r][col])>Math.abs(m[pivot][col]))pivot=r;
      if(Math.abs(m[pivot][col])<EPS)return null;
      [m[col],m[pivot]]=[m[pivot],m[col]];
      const d=m[col][col];for(let c=col;c<4;c++)m[col][c]/=d;
      for(let r=0;r<3;r++)if(r!==col){const f=m[r][col];for(let c=col;c<4;c++)m[r][c]-=f*m[col][c];}
    }
    return [m[0][3],m[1][3],m[2][3]];
  }
  function fitCircle(points){
    if(!Array.isArray(points)||points.length<3)throw new Error('CIRCLE needs at least 3 points');
    let sx=0,sy=0,s1=points.length,sxx=0,syy=0,sxy=0,sxz=0,syz=0,sz=0;
    for(const p of points){const x=p.x,y=p.y,z=x*x+y*y;sx+=x;sy+=y;sxx+=x*x;syy+=y*y;sxy+=x*y;sxz+=x*z;syz+=y*z;sz+=z;}
    const sol=solve3([[sxx,sxy,sx],[sxy,syy,sy],[sx,sy,s1]],[sxz,syz,sz]);
    if(!sol)throw new Error('Points are collinear or degenerate');
    const [D,E,F]=sol,cx=D/2,cy=E/2,r2=F+cx*cx+cy*cy;
    if(!(r2>EPS))throw new Error('Invalid circle radius');
    const radius=Math.sqrt(r2),res=[];for(const p of points)res.push(Math.abs(dist(p,{x:cx,y:cy})-radius));
    const rmse=Math.sqrt(res.reduce((s,v)=>s+v*v,0)/res.length),maxResidual=Math.max(...res),radiusDeviation=Math.sqrt(res.reduce((s,v)=>s+v*v,0)/res.length)/radius;
    const diag=Math.max(1,Math.hypot(bbox(points).width,bbox(points).height));
    return {
      candidateType:'CIRCLE',
      parameters:{center:{x:round(cx),y:round(cy)},radius:round(radius)},
      metrics:{pointCount:points.length,rmse:round(rmse),maxResidual:round(maxResidual),radiusDeviation:round(radiusDeviation,6),normalizedRmse:round(rmse/diag,6),coverage:1}
    };
  }
  function circleFrom3Points(a,b,c){return fitCircle([a,b,c]);}
  function arcFrom3Points(a,b,c){
    const circle=circleFrom3Points(a,b,c),center=circle.parameters.center,r=circle.parameters.radius;
    const ang=p=>normalizeAngleDeg(Math.atan2(p.y-center.y,p.x-center.x)*180/Math.PI);
    const aa=ang(a),ab=ang(b),ac=ang(c);
    const ccw=(ac-aa+360)%360,mid=(ab-aa+360)%360;
    const clockwiseScreen=mid<=ccw;
    const sweep=clockwiseScreen?ccw:-(360-ccw);
    return {
      candidateType:'ARC',
      parameters:{center,radius:r,startAngleDeg:round(aa),endAngleDeg:round(ac),sweepDeg:round(sweep),clockwiseScreen},
      metrics:{...circle.metrics,midpointAngleDeg:round(ab),sweepAbsDeg:round(Math.abs(sweep))}
    };
  }
  function arcFromSpan(points){
    if(!Array.isArray(points)||points.length<3)throw new Error('ARC span needs at least 3 points');
    const circle=fitCircle(points),center=circle.parameters.center,r=circle.parameters.radius;
    const a=points[0],b=points[Math.floor((points.length-1)/2)],c=points[points.length-1];
    const ang=p=>normalizeAngleDeg(Math.atan2(p.y-center.y,p.x-center.x)*180/Math.PI);
    const aa=ang(a),ab=ang(b),ac=ang(c),ccw=(ac-aa+360)%360,mid=(ab-aa+360)%360,clockwiseScreen=mid<=ccw,sweep=clockwiseScreen?ccw:-(360-ccw);
    return {candidateType:'ARC',parameters:{center,radius:r,startAngleDeg:round(aa),endAngleDeg:round(ac),sweepDeg:round(sweep),clockwiseScreen},metrics:{...circle.metrics,midpointAngleDeg:round(ab),sweepAbsDeg:round(Math.abs(sweep))}};
  }
  function nearestPointIndex(points,p){
    let best=-1,bestD=Infinity;points.forEach((q,i)=>{const d=dist(q,p);if(d<bestD){bestD=d;best=i;}});return {index:best,distance:bestD};
  }
  function extractContourSpan(points,startIndex,endIndex,closed=true,mode='shortest'){
    if(!Array.isArray(points)||!points.length)throw new Error('Contour is empty');
    const n=points.length,s=((startIndex%n)+n)%n,e=((endIndex%n)+n)%n;
    const forward=[];let i=s;for(let guard=0;guard<n;guard++){forward.push(points[i]);if(i===e)break;i=(i+1)%n;if(!closed&&i===0)break;}
    if(!closed||mode==='forward')return forward;
    const reverse=[];i=s;for(let guard=0;guard<n;guard++){reverse.push(points[i]);if(i===e)break;i=(i-1+n)%n;}
    return mode==='reverse'?reverse:(forward.length<=reverse.length?forward:reverse);
  }
  function scoreCandidate(candidate){
    const m=candidate.metrics||{},type=candidate.candidateType;
    const nrm=Number.isFinite(m.normalizedRmse)?m.normalizedRmse:Math.min(1,(m.rmse||999)/100);
    const fitQuality=round(clamp(30*(1-nrm*8),0,30),2);
    let stability=10;
    if(type==='LINE')stability=clamp(15-(m.normalizedRmse||0)*100,0,15);
    if(type==='ARC'||type==='CIRCLE')stability=clamp(15-(m.radiusDeviation??1)*120,0,15);
    const structuralConsistency=(type==='LINE'||type==='ARC'||type==='CIRCLE')?13:9;
    const topologyContinuity=type==='ARC'?13:type==='LINE'?12:10;
    const representationComplexity=type==='LINE'?15:(type==='ARC'||type==='CIRCLE')?14:9;
    const editabilityReplay=type==='LINE'||type==='ARC'||type==='CIRCLE'?10:7;
    const scores={fitQuality:round(fitQuality),geometricStability:round(stability),structuralConsistency,topologyContinuity,representationComplexity,editabilityReplay};
    scores.total=round(Object.values(scores).reduce((s,v)=>s+v,0));
    return scores;
  }
  function gateCandidate(candidate){
    const m=candidate.metrics||{},type=candidate.candidateType;
    const checks=[];
    const finite=JSON.stringify(candidate.parameters).indexOf('null')<0;
    checks.push({id:'finiteParameters',passed:finite,evidence:'All measured parameters must be finite.'});
    let residual=false;
    if(type==='LINE')residual=(m.normalizedRmse??1)<=0.02;
    else if(type==='ARC'||type==='CIRCLE')residual=(m.normalizedRmse??1)<=0.025&&(m.radiusDeviation??1)<=0.05;
    checks.push({id:'measurementResidual',passed:residual,evidence:`normalizedRmse=${m.normalizedRmse??'n/a'}`});
    checks.push({id:'workingCandidateOnly',passed:true,evidence:'Measurement candidates remain unresolved and recipeEligible=false.'});
    return {passed:finite&&residual,checks,failReasons:checks.filter(x=>!x.passed).map(x=>x.id)};
  }
  function finalizeCandidate(candidate,extra={}){
    const out={...candidate,...extra};out.scores=scoreCandidate(out);out.gate=gateCandidate(out);out.decisionState='unresolved';out.recipeEligible=false;out.formalPromotionBlocked=true;out.requiresRescore=true;return out;
  }
  function lineAngle(line){return normalizeAngleDeg(line.parameters.angleDeg);}
  function checkParallel(a,b){
    const d=Math.min(angleDeltaDeg(lineAngle(a),lineAngle(b)),Math.abs(90-angleDeltaDeg(lineAngle(a),lineAngle(b))));
    const angleErrorDeg=Math.min(angleDeltaDeg(lineAngle(a),lineAngle(b)),180-angleDeltaDeg(lineAngle(a),lineAngle(b)));
    return {type:'parallel',passed:angleErrorDeg<=2,angleErrorDeg:round(angleErrorDeg),evidence:`angle error ${round(angleErrorDeg)}°`};
  }
  function pointLineDistance(p,line){const a=line.parameters.start,b=line.parameters.end,dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;return Math.abs((p.x-a.x)*dy-(p.y-a.y)*dx)/l;}
  function checkTangent(line,curve){
    const center=curve.parameters.center,radius=curve.parameters.radius;
    const centerDistance=pointLineDistance(center,line),radialError=Math.abs(centerDistance-radius);
    const passed=radialError<=Math.max(2,radius*.015);
    return {type:'tangent',passed,centerDistance:round(centerDistance),radius:round(radius),radialError:round(radialError),evidence:`|distance(center,line)-radius|=${round(radialError)}`};
  }
  function signedLineOffset(line,normal){const p=line.parameters.start;return p.x*normal.x+p.y*normal.y;}
  function checkEqualSpacing(lines){
    if(!Array.isArray(lines)||lines.length<3)return {type:'equalSpacing',passed:false,evidence:'Need at least 3 LINE candidates.'};
    const base=lines[0],ang=lineAngle(base)*Math.PI/180,normal={x:-Math.sin(ang),y:Math.cos(ang)};
    const parallel=lines.every(l=>checkParallel(base,l).angleErrorDeg<=2);
    const offsets=lines.map(l=>signedLineOffset(l,normal)).sort((a,b)=>a-b),gaps=[];for(let i=1;i<offsets.length;i++)gaps.push(offsets[i]-offsets[i-1]);
    const mean=gaps.reduce((s,v)=>s+v,0)/gaps.length,maxDev=Math.max(...gaps.map(v=>Math.abs(v-mean)));
    return {type:'equalSpacing',passed:parallel&&maxDev<=Math.max(2,Math.abs(mean)*.05),parallel,meanGap:round(mean),maxDeviation:round(maxDev),gaps:gaps.map(round),evidence:`mean gap ${round(mean)}, max deviation ${round(maxDev)}`};
  }
  return {round,dist,bbox,normalizeAngleDeg,angleDeltaDeg,fitLine,fitCircle,circleFrom3Points,arcFrom3Points,arcFromSpan,nearestPointIndex,extractContourSpan,scoreCandidate,gateCandidate,finalizeCandidate,checkParallel,checkTangent,checkEqualSpacing};
});
