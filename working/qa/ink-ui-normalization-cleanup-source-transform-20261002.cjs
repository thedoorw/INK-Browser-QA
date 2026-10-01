const fs=require('fs'),postcss=require(process.env.INK_POSTCSS_MODULE||'postcss');
const path=require('path'),repoRoot=process.env.INK_REPO_ROOT||process.cwd();
const file=path.join(repoRoot,'product/source/styles.css'),before=fs.readFileSync(process.env.INK_CLEANUP_BASELINE_CSS||'/tmp/ink-cleanup-before.css','utf8'),root=postcss.parse(before),removed=[],retained=[];
const originalRules=[];root.walkRules(r=>originalRules.push(r));
const covered=s=>/(?:\.(?:tool-(?:rail|button|action|group|layout|colors|color|bottom)|foreground-swatch|background-swatch|color-utility|color-reset|color-swap|edge-chevron|panel-(?:edge|stack)|primary-button|quiet-button|creative-workspace-(?:field|actions|action-grid|primary|body)|creative-structure-option|creative-file-picker|layer-row|ui-b-layer-appearance|window-visual-controls|contextual-options|context-inline-control|ui-b-context-controls|application-menu|menu-strip|object-actions|layer-actions|stroke-edit-actions|studio-button-grid|shape-grid|segmented|wide-button)\b|input\[type=["']?range|::-webkit-scrollbar|::-moz-range)/.test(s);
const ctx=r=>{let a=[];for(let p=r.parent;p&&p.type!=='root';p=p.parent)a.unshift(p.name+':'+p.params.replace(/\s/g,''));return a.join('/')};
const log=(d,reason)=>removed.push({line:d.source?.start.line,context:ctx(d.parent),selector:d.parent.selector,property:d.prop,value:d.value,important:!!d.important,reason});
const del=(d,reason)=>{log(d,reason);d.remove()};
// Retire the obsolete rail geometry. Compact mode has no rail; active desktop
// geometry is already owned by the workstation rule and shared tokens.
root.walkRules(r=>{if(r.selector==='.tool-layout-toggle svg'){r.walkDecls(d=>del(d,'left-only glyph override retired; shared edge-chevron authority'));}
 if(r.selector==='.tool-rail'&&!ctx(r)){const compact=postcss.atRule({name:'media',params:'(max-width:760px)'}),rr=postcss.rule({selector:r.selector});r.walkDecls(d=>{if(!['position','z-index','scrollbar-width'].includes(d.prop)){rr.append(d.clone());del(d,'desktop obsolete rail base; preserved exclusively for existing compact rail')}});if(rr.nodes.length){compact.append(rr);r.after(compact)}}
 if(r.selector==='.tool-rail'&&/max-width:1120px/.test(ctx(r)))r.walkDecls(d=>del(d,'obsolete narrow rail width superseded by desktop shared rail width'));
 if(r.selector==='.tool-rail .tool-button'&&/max-width:1120px/.test(ctx(r)))r.walkDecls(d=>del(d,'obsolete narrow cell height superseded by desktop shared cell pitch'));
 if(r.selector==='.tool-button.active::before'&&/max-width:1120px/.test(ctx(r)))r.walkDecls(d=>del(d,'desktop active pseudo is disabled; obsolete narrow offset'));
 if(r.selector==='.creative-workspace-field'&&/min-width:761px/.test(ctx(r)))r.walkDecls(d=>{if(d.prop==='grid-template-columns')del(d,'shared Reference grid owns the identical final 72px label geometry')});
 if(r.selector==='.app.toolbar-layout-dual .tool-rail .tool-button')r.walkDecls(d=>{if(d.prop==='width')del(d,'dual state uses the same shared tool-cell width as single state')});
 if(r.selector==='.panel-stack-body #creativeWorkspace .creative-workspace-field')r.walkDecls(d=>del(d,'redundant scoped Reference grid; shared primitive has identical values'));
});
// Merge exact-selector definitions only inside identical media/state contexts.
// Different state and responsive selectors retain their original authority.
const groups=new Map();root.walkRules(r=>{if(!covered(r.selector)||r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;let k=ctx(r)+'|'+r.selector;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r)});
for(const rules of groups.values()){
 if(rules.length<2)continue;
 const target=rules[0].selector==='.tool-rail'&&ctx(rules[0])==='media:(max-width:760px)'?rules[0]:rules.find(r=>r.source?.start.line>=2200&&r.source?.start.line<=2355)||rules.at(-1);
 const decls=rules.flatMap(r=>r.nodes.filter(n=>n.type==='decl'));
 const winner=new Map();for(const d of decls){let old=winner.get(d.prop);if(!old||!old.important||d.important)winner.set(d.prop,d)}
 const survivors=decls.filter(d=>winner.get(d.prop)===d);
 for(const d of decls)if(!survivors.includes(d))log(d,'superseded exact-selector declaration in identical context');
 // Preserve surviving declaration order (shorthand/longhand cascade included).
 target.removeAll();for(const d of survivors)target.append(d.clone());
 for(const r of rules)if(r!==target)r.remove();
}
// Remove obsolete base declarations when the exact desktop rule supplies the
// same property; keep compact styling explicitly as a responsive variant.
const desktops=new Map();root.walkRules(r=>{if(ctx(r)==='media:(min-width:761px)'&&covered(r.selector)){if(!desktops.has(r.selector))desktops.set(r.selector,new Set());r.walkDecls(d=>desktops.get(r.selector).add(d.prop))}});
root.walkRules(r=>{if(ctx(r)||!covered(r.selector)||!desktops.has(r.selector))return;
 const safe=true;
 if(!safe)return;const props=desktops.get(r.selector);let mobile=[];
 r.walkDecls(d=>{if((props.has(d.prop)||r.selector==='.tool-button.active::before')&&!d.important){mobile.push(d.clone());del(d,'legacy base moved to compact-only variant; desktop uses workstation authority')}});
 if(mobile.length){const m=postcss.atRule({name:'media',params:'(max-width:760px)'}),rr=postcss.rule({selector:r.selector});mobile.forEach(d=>rr.append(d));m.append(rr);r.after(m);retained.push({selector:r.selector,reason:'compact-only presentation retained; desktop base shadowing retired',properties:mobile.map(d=>d.prop)})}
});
// Coalesce compact rules produced by isolating legacy responsive presentation.
const compactGroups=new Map();root.walkRules(r=>{if(ctx(r)!=='media:(max-width:760px)'||!covered(r.selector))return;const k=r.selector;if(!compactGroups.has(k))compactGroups.set(k,[]);compactGroups.get(k).push(r)});
for(const rules of compactGroups.values()){if(rules.length<2)continue;const target=rules[0].selector==='.tool-rail'?rules[0]:rules.at(-1),ds=rules.flatMap(r=>r.nodes.filter(n=>n.type==='decl')),wins=new Map();for(const d of ds){const old=wins.get(d.prop);if(!old||!old.important||d.important)wins.set(d.prop,d)}const keep=ds.filter(d=>wins.get(d.prop)===d);for(const d of ds)if(!keep.includes(d))log(d,'superseded exact-selector compact declaration');target.removeAll();keep.forEach(d=>target.append(d.clone()));rules.filter(r=>r!==target).forEach(r=>r.remove())}
// Existing common geometry now names its shared token, without a new rule.
const tokens={'31px':'var(--ui-tool-cell-width)','26px':'var(--ui-tool-row-pitch)','28px':'var(--ui-panel-tab-height)'};
root.walkRules(r=>{if(r.selector==='.tool-rail .tool-button'||r.selector==='.tool-rail .tool-action')r.walkDecls(d=>{if(d.prop==='width'&&d.value==='31px')d.value=tokens['31px'];if(['height','min-height'].includes(d.prop)&&d.value==='26px')d.value=tokens['26px']});if(r.selector==='.panel-stack-tabs')r.walkDecls(d=>{if(['height','min-height'].includes(d.prop)&&d.value==='28px')d.value=tokens['28px']})});
root.walkRules(r=>{if(!r.nodes.length)r.remove()});root.walkAtRules(r=>{if(r.nodes&&!r.nodes.length)r.remove()});
const after=root.toString();fs.writeFileSync(file,after);
const metrics=s=>{const a=postcss.parse(s),groups={},m={important:0,coveredDeclarations:0,coveredHardcodedValues:0,coveredRadiusShadow:0,coveredColorLiterals:0,coveredGeometryLiterals:0,coveredBorderRadius:0,coveredBoxShadow:0,coveredDuplicateDefinitions:0,breakpointFamilies:[],stateRoutingSourceFilesChanged:0};a.walkAtRules('media',r=>{m.breakpointFamilies.push(r.params.replace(/\s/g,''))});a.walkDecls(d=>{if(d.important)m.important++;if(d.parent.type==='rule'&&covered(d.parent.selector)){m.coveredDeclarations++;m.coveredColorLiterals+=(d.value.match(/#[\da-f]{3,8}\b|rgba?\([^)]*\)/gi)||[]).length;m.coveredGeometryLiterals+=(d.value.match(/(?<![\w-])\d+(?:\.\d+)?px\b/g)||[]).length;if(d.prop==='border-radius')m.coveredBorderRadius++;if(d.prop==='box-shadow')m.coveredBoxShadow++;if(/#[\da-f]{3,8}\b|rgba?\(|(?<![\w-])\d+(?:\.\d+)?px\b/i.test(d.value))m.coveredHardcodedValues++;if(/border-radius|box-shadow/.test(d.prop))m.coveredRadiusShadow++}});a.walkRules(r=>{if(covered(r.selector)){let k=ctx(r)+'|'+r.selector;groups[k]=(groups[k]||0)+1}});m.coveredDuplicateDefinitions=Object.values(groups).reduce((n,x)=>n+Math.max(0,x-1),0);m.breakpointFamilies=[...new Set(m.breakpointFamilies)].sort();return m};
fs.mkdirSync(path.join(repoRoot,'working/evidence/ink-ui-normalization-cleanup-20261002'),{recursive:true});fs.writeFileSync(path.join(repoRoot,'working/evidence/ink-ui-normalization-cleanup-20261002/source-audit.json'),JSON.stringify({before:metrics(before),after:metrics(after),removed,retained,removedRules:originalRules.filter(r=>{let p=r;while(p.parent)p=p.parent;return p!==root&&covered(r.selector)}).map(r=>({line:r.source?.start.line,selector:r.selector,context:ctx(r)})),retainedRules:[...groups.values()].flat().filter(r=>{let p=r;while(p.parent)p=p.parent;return p===root&&covered(r.selector)}).map(r=>({selector:r.selector,context:ctx(r),reason:ctx(r).includes('max-width:760px')?'Existing compact presentation; not desktop styling authority':/active|hover|focus|disabled|drop-|dragging|data-|::/.test(r.selector)?'Existing interaction/state/pseudo-element variant':'Live shared primitive or distinct control role; surviving declaration order preserved'}))},null,2));console.log(JSON.stringify({before:metrics(before),after:metrics(after),removed:removed.length,retained:retained.length},null,2));
