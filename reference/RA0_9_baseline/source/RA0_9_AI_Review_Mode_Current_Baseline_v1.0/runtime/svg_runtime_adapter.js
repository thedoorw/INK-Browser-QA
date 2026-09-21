(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.RASVGRuntimeAdapter=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const esc=value=>String(value).replace(/[&<>"']/g,char=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[char]));
const point=value=>`${Number(value.x)} ${Number(value.y)}`;
function color(value,fallback="none"){
  if(typeof value==="string")return value;
  if(value&&typeof value==="object")return value.color||value.stops?.[0]?.color||fallback;
  return fallback;
}
function gradientId(object){return `gradient-${String(object.id).replace(/[^A-Za-z0-9_.:-]/g,"-")}`;}
function gradientDef(object){
  const fill=object.style?.fill;
  if(!fill||typeof fill!=="object"||!["linear","radial"].includes(fill.type))return "";
  const id=gradientId(object),stops=(fill.stops||[]).map(stop=>
    `<stop offset="${Number(stop.offset)*100}%" stop-color="${esc(stop.color)}" stop-opacity="${Number(stop.opacity??1)}"/>`
  ).join("");
  if(fill.type==="radial"){
    const center=fill.center||{x:.5,y:.5};
    return `<radialGradient id="${esc(id)}" cx="${Number(center.x)*100}%" cy="${Number(center.y)*100}%" r="${Number(fill.radius??.5)*100}%">${stops}</radialGradient>`;
  }
  const angle=Number(fill.angle||0)*Math.PI/180;
  const x=Math.cos(angle)*.5,y=Math.sin(angle)*.5;
  return `<linearGradient id="${esc(id)}" x1="${50-x*100}%" y1="${50-y*100}%" x2="${50+x*100}%" y2="${50+y*100}%">${stops}</linearGradient>`;
}
function style(object,fillReference=null){
  const value=object.style||{};
  const fill=fillReference?`url(#${fillReference})`:color(value.fill,"none");
  return `stroke="${esc(color(value.stroke,"#151614"))}" fill="${esc(fill)}" stroke-width="${Number(value.strokeWidth??1)}" opacity="${Number(value.opacity??1)}" stroke-linecap="${esc(value.lineCap??"round")}" stroke-linejoin="${esc(value.lineJoin??"round")}"`;
}
function element(object,fillReference=null){
  const common=`id="${esc(object.id)}" ${style(object,fillReference)}`;
  if(object.type==="line")return `<line ${common} x1="${object.start.x}" y1="${object.start.y}" x2="${object.end.x}" y2="${object.end.y}"/>`;
  if(object.type==="circle")return `<circle ${common} cx="${object.center.x}" cy="${object.center.y}" r="${object.radius}"/>`;
  if(object.type==="rectangle")return `<rect ${common} x="${object.x}" y="${object.y}" width="${object.width}" height="${object.height}" rx="${Number(object.radius??0)}" ry="${Number(object.radius??0)}"/>`;
  if(object.type==="ellipse")return `<ellipse ${common} cx="${object.center.x}" cy="${object.center.y}" rx="${object.radiusX}" ry="${object.radiusY}"/>`;
  if(object.type==="polyline"){
    const tag=object.closed?"polygon":"polyline";
    return `<${tag} ${common} points="${(object.points||object.pts||[]).map(value=>`${value.x},${value.y}`).join(" ")}"/>`;
  }
  if(object.type==="spline")return `<path ${common} d="M ${point(object.p0)} C ${point(object.p1)}, ${point(object.p2)}, ${point(object.p3)}"/>`;
  if(object.type==="arc"){
    const start=Number(object.startAngleDeg)*Math.PI/180,end=Number(object.endAngleDeg)*Math.PI/180;
    const p0={x:object.center.x+object.radius*Math.cos(start),y:object.center.y+object.radius*Math.sin(start)};
    const p1={x:object.center.x+object.radius*Math.cos(end),y:object.center.y+object.radius*Math.sin(end)};
    const sweep=Number(object.sweepDeg??object.endAngleDeg-object.startAngleDeg);
    return `<path ${common} d="M ${point(p0)} A ${object.radius} ${object.radius} 0 ${Math.abs(sweep)>180?1:0} ${sweep>=0?1:0} ${point(p1)}"/>`;
  }
  throw new Error(`SVG adapter does not support ${object.type}.`);
}
function render(recipe){
  if(recipe?.kind!=="icad-auto-drawing-recipe")throw new Error("iCAD Recipe is required.");
  const document=recipe.document||{};
  const objects=(recipe.objects||[]).filter(object=>object.visible!==false);
  const defs=objects.map(gradientDef).filter(Boolean).join("");
  const body=objects.map(object=>element(
    object,gradientDef(object)?gradientId(object):null
  )).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${document.width}" height="${document.height}" viewBox="0 0 ${document.width} ${document.height}">${defs?`<defs>${defs}</defs>`:""}<rect width="100%" height="100%" fill="${esc(document.background||"#ffffff")}"/>${body}</svg>`;
}
return {element,gradientDef,render};
});
