/*
 * INK UI-B Full Capability Creative Controls.
 * UI-only orchestration. Existing Document / History / Renderer / Core authorities remain authoritative.
 */
import { Matrix as M } from '../src/core/index.js';
import {
  IMAGE_CAPABILITIES, FILTER_GALLERY,
  createAdjustment, createFilter, createLiquifyFilter, createLayerEffect, createRasterMask,
  cropImageData, resizeImageData, colorRasterToRgba8, createColorRaster, serializeColorRaster, deserializeColorRaster,
  convertBitDepth, convertColor, readNormalizedSample, writeNormalizedSample, inspectIccProfile, parseIccProfile
} from '../src/image/image-core.js';
import { createSkewMatrix, createProjectiveTransform, mapProjectivePoint, createWarpDeformationPlan } from '../src/editor/transform-advanced.js';
import { applyNonDestructiveDeformation } from '../src/vector/deformation.js';
import { normalizeGradientFill, normalizePatternFill } from '../src/vector/fill-appearance.js';
import { updateTextObject } from '../src/editor/text-object.js';
import { UI_B_MENU_CONTRIBUTIONS, UI_B_TOOL_GROUPS, UI_B_DIALOGS, UI_B_CONTRIBUTION_REPORT } from './capability-contributions.js';
import { createRasterToolController, UI_B_RASTER_TOOL_IDS } from './capability-raster-tools.js';

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const number=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const fileSafe=value=>String(value||'INK').replace(/[\\/:*?"<>|]+/g,'-').trim()||'INK';

const ADJUSTMENT_DEFAULTS=Object.freeze({
  brightnessContrast:{brightness:0,contrast:0},levels:{black:0,white:255,gamma:1},curves:{points:[[0,0],[255,255]]},
  hueSaturation:{hue:0,saturation:0,lightness:0},colorBalance:{cyanRed:0,magentaGreen:0,yellowBlue:0},gradientMap:{},
  exposure:{exposure:0,offset:0,gamma:1},vibrance:{vibrance:0,saturation:0},blackWhite:{},photoFilter:{color:'#ffaa66',density:.25},
  channelMixer:{},colorLookup:{},invert:{},posterize:{levels:4},threshold:{level:128},selectiveColor:{}
});
const FILTER_DEFAULTS=Object.freeze({
  gaussianBlur:{radius:2},sharpen:{amount:1},highPass:{radius:2},edgeDetection:{amount:1},noiseGrain:{amount:.12},
  textureOverlay:{amount:.25},motionBlur:{radius:5,angle:0},median:{radius:2},unsharpMask:{radius:2,amount:1},
  emboss:{amount:1,angle:135},mosaic:{size:8},minimum:{radius:1},maximum:{radius:1},reduceNoise:{amount:.35}
});
const EFFECT_DEFAULTS=Object.freeze({
  dropShadow:{color:'#000000',opacity:.55,offsetX:8,offsetY:8,blur:12,spread:0},
  innerShadow:{color:'#000000',opacity:.4,offsetX:4,offsetY:4,blur:8,choke:0},
  outerGlow:{color:'#ffffff',opacity:.65,radius:10,spread:0},
  colorOverlay:{color:'#3b63fb',opacity:.6},
  stroke:{color:'#000000',opacity:1,size:3,position:'outside'}
});
const BLEND_MODES=Object.freeze(IMAGE_CAPABILITIES.blendModes||['source-over','multiply','screen','overlay']);

function htmlNode(markup){
  const template=document.createElement('template');template.innerHTML=markup.trim();return template.content.firstElementChild;
}
function button(label,attrs=''){return '<button type="button" '+attrs+'><span>'+esc(label)+'</span></button>';}
function selectOptions(values,current=null){return values.map(value=>'<option value="'+esc(value)+'"'+(String(value)===String(current)?' selected':'')+'>'+esc(value)+'</option>').join('');}
function downloadBytes(app,bytes,name,type='application/octet-stream'){
  const blob=bytes instanceof Blob?bytes:new Blob([bytes],{type});app.download(blob,name);
}
function selectedFound(app,predicate=()=>true){return app.selectedObjects().find(item=>predicate(item.object,item))||null;}
function objectTarget(app,found){return found?app.objectPath(found):null;}

function objectBoundsLocal(object){
  if(object.type==='path'){
    const points=(object.subpaths||[]).flatMap(sub=>(sub.anchors||[]).map(a=>({x:a.x,y:a.y})));
    if(points.length){const xs=points.map(p=>p.x),ys=points.map(p=>p.y);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};}
  }
  return{x:0,y:0,w:Math.max(1,number(object.w??object.width,100)),h:Math.max(1,number(object.h??object.height,100))};
}

function convertRasterMode(serialized,targetMode){
  const source=deserializeColorRaster(serialized);
  if(source.colorMode===targetMode)return serializeColorRaster(source);
  if(targetMode==='Multichannel')throw new Error('Multichannel conversion requires explicit channel construction');
  if(!['RGB','CMYK','Lab'].includes(source.colorMode)||!['RGB','CMYK','Lab'].includes(targetMode))throw new Error('Unsupported color-mode conversion');
  const out=createColorRaster({width:source.width,height:source.height,bitDepth:source.bitDepth,colorMode:targetMode});
  const count=source.width*source.height;
  for(let index=0;index<count;index++){
    const converted=convertColor(readNormalizedSample(source,index),source.colorMode,targetMode);
    writeNormalizedSample(out,index,converted);
  }
  if(source.alpha&&out.alpha)out.alpha.set(source.alpha);
  return serializeColorRaster(out);
}

function dialogShell(id,title,body,wide=false){
  return htmlNode('<section id="uiB-'+esc(id)+'" class="dialog-backdrop ui-b-dialog" data-ui-b-dialog="'+esc(id)+'" hidden>'+
    '<div class="dialog elevated-panel'+(wide?' ui-b-dialog-wide':'')+'">'+
    '<div class="panel-header"><div><span class="eyebrow">UI-B</span><strong>'+esc(title)+'</strong></div><button class="mini-button" data-ui-b-close="'+esc(id)+'" aria-label="關閉">×</button></div>'+
    '<div class="ui-b-dialog-body">'+body+'</div></div></section>');
}

export function installFullCapabilityControls(app){
  if(app.uiBControls)return app.uiBControls;
  const shell=window.INK_WEB_SHELL;
  const state={lastToolByGroup:new Map(),activeCapabilityTool:null,dialogContext:null,selectedChannel:null};
  const raster=createRasterToolController(app,{onStateChange:()=>refreshContextOptions()});

  function toast(message,time=2400){app.toast(message,time);}
  function closeMenus(){document.querySelectorAll('.application-menu.open').forEach(node=>node.classList.remove('open'));document.querySelectorAll('.application-command-menu').forEach(node=>node.hidden=true);}
  function openPanel(id){if(shell?.toggle)shell.toggle(id);else toast('Panel route unavailable');}

  function installMenus(){
    const byMenu=new Map();
    for(const item of UI_B_MENU_CONTRIBUTIONS){if(!byMenu.has(item.menu))byMenu.set(item.menu,[]);byMenu.get(item.menu).push(item);}
    for(const [menuId,items] of byMenu){
      const menu=$('#'+menuId+'Menu');if(!menu)continue;
      if(menuId==='filter')$$('button[disabled]',menu).forEach(node=>node.remove());
      let lastSection=null;
      for(const item of items){
        if(menu.querySelector('[data-ui-b-contribution="'+item.id+'"]'))continue;
        if(lastSection!==null&&lastSection!==item.section)menu.appendChild(htmlNode('<div class="application-menu-separator" role="separator"></div>'));
        const node=htmlNode('<button type="button" role="menuitem" data-ui-b-contribution="'+esc(item.id)+'" data-ui-b-command="'+esc(item.command)+'"><span>'+esc(item.label)+'</span>'+(item.shortcut?'<kbd>'+esc(item.shortcut)+'</kbd>':'')+'</button>');
        node.title=item.authority;menu.appendChild(node);lastSection=item.section;
      }
      menu.addEventListener('click',event=>{const command=event.target.closest('[data-ui-b-command]')?.dataset.uiBCommand;if(command)dispatch(command);});
    }
  }

  function createToolButton(group){
    const node=htmlNode('<button type="button" class="tool-button tool-stack ui-b-tool-group" data-ui-b-tool-group="'+esc(group.id)+'" aria-haspopup="menu" aria-expanded="false" title="'+esc(group.label)+'">'+
      '<span class="tool-icon ui-b-glyph" aria-hidden="true">'+esc(group.icon)+'</span><span class="tool-label">'+esc(group.label)+'</span><span class="stack-corner" aria-hidden="true"></span></button>');
    return node;
  }
  function ensureToolFlyout(){
    let flyout=$('#uiBToolFlyout');if(flyout)return flyout;
    flyout=htmlNode('<div id="uiBToolFlyout" class="brush-family-popover elevated-panel ui-b-tool-flyout" role="menu" hidden><div class="brush-family-list"></div></div>');
    $('.app')?.appendChild(flyout);
    flyout.addEventListener('click',event=>{const button=event.target.closest('[data-ui-b-tool]');if(!button)return;activateTool(button.dataset.uiBTool);flyout.hidden=true;});
    window.addEventListener('pointerdown',event=>{if(!flyout.hidden&&!flyout.contains(event.target)&&!event.target.closest('[data-ui-b-tool-group]'))flyout.hidden=true;});
    return flyout;
  }
  function openToolGroup(group,anchor){
    const flyout=ensureToolFlyout(),list=$('.brush-family-list',flyout);
    list.innerHTML=group.tools.map(([id,label])=>'<button type="button" class="subtool-button" data-ui-b-tool="'+esc(id)+'"><span class="ui-b-glyph" aria-hidden="true">•</span><span><strong>'+esc(label)+'</strong></span></button>').join('');
    const rect=anchor.getBoundingClientRect();flyout.style.left=Math.max(40,rect.right+2)+'px';flyout.style.top=Math.max(61,rect.top)+'px';flyout.hidden=false;
  }
  function installTools(){
    const rail=$('.tool-group');if(!rail)return;
    const existingDraw=$('#drawToolButton');
    const drawGroup=UI_B_TOOL_GROUPS.find(group=>group.id==='draw');
    if(existingDraw&&drawGroup){
      existingDraw.dataset.uiBToolGroup='draw';
      existingDraw.addEventListener('contextmenu',event=>{event.preventDefault();openToolGroup(drawGroup,existingDraw);});
    }
    const existingLasso=$('[data-tool="lasso"]');
    const lassoGroup=UI_B_TOOL_GROUPS.find(group=>group.id==='lasso');
    if(existingLasso&&lassoGroup){
      existingLasso.classList.add('tool-stack');existingLasso.dataset.uiBToolGroup='lasso';existingLasso.setAttribute('aria-haspopup','menu');
      if(!$('.stack-corner',existingLasso))existingLasso.appendChild(htmlNode('<span class="stack-corner" aria-hidden="true"></span>'));
      existingLasso.addEventListener('contextmenu',event=>{event.preventDefault();openToolGroup(lassoGroup,existingLasso);});
    }
    const insertion=existingLasso?.nextElementSibling;
    for(const group of UI_B_TOOL_GROUPS.filter(group=>!['draw','lasso'].includes(group.id))){
      if($('[data-ui-b-tool-group="'+group.id+'"]'))continue;
      const node=createToolButton(group);rail.insertBefore(node,insertion);
      node.addEventListener('click',()=>activateTool(state.lastToolByGroup.get(group.id)||group.primary));
      node.addEventListener('contextmenu',event=>{event.preventDefault();openToolGroup(group,node);});
      let timer=null;
      node.addEventListener('pointerdown',event=>{if(event.button!==0)return;timer=setTimeout(()=>openToolGroup(group,node),420);});
      ['pointerup','pointercancel','pointerleave'].forEach(type=>node.addEventListener(type,()=>{if(timer)clearTimeout(timer);timer=null;}));
    }
    if(existingDraw){
      const pop=$('#brushFamilyPopover .brush-family-list');
      if(pop)for(const [id,label] of [['blender','Blender'],['smudge','Smudge']]){
        if(pop.querySelector('[data-ui-b-tool="'+id+'"]'))continue;
        const node=htmlNode('<button type="button" class="subtool-button" data-ui-b-tool="'+id+'"><span class="ui-b-glyph">•</span><span><strong>'+label+'</strong></span></button>');
        pop.appendChild(node);node.addEventListener('click',()=>{activateTool(id);app.toggleBrushFamilyPopover(false);});
      }
    }
  }

  function activateTool(tool){
    state.activeCapabilityTool=tool;
    for(const group of UI_B_TOOL_GROUPS){if(group.tools.some(([id])=>id===tool))state.lastToolByGroup.set(group.id,tool);}
    if(UI_B_RASTER_TOOL_IDS.has(tool)){raster.setTool(tool);}
    else if(['blender','smudge'].includes(tool)){raster.clearTool();app.setTool(tool);}
    else if(['pen','pencil','marker','brush','airbrush','lasso'].includes(tool)){raster.clearTool();app.setTool(tool);}
    else raster.clearTool();
    $$('.ui-b-tool-group').forEach(button=>button.classList.toggle('active',UI_B_TOOL_GROUPS.find(group=>group.id===button.dataset.uiBToolGroup)?.tools.some(([id])=>id===tool)));
    refreshContextOptions();toast('工具：'+tool);
  }

  function ensureContextHost(){
    let host=$('#uiBCapabilityOptions');if(host)return host;
    host=htmlNode('<div id="uiBCapabilityOptions" class="contextual-tool-controls ui-b-context-controls" hidden></div>');
    $('.contextual-control-host')?.appendChild(host);return host;
  }
  function refreshContextOptions(){
    const host=ensureContextHost(),tool=raster.activeTool()||(['blender','smudge'].includes(state.activeCapabilityTool)?state.activeCapabilityTool:null);
    if(!tool){host.hidden=true;return;}
    host.hidden=false;
    const o=raster.options();
    const selectionTools=new Set(['polygonalLasso','magneticLasso','quickSelection','magicWand','objectSelection']);
    let markup='<span class="ui-b-context-name">'+esc(tool)+'</span>';
    if(selectionTools.has(tool))markup+='<select data-ui-b-option="selectionMode">'+selectOptions(['new','add','subtract','intersect'],o.selectionMode)+'</select><label>Tol <input type="number" min="0" max="255" value="'+o.tolerance+'" data-ui-b-option="tolerance"></label>';
    if(['magicWand','paintBucket'].includes(tool))markup+='<label><input type="checkbox" '+(o.contiguous?'checked':'')+' data-ui-b-option="contiguous"> Contiguous</label>';
    if(['quickSelection','objectSelection','magneticLasso'].includes(tool))markup+='<label>Edge <input type="number" min="0" max="255" value="'+o.edgeThreshold+'" data-ui-b-option="edgeThreshold"></label>';
    if(tool==='gradient')markup+='<select data-ui-b-option="gradientType">'+selectOptions(['linear','radial'],o.gradientType)+'</select><input type="color" value="'+o.gradientStart+'" data-ui-b-option="gradientStart"><input type="color" value="'+o.gradientEnd+'" data-ui-b-option="gradientEnd">';
    if(['cloneStamp','patternStamp','healingBrush','spotHealing','patch','dodge','burn','sponge','localBlur','localSharpen','colorReplacement'].includes(tool))markup+='<label>Size <input type="number" min="1" max="300" value="'+o.radius+'" data-ui-b-option="radius"></label><label>Strength <input type="number" min="0" max="1" step=".05" value="'+o.strength+'" data-ui-b-option="strength"></label>';
    if(['eyedropper','colorSampler'].includes(tool))markup+='<label>Radius <input type="number" min="0" max="32" value="'+o.sampleRadius+'" data-ui-b-option="sampleRadius"></label>';
    if(tool==='colorReplacement')markup+='<input type="color" value="'+o.replacementColor+'" data-ui-b-option="replacementColor">';
    if(tool==='sponge')markup+='<select data-ui-b-option="spongeMode">'+selectOptions(['saturate','desaturate'],o.spongeMode)+'</select>';
    if(['blender','smudge'].includes(tool))markup+='<span class="ui-b-context-hint">Brush Dynamics / Media → Properties</span>';
    host.innerHTML=markup;
    $$('[data-ui-b-option]',host).forEach(input=>{const key=input.dataset.uiBOption;const handler=()=>raster.setOption(key,input.type==='checkbox'?input.checked:input.type==='number'?number(input.value):input.value);input.addEventListener('input',handler);input.addEventListener('change',handler);});
  }

  function installPointerCapture(){
    const canvas=app.el.canvas;
    canvas.addEventListener('pointerdown',event=>raster.pointerDown(event),true);
    canvas.addEventListener('pointermove',event=>raster.pointerMove(event),true);
    canvas.addEventListener('pointerup',event=>raster.pointerUp(event,false),true);
    canvas.addEventListener('pointercancel',event=>raster.pointerUp(event,true),true);
  }

  function selectedImage(){
    const found=selectedFound(app,object=>object.type==='image'&&object.rasterState?.colorRaster);
    if(!found){toast('請先選取具有 Raster State 的影像');return null;}return found;
  }
  function selectedObject(){const found=selectedFound(app);if(!found)toast('請先選取物件');return found;}
  function mutateObject(label,found,fn){if(!found)return;app.history.pushScoped(label,[objectTarget(app,found)],()=>fn(found.object,found));app.spatialDirty=true;app.refreshAll();app.renderer.render();}

  function addAdjustment(type){
    const found=selectedImage();if(!found)return;
    mutateObject('新增 Adjustment：'+type,found,object=>{object.adjustments=object.adjustments||[];object.adjustments.push(createAdjustment(type,ADJUSTMENT_DEFAULTS[type]||{}));});
    refreshPanels();toast('Adjustment：'+type);
  }
  function addFilter(type,params=null){
    const found=selectedImage();if(!found)return;
    mutateObject('新增 Filter：'+type,found,object=>{object.filterStack=object.filterStack||[];object.filterStack.push(createFilter(type,params||FILTER_DEFAULTS[type]||{}));});
    refreshPanels();toast('Filter：'+type);
  }
  function addLayerEffect(type,params){
    const found=selectedImage();if(!found)return;
    mutateObject('新增 Layer Effect：'+type,found,object=>{object.effects=object.effects||[];object.effects.push(createLayerEffect(type,params||EFFECT_DEFAULTS[type]||{}));});
    refreshPanels();
  }

  function installPanels(){
    const adjustments=$('[data-shell-panel-section="adjustments"] .shell-panel-body');
    if(adjustments){
      adjustments.innerHTML='<div class="ui-b-panel-grid" id="uiBAdjustmentGrid"></div><div id="uiBAdjustmentStack" class="ui-b-stack-list"></div>';
      $('#uiBAdjustmentGrid').innerHTML=Object.keys(ADJUSTMENT_DEFAULTS).map(type=>button(type,'data-ui-b-adjustment="'+esc(type)+'"')).join('');
      $('#uiBAdjustmentGrid').addEventListener('click',event=>{const type=event.target.closest('[data-ui-b-adjustment]')?.dataset.uiBAdjustment;if(type)addAdjustment(type);});
    }
    const channels=$('[data-shell-panel-section="channels"] .shell-panel-body');
    if(channels)channels.innerHTML='<div id="uiBChannelsList" class="ui-b-stack-list"></div><div class="ui-b-panel-actions">'+button('Add Alpha','data-ui-b-channel="add-alpha"')+button('Add Spot','data-ui-b-channel="add-spot"')+button('Remove','data-ui-b-channel="remove"')+'</div>';
    channels?.addEventListener('click',event=>{const cmd=event.target.closest('[data-ui-b-channel]')?.dataset.uiBChannel;if(cmd)channelCommand(cmd);});
    const layers=$('[data-shell-panel-section="layers"] .shell-panel-body')||$('[data-content="layers"]');
    if(layers&&!$('#uiBLayerAppearance')){
      const block=htmlNode('<div id="uiBLayerAppearance" class="ui-b-layer-appearance"><label>Blend <select id="uiBBlendMode">'+selectOptions(BLEND_MODES)+'</select></label><button type="button" data-ui-b-command="mask-add">Mask</button><button type="button" data-ui-b-command="layer-effects">fx</button><button type="button" data-ui-b-command="select-and-mask">Select and Mask</button></div>');
      layers.prepend(block);
      block.addEventListener('click',event=>{const command=event.target.closest('[data-ui-b-command]')?.dataset.uiBCommand;if(command)dispatch(command);});
      $('#uiBBlendMode').addEventListener('change',event=>{const found=selectedObject();if(found)mutateObject('Blend Mode',found,object=>object.blendMode=event.target.value);});
    }
    const objectPanel=$('[data-content="object"]');
    if(objectPanel&&!$('#uiBRasterProperties'))objectPanel.appendChild(htmlNode('<div id="uiBRasterProperties" class="property-card ui-b-raster-properties"><div class="subpanel-title"><strong>Raster / Image</strong><span>UI-B</span></div><div id="uiBRasterStateReadout" class="shell-panel-note">No raster selected</div><div class="ui-b-panel-actions">'+button('Crop…','data-ui-b-command="image-crop"')+button('Resize…','data-ui-b-command="image-resize"')+button('Profile…','data-ui-b-command="color-profile"')+'</div><div id="uiBFilterStack" class="ui-b-stack-list"></div><div id="uiBEffectStack" class="ui-b-stack-list"></div></div>'));
    objectPanel?.addEventListener('click',event=>{const command=event.target.closest('[data-ui-b-command]')?.dataset.uiBCommand;if(command)dispatch(command);});
    refreshPanels();
  }

  function refreshPanels(){
    const found=selectedFound(app),object=found?.object;
    const blend=$('#uiBBlendMode');if(blend)blend.value=object?.blendMode||'source-over';
    const readout=$('#uiBRasterStateReadout');
    if(readout){
      if(object?.rasterState?.colorRaster){const r=deserializeColorRaster(object.rasterState.colorRaster);readout.textContent=r.width+'×'+r.height+' · '+r.bitDepth+'-bit · '+r.colorMode+(object.rasterState.icc?.inspection?' · ICC':'');}
      else readout.textContent='No raster selected';
    }
    const filterStack=$('#uiBFilterStack');if(filterStack)filterStack.innerHTML=(object?.filterStack||[]).map((item,index)=>'<div class="ui-b-stack-row"><span>'+esc(item.type)+'</span><button data-ui-b-filter-remove="'+index+'">×</button></div>').join('');
    filterStack?.querySelectorAll('[data-ui-b-filter-remove]').forEach(button=>button.addEventListener('click',()=>{const current=selectedImage();if(!current)return;const index=Number(button.dataset.uiBFilterRemove);mutateObject('移除 Filter',current,obj=>obj.filterStack.splice(index,1));}));
    const effectStack=$('#uiBEffectStack');if(effectStack)effectStack.innerHTML=(object?.effects||[]).map((item,index)=>'<div class="ui-b-stack-row"><span>fx · '+esc(item.type)+'</span><button data-ui-b-effect-remove="'+index+'">×</button></div>').join('');
    effectStack?.querySelectorAll('[data-ui-b-effect-remove]').forEach(button=>button.addEventListener('click',()=>{const current=selectedImage();if(!current)return;const index=Number(button.dataset.uiBEffectRemove);mutateObject('移除 Effect',current,obj=>obj.effects.splice(index,1));}));
    const adjustmentStack=$('#uiBAdjustmentStack');if(adjustmentStack)adjustmentStack.innerHTML=(object?.adjustments||[]).map((item,index)=>'<div class="ui-b-stack-row"><span>'+esc(item.type)+'</span><button data-ui-b-adjustment-remove="'+index+'">×</button></div>').join('');
    adjustmentStack?.querySelectorAll('[data-ui-b-adjustment-remove]').forEach(button=>button.addEventListener('click',()=>{const current=selectedImage();if(!current)return;const index=Number(button.dataset.uiBAdjustmentRemove);mutateObject('移除 Adjustment',current,obj=>obj.adjustments.splice(index,1));}));
    refreshChannels();
  }

  function refreshChannels(){
    const list=$('#uiBChannelsList');if(!list)return;
    const found=selectedFound(app,object=>object.type==='image'&&object.rasterState?.colorRaster);
    if(!found){list.innerHTML='<p class="shell-panel-note">Select a raster image to inspect channels.</p>';return;}
    const raster=deserializeColorRaster(found.object.rasterState.colorRaster),stateImage=found.object.rasterState;
    const rows=raster.channelNames.map((name,index)=>({kind:'process',index,name})).concat((stateImage.alphaChannels||[]).map((channel,index)=>({kind:'alpha',index,name:channel.name||'Alpha '+(index+1)})),(stateImage.spotChannels||[]).map((channel,index)=>({kind:'spot',index,name:channel.name||'Spot '+(index+1)})));
    list.innerHTML=rows.map(row=>'<button class="ui-b-channel-row'+(state.selectedChannel&&state.selectedChannel.kind===row.kind&&state.selectedChannel.index===row.index?' active':'')+'" data-ui-b-channel-select="'+row.kind+':'+row.index+'"><span>'+esc(row.name)+'</span><small>'+row.kind+'</small></button>').join('');
    $$('[data-ui-b-channel-select]',list).forEach(button=>button.addEventListener('click',()=>{const [kind,index]=button.dataset.uiBChannelSelect.split(':');state.selectedChannel={kind,index:Number(index)};refreshChannels();}));
  }
  function channelCommand(command){
    const found=selectedImage();if(!found)return;
    const stateImage=found.object.rasterState,raster=deserializeColorRaster(stateImage.colorRaster),length=raster.width*raster.height;
    mutateObject('Channel '+command,found,object=>{
      object.rasterState.alphaChannels=object.rasterState.alphaChannels||[];object.rasterState.spotChannels=object.rasterState.spotChannels||[];
      if(command==='add-alpha')object.rasterState.alphaChannels.push({id:'alpha-'+Date.now().toString(36),name:'Alpha '+(object.rasterState.alphaChannels.length+1),kind:'alpha',data:Array(length).fill(0)});
      else if(command==='add-spot')object.rasterState.spotChannels.push({id:'spot-'+Date.now().toString(36),name:'Spot '+(object.rasterState.spotChannels.length+1),kind:'spot',data:Array(length).fill(0),previewColor:[255,0,0],solidity:.5});
      else if(command==='remove'&&state.selectedChannel?.kind==='alpha')object.rasterState.alphaChannels.splice(state.selectedChannel.index,1);
      else if(command==='remove'&&state.selectedChannel?.kind==='spot')object.rasterState.spotChannels.splice(state.selectedChannel.index,1);
    });state.selectedChannel=null;refreshPanels();
  }

  function installDialogs(){
    const root=$('.app');if(!root)return;
    const specs=[
      ['select-and-mask','Select and Mask','<label>Smooth <input id="uiBMaskSmooth" type="number" value="0" min="0" max="20"></label><label>Feather <input id="uiBMaskFeather" type="number" value="0" min="0" max="50"></label><label>Expand <input id="uiBMaskExpand" type="number" value="0" min="-50" max="50"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="select-and-mask">Apply Mask</button></div>'],
      ['layer-effects','Layer Effects','<label>Effect <select id="uiBEffectType">'+selectOptions(Object.keys(EFFECT_DEFAULTS))+'</select></label><label>Color <input id="uiBEffectColor" type="color" value="#000000"></label><label>Opacity <input id="uiBEffectOpacity" type="number" min="0" max="1" step=".05" value=".6"></label><label>Size/Radius <input id="uiBEffectSize" type="number" min="0" max="200" value="8"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="layer-effects">Add Effect</button></div>'],
      ['filter-params','Filter','<div id="uiBFilterName" class="ui-b-dialog-note"></div><label>Amount / Radius <input id="uiBFilterAmount" type="number" min="0" max="100" step=".1" value="2"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="filter-params">Add Filter</button></div>'],
      ['filter-gallery','Filter Gallery','<div id="uiBFilterGalleryList" class="ui-b-gallery"></div>'],
      ['liquify','Liquify','<label>Operation <select id="uiBLiquifyType">'+selectOptions(['forwardWarp','twirl','pucker','bloat','reconstruct'])+'</select></label><label>Radius <input id="uiBLiquifyRadius" type="number" min="1" max="1000" value="80"></label><label>Strength <input id="uiBLiquifyStrength" type="number" min="-1" max="1" step=".05" value=".4"></label><label>dx <input id="uiBLiquifyDx" type="number" value="12"></label><label>dy <input id="uiBLiquifyDy" type="number" value="0"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="liquify">Add Liquify Filter</button></div>'],
      ['gradient-editor','Gradient Editor','<label>Type <select id="uiBGradientType">'+selectOptions(['linear','radial'])+'</select></label><label>Start <input id="uiBGradientStart" type="color" value="#202020"></label><label>End <input id="uiBGradientEnd" type="color" value="#ffffff"></label><label>Opacity <input id="uiBGradientOpacity" type="number" min="0" max="1" step=".05" value="1"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="gradient-editor">Apply to selected Path</button></div>'],
      ['pattern-editor','Pattern Fill','<label>Pattern ref <input id="uiBPatternRef" type="text" value="pattern-default"></label><label>Scale <input id="uiBPatternScale" type="number" step=".1" value="1"></label><label>Rotation <input id="uiBPatternRotation" type="number" value="0"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="pattern-editor">Apply to selected Path</button></div>'],
      ['color-profile','Color Profile','<div id="uiBProfileReadout" class="ui-b-dialog-note">No profile</div><input id="uiBProfileInput" type="file" accept=".icc,.icm" hidden><div class="button-row"><button data-ui-b-profile-load>Load ICC…</button></div>'],
      ['image-size','Image Size','<label>Width <input id="uiBImageWidth" type="number" min="1"></label><label>Height <input id="uiBImageHeight" type="number" min="1"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="image-size">Resize</button></div>'],
      ['image-crop','Crop Image','<label>X <input id="uiBCropX" type="number" min="0" value="0"></label><label>Y <input id="uiBCropY" type="number" min="0" value="0"></label><label>Width <input id="uiBCropW" type="number" min="1"></label><label>Height <input id="uiBCropH" type="number" min="1"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="image-crop">Crop</button></div>'],
      ['advanced-transform','Advanced Transform','<div id="uiBTransformMode" class="ui-b-dialog-note"></div><label>A <input id="uiBTransformA" type="number" step=".1" value="10"></label><label>B <input id="uiBTransformB" type="number" step=".1" value="0"></label><div class="button-row"><button class="primary-button" data-ui-b-apply="advanced-transform">Apply</button></div>'],
      ['keyboard-shortcuts','Keyboard Shortcuts','<div class="ui-b-shortcuts"><p><kbd>V</kbd> Select</p><p><kbd>F</kbd> Fit</p><p><kbd>R</kbd> Rulers</p><p><kbd>Ctrl+Z</kbd> Undo</p><p><kbd>Ctrl+Shift+Z</kbd> Redo</p><p><kbd>Delete</kbd> Delete selection</p><p><kbd>Space</kbd> temporary Pan</p><p><kbd>Shift</kbd> constrained/angle snap</p></div>'],
      ['pen-calibration','Pen Calibration','<p class="ui-b-dialog-note">Calibration profile uses the existing device-validation authority.</p><div class="button-row"><button data-ui-b-pen-calibration-open>Open Specialist calibration controls</button></div>'],
      ['recovery','Recovery','<p class="ui-b-dialog-note">Recovery uses the existing storage/checkpoint authority. No second autosave model is created.</p>']
    ];
    for(const [id,title,body] of specs)if(!$('#uiB-'+id))root.appendChild(dialogShell(id,title,body,['filter-gallery','liquify'].includes(id)));
    root.addEventListener('click',event=>{
      const close=event.target.closest('[data-ui-b-close]');if(close){closeDialog(close.dataset.uiBClose);return;}
      const apply=event.target.closest('[data-ui-b-apply]');if(apply){applyDialog(apply.dataset.uiBApply);return;}
      if(event.target.closest('[data-ui-b-profile-load]'))$('#uiBProfileInput')?.click();
      if(event.target.closest('[data-ui-b-pen-calibration-open]')){closeDialog('pen-calibration');openPanel('specialist');$('#calibrationProfileSelect')?.scrollIntoView({block:'center'});}
    });
    $('#uiBProfileInput')?.addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{const bytes=new Uint8Array(await file.arrayBuffer()),profile=parseIccProfile(bytes),inspection=inspectIccProfile(profile),found=selectedImage();if(!found)return;mutateObject('Assign ICC Profile',found,object=>{object.rasterState.icc={bytes:Array.from(bytes),inspection};});refreshProfileDialog();toast('ICC profile assigned');}catch(error){toast('ICC：'+error.message,3000);}});
  }

  function openDialog(id,context=null){
    state.dialogContext=context;
    const dialog=$('#uiB-'+id);if(!dialog){toast('Dialog unavailable: '+id);return;}
    if(id==='filter-gallery')refreshFilterGallery();
    if(id==='color-profile')refreshProfileDialog();
    if(id==='image-size'||id==='image-crop'){const found=selectedImage();if(!found)return;const raster=deserializeColorRaster(found.object.rasterState.colorRaster);if(id==='image-size'){$('#uiBImageWidth').value=raster.width;$('#uiBImageHeight').value=raster.height;}else{$('#uiBCropW').value=raster.width;$('#uiBCropH').value=raster.height;}}
    if(id==='filter-params')$('#uiBFilterName').textContent=context?.type||'Filter';
    if(id==='advanced-transform')$('#uiBTransformMode').textContent=context?.mode||'Transform';
    dialog.hidden=false;closeMenus();
  }
  function closeDialog(id){const dialog=$('#uiB-'+id);if(dialog)dialog.hidden=true;state.dialogContext=null;}
  function refreshFilterGallery(){
    const list=$('#uiBFilterGalleryList');if(!list)return;
    const descriptors=FILTER_GALLERY||[];
    list.innerHTML=descriptors.map(entry=>'<button data-ui-b-gallery-filter="'+esc(entry.id||entry.type||entry.name)+'"><strong>'+esc(entry.name||entry.id||entry.type)+'</strong><span>'+esc(entry.group||entry.category||'Filter')+'</span></button>').join('');
    $$('[data-ui-b-gallery-filter]',list).forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.uiBGalleryFilter;addFilter(id);closeDialog('filter-gallery');}));
  }
  function refreshProfileDialog(){
    const readout=$('#uiBProfileReadout');if(!readout)return;
    const found=selectedFound(app,object=>object.type==='image'&&object.rasterState?.colorRaster);
    const inspection=found?.object.rasterState?.icc?.inspection;
    readout.textContent=inspection?JSON.stringify({versionMajor:inspection.versionMajor,colorSpace:inspection.colorSpace,pcs:inspection.pcs,fingerprint:inspection.fingerprint},null,2):'No embedded ICC profile';
  }

  function applyDialog(id){
    try{
      if(id==='select-and-mask'){
        const selection=raster.refineSelection({smooth:number($('#uiBMaskSmooth').value),feather:number($('#uiBMaskFeather').value),expand:number($('#uiBMaskExpand').value)});
        const found=selectedImage();if(!found)return;
        mutateObject('Select and Mask',found,object=>object.rasterMask=createRasterMask(selection.width,selection.height,selection.alpha,{feather:number($('#uiBMaskFeather').value),expand:number($('#uiBMaskExpand').value)}));closeDialog(id);
      }else if(id==='layer-effects'){
        const type=$('#uiBEffectType').value,color=$('#uiBEffectColor').value,opacity=number($('#uiBEffectOpacity').value,.6),size=number($('#uiBEffectSize').value,8);
        const params={...(EFFECT_DEFAULTS[type]||{}),color,opacity};if(type==='stroke')params.size=size;else params.radius=size;addLayerEffect(type,params);closeDialog(id);
      }else if(id==='filter-params'){
        const type=state.dialogContext?.type;if(type){const amount=number($('#uiBFilterAmount').value,2),base={...(FILTER_DEFAULTS[type]||{})};if('radius' in base)base.radius=amount;else if('amount' in base)base.amount=amount;else if('size' in base)base.size=amount;addFilter(type,base);}closeDialog(id);
      }else if(id==='liquify'){
        const found=selectedImage();if(!found)return;
        const type=$('#uiBLiquifyType').value,radius=number($('#uiBLiquifyRadius').value,80),strength=number($('#uiBLiquifyStrength').value,.4),dx=number($('#uiBLiquifyDx').value,12),dy=number($('#uiBLiquifyDy').value,0);
        const object=found.object,rasterState=deserializeColorRaster(object.rasterState.colorRaster),x=rasterState.width/2,y=rasterState.height/2,filter=createLiquifyFilter([{type,x,y,radius,strength,dx,dy}],{maxWork:Math.max(4096,rasterState.width*rasterState.height*2)});
        mutateObject('Liquify',found,obj=>{obj.filterStack=obj.filterStack||[];obj.filterStack.push(filter);});closeDialog(id);
      }else if(id==='gradient-editor'){
        const found=selectedFound(app,object=>object.type==='path');if(!found){toast('請先選取 Path');return;}
        const descriptor=normalizeGradientFill({type:$('#uiBGradientType').value,start:{x:0,y:0},end:{x:1,y:0},center:{x:.5,y:.5},radius:.5,stops:[{offset:0,color:$('#uiBGradientStart').value},{offset:1,color:$('#uiBGradientEnd').value}],opacity:number($('#uiBGradientOpacity').value,1)});
        mutateObject('Vector Gradient',found,object=>object.fillAppearance=descriptor);closeDialog(id);toast('Gradient descriptor 已套用；renderer fidelity 由既有 authority 決定');
      }else if(id==='pattern-editor'){
        const found=selectedFound(app,object=>object.type==='path');if(!found){toast('請先選取 Path');return;}
        const descriptor=normalizePatternFill({patternRef:$('#uiBPatternRef').value,scale:number($('#uiBPatternScale').value,1),rotation:number($('#uiBPatternRotation').value,0)});
        mutateObject('Pattern Fill',found,object=>object.fillAppearance=descriptor);closeDialog(id);
      }else if(id==='image-size')resizeSelectedImage();
      else if(id==='image-crop')cropSelectedImage();
      else if(id==='advanced-transform')applyAdvancedTransform(state.dialogContext?.mode);
    }catch(error){console.error(error);toast(error.message||('UI-B '+id+' failed'),3200);}
  }

  function resizeSelectedImage(){
    const found=selectedImage();if(!found)return;const raster=deserializeColorRaster(found.object.rasterState.colorRaster),preview=colorRasterToRgba8(found.object.rasterState.colorRaster,{icc:found.object.rasterState.icc?.bytes||null});
    if(preview.status!=='ok'||raster.bitDepth!==8||raster.colorMode!=='RGB'){toast('目前 UI resize 僅對 8-bit RGB raster 啟用');return;}
    const width=Math.max(1,Math.floor(number($('#uiBImageWidth').value,raster.width))),height=Math.max(1,Math.floor(number($('#uiBImageHeight').value,raster.height))),result=resizeImageData(preview.imageData,width,height);
    const rgb=new Uint8Array(width*height*3),alpha=new Uint8Array(width*height);for(let i=0;i<width*height;i++){rgb[i*3]=result.data[i*4];rgb[i*3+1]=result.data[i*4+1];rgb[i*3+2]=result.data[i*4+2];alpha[i]=result.data[i*4+3];}
    mutateObject('Image Resize',found,object=>{object.rasterState.colorRaster=serializeColorRaster(createColorRaster({width,height,bitDepth:8,colorMode:'RGB',data:rgb,alpha}));object.w=width;object.h=height;});closeDialog('image-size');
  }
  function cropSelectedImage(){
    const found=selectedImage();if(!found)return;const raster=deserializeColorRaster(found.object.rasterState.colorRaster),preview=colorRasterToRgba8(found.object.rasterState.colorRaster,{icc:found.object.rasterState.icc?.bytes||null});
    if(preview.status!=='ok'||raster.bitDepth!==8||raster.colorMode!=='RGB'){toast('目前 UI crop 僅對 8-bit RGB raster 啟用');return;}
    const result=cropImageData(preview.imageData,{x:number($('#uiBCropX').value),y:number($('#uiBCropY').value),w:number($('#uiBCropW').value,raster.width),h:number($('#uiBCropH').value,raster.height)}),rgb=new Uint8Array(result.width*result.height*3),alpha=new Uint8Array(result.width*result.height);
    for(let i=0;i<result.width*result.height;i++){rgb[i*3]=result.data[i*4];rgb[i*3+1]=result.data[i*4+1];rgb[i*3+2]=result.data[i*4+2];alpha[i]=result.data[i*4+3];}
    mutateObject('Image Crop',found,object=>{object.rasterState.colorRaster=serializeColorRaster(createColorRaster({width:result.width,height:result.height,bitDepth:8,colorMode:'RGB',data:rgb,alpha}));object.w=result.width;object.h=result.height;});closeDialog('image-crop');
  }

  function setBitDepth(depth){
    const found=selectedImage();if(!found)return;const target=Number(depth);
    mutateObject('Bit Depth '+target,found,object=>{object.rasterState.colorRaster=serializeColorRaster(convertBitDepth(deserializeColorRaster(object.rasterState.colorRaster),target));app.doc.colorState={...(app.doc.colorState||{}),bitDepth:target};});refreshPanels();
  }
  function setColorMode(mode){
    const found=selectedImage();if(!found)return;
    try{mutateObject('Color Mode '+mode,found,object=>{object.rasterState.colorRaster=convertRasterMode(object.rasterState.colorRaster,mode);app.doc.colorState={...(app.doc.colorState||{}),colorMode:mode};});refreshPanels();}
    catch(error){toast(error.message,3200);}
  }

  function applyAdvancedTransform(mode){
    const found=selectedObject();if(!found)return;
    const a=number($('#uiBTransformA').value,10),b=number($('#uiBTransformB').value,0);
    if(mode==='skew'){
      const bounds=app.renderer.objectWorldBounds(found.object,found.parentWorldMatrix),pivot={x:bounds.x+bounds.w/2,y:bounds.y+bounds.h/2},matrix=createSkewMatrix({xDegrees:a,yDegrees:b,pivot});
      app.history.pushScoped('Skew',[app.objectPath(found)],()=>{const current=app.findObject({layerId:found.layer.id,objectId:found.object.id});if(current)current.object.matrix=M.multiply(matrix,current.object.matrix||M.identity());});app.refreshAll();closeDialog('advanced-transform');return;
    }
    if(mode==='warp'){
      if(found.object.type!=='path'){toast('Warp 目前只對 Path 啟用');return;}
      const plan=createWarpDeformationPlan(objectBoundsLocal(found.object),{strength:clamp(a/100,-1,1),maxDisplacement:clamp(Math.abs(b||.5),0,.5)});
      mutateObject('Warp',found,object=>applyNonDestructiveDeformation(object,{bend:plan.parameters.bend}));closeDialog('advanced-transform');return;
    }
    if(!['distort','perspective'].includes(mode)||found.object.type!=='path'){toast('Distort/Perspective 目前需選取 Path');return;}
    const bounds=objectBoundsLocal(found.object),source=[{x:bounds.x,y:bounds.y},{x:bounds.x+bounds.w,y:bounds.y},{x:bounds.x+bounds.w,y:bounds.y+bounds.h},{x:bounds.x,y:bounds.y+bounds.h}],dest=source.map(point=>({...point}));
    dest[0].x+=a;dest[1].y+=b;dest[2].x-=a;dest[3].y-=b;const matrix=createProjectiveTransform(source,dest);
    mutateObject(mode==='distort'?'Distort':'Perspective',found,object=>{for(const sub of object.subpaths||[])for(const anchor of sub.anchors||[]){const center=mapProjectivePoint(matrix,{x:anchor.x,y:anchor.y}),incoming=mapProjectivePoint(matrix,{x:anchor.x+(anchor.in?.x||0),y:anchor.y+(anchor.in?.y||0)}),outgoing=mapProjectivePoint(matrix,{x:anchor.x+(anchor.out?.x||0),y:anchor.y+(anchor.out?.y||0)});anchor.x=center.x;anchor.y=center.y;anchor.in={x:incoming.x-center.x,y:incoming.y-center.y};anchor.out={x:outgoing.x-center.x,y:outgoing.y-center.y};}});closeDialog('advanced-transform');
  }

  function updateTextMode(mode){
    app.uiBTextMode=mode;app.setTool('text');
    const found=selectedFound(app,object=>object.type==='text');
    if(found)mutateObject('Text Writing Mode',found,object=>updateTextObject(object,{writingMode:mode}));
    toast('Text mode：'+mode);
  }
  function textOnPath(){
    const selected=app.selectedObjects(),text=selected.find(item=>item.object.type==='text'),path=selected.find(item=>item.object.type==='path');
    if(!text||!path){toast('請同時選取 Text 與 Path');return;}
    mutateObject('Text on Path',text,object=>updateTextObject(object,{pathText:{pathId:path.object.id,startOffset:0}}));toast('Text-on-Path descriptor 已建立');
  }

  function addMask(){
    const found=selectedImage();if(!found)return;const selection=raster.selection(),r=deserializeColorRaster(found.object.rasterState.colorRaster);
    const alpha=selection?.alpha&&selection.width===r.width&&selection.height===r.height?selection.alpha:new Uint8ClampedArray(r.width*r.height).fill(255);
    mutateObject('建立 Mask',found,object=>object.rasterMask=createRasterMask(r.width,r.height,alpha));refreshPanels();
  }

  async function openExternalImage(){
    let input=$('#uiBExternalImageInput');if(!input){input=htmlNode('<input id="uiBExternalImageInput" type="file" accept=".psd,.psb,.tif,.tiff,.exr,.raw,application/octet-stream" hidden>');$('.app').appendChild(input);input.addEventListener('change',async event=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;try{await app.importImageFormat(new Uint8Array(await file.arrayBuffer()),{name:file.name});toast('已匯入 '+file.name);}catch(error){console.error(error);toast('外部格式匯入失敗：'+error.message,3600);}});}input.click();
  }

  function installExportInterop(){
    const select=$('#exportFormat');if(!select)return;
    for(const [value,label] of [['psd','PSD（flattened bounded）'],['tiff','TIFF'],['exr','EXR'],['psb','PSB（需要 adapter）'],['raw','RAW（不可匯出）']])if(!select.querySelector('option[value="'+value+'"]'))select.appendChild(htmlNode('<option value="'+value+'">'+label+'</option>'));
    const baseRun=app.runExport.bind(app),baseRefresh=app.refreshExportUI.bind(app);
    app.refreshExportUI=function(){baseRefresh();const format=$('#exportFormat').value;if(['psd','tiff','exr','psb','raw'].includes(format)){const summary=$('#exportSummary');if(format==='psb')summary.textContent='PSB encoder：adapter required；不會假裝成功';else if(format==='raw')summary.textContent='RAW export 不在 promoted P1-H contract';else summary.textContent=format.toUpperCase()+'：輸出目前選取的 Raster State；保留能力依 bounded codec disclosure';}};
    app.runExport=async function(){
      const format=$('#exportFormat').value;if(!['psd','tiff','exr','psb','raw'].includes(format))return baseRun();
      if(format==='raw')throw new Error('RAW export is not supported by the promoted P1-H contract');
      if(format==='psb')throw new Error('PSB encode requires a registered adapter');
      const found=selectedImage();if(!found)return;
      try{const bytes=app.exportImageFormat(format.toUpperCase(),found.object);downloadBytes(app,bytes,fileSafe(app.doc.title)+'.'+format);$('#exportDialog').hidden=true;toast(format.toUpperCase()+' 已建立');}catch(error){toast('匯出失敗：'+error.message,3600);}
    };
    select.addEventListener('change',()=>app.refreshExportUI());
  }

  async function dispatch(command){
    try{
      if(command.startsWith('panel:'))return openPanel(command.slice(6));
      if(command.startsWith('tool:'))return activateTool(command.slice(5));
      if(command.startsWith('filter:')){const type=command.slice(7);return openDialog('filter-params',{type});}
      if(command.startsWith('bit-depth:'))return setBitDepth(command.slice(10));
      if(command.startsWith('color-mode:'))return setColorMode(command.slice(11));
      if(command.startsWith('text-mode:'))return updateTextMode(command.slice(10));
      if(command.startsWith('transform:'))return openDialog('advanced-transform',{mode:command.slice(10)});
      if(command.startsWith('arrange:'))return app.reorderSelection(command.endsWith('front')?'front':'back');
      if(command.startsWith('snap:')){
        const kind=command.slice(5);if(kind==='enabled')app.setSnapEnabledState(!app.page().snap?.enabled);else app.setSnapCategoryState(kind,!app.page().snap?.categories?.[kind]);return;
      }
      if(command.startsWith('workspace:'))return app.switchWorkspace(command.slice(10),{fit:false});
      if(command==='external-open')return openExternalImage();
      if(command==='reference-import'){openPanel('reference');return;}
      if(command==='svg-import'){openPanel('specialist');$('#svgStudioInput')?.click();return;}
      if(command==='print'){app.openExport();$('#exportFormat').value='print';app.refreshExportUI();return;}
      if(command==='duplicate')return app.duplicateSelection();
      if(command==='delete')return app.deleteSelection();
      if(command==='canvas-settings')return $('#canvasSettingsToggle')?.click();
      if(command==='image-adjustments')return openPanel('adjustments');
      if(command==='color-profile')return openDialog('color-profile');
      if(command==='image-crop')return openDialog('image-crop');
      if(command==='image-resize')return openDialog('image-size');
      if(command==='layer-new')return app.addLayer();
      if(command==='layer-duplicate')return app.duplicateLayer();
      if(command==='layer-delete')return app.deleteLayer();
      if(command==='group')return app.groupSelection();
      if(command==='ungroup')return app.ungroupSelection();
      if(command==='mask-add')return addMask();
      if(command==='select-and-mask')return openDialog('select-and-mask');
      if(command==='layer-effects')return openDialog('layer-effects');
      if(command==='text-on-path')return textOnPath();
      if(command==='select-all'){const p=app.page();app.selection=p.layers.flatMap(layer=>layer.visible===false?[]:layer.objects.map(object=>({layerId:layer.id,objectId:object.id})));app.refreshSelectionUI();app.renderer.render();return;}
      if(command==='select-clear')return app.clearSelection();
      if(command==='filter-gallery')return openDialog('filter-gallery');
      if(command==='liquify')return openDialog('liquify');
      if(command==='guides:toggle'){const guides=app.page().guides||[];const visible=guides.some(guide=>guide.visible!==false);for(const guide of guides)app.setGuideVisible(guide.id,!visible);return;}
      if(command==='keyboard-shortcuts')return openDialog('keyboard-shortcuts');
      if(command==='updates'){openPanel('specialist');$('#checkUpdatesBtn')?.click();return;}
      if(command==='pen-calibration')return openDialog('pen-calibration');
      toast('UI-B route：'+command);
    }catch(error){console.error(error);toast(error.message||('UI-B command failed: '+command),3200);}
  }

  function bridgeLegacySpecialist(){
    const adjustmentAdd=$('#adjustmentAdd'),filterAdd=$('#filterAdd'),maskAdd=$('#maskAdd');
    adjustmentAdd?.addEventListener('click',()=>{const type=$('#adjustmentType')?.value;if(type)addAdjustment(type);});
    filterAdd?.addEventListener('click',()=>{const type=$('#filterType')?.value;if(type)addFilter(type);});
    maskAdd?.addEventListener('click',()=>addMask());
  }

  function installLifecycleRefresh(){
    const original=app.refreshSelectionUI.bind(app);
    app.refreshSelectionUI=function(){const result=original();refreshPanels();return result;};
  }

  installMenus();installTools();installPointerCapture();installPanels();installDialogs();installExportInterop();bridgeLegacySpecialist();installLifecycleRefresh();refreshContextOptions();refreshPanels();

  const api={
    version:'1.0',app,state,raster,registry:UI_B_CONTRIBUTION_REPORT,
    dispatch,activateTool,openDialog,closeDialog,refreshPanels,
    addAdjustment,addFilter,addLayerEffect,addMask
  };
  app.uiBControls=api;window.INK_UI_B=api;
  document.dispatchEvent(new CustomEvent('ink:ui-b-controls-ready',{detail:{menuCount:UI_B_CONTRIBUTION_REPORT.menuCount,toolGroupCount:UI_B_CONTRIBUTION_REPORT.toolGroupCount}}));
  return api;
}
