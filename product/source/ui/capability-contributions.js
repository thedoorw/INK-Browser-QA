/*
 * INK UI-B capability contribution registry.
 * UI-only metadata. It does not register Core algorithms or create a second mutation authority.
 */

export const UI_B_MENU_CONTRIBUTIONS = Object.freeze([
  { id:'file-external-open', menu:'file', section:'external', label:'開啟／匯入外部影像…', command:'external-open', authority:'P1-H format interoperability' },
  { id:'file-import-reference', menu:'file', section:'import', label:'匯入 Reference…', command:'reference-import', authority:'Reference import' },
  { id:'file-import-svg', menu:'file', section:'import', label:'匯入 SVG…', command:'svg-import', authority:'SVG import' },
  { id:'file-print', menu:'file', section:'output', label:'列印…', command:'print', authority:'Output/Artboard' },

  { id:'edit-duplicate', menu:'edit', section:'object', label:'複製', command:'duplicate', shortcut:'Ctrl+D', authority:'Document object authority' },
  { id:'edit-delete', menu:'edit', section:'object', label:'刪除', command:'delete', shortcut:'Delete', authority:'Document object authority' },
  { id:'edit-settings', menu:'edit', section:'settings', label:'偏好設定／畫布設定…', command:'canvas-settings', authority:'UI settings' },

  { id:'image-mode-8', menu:'image', section:'mode', label:'模式：8-bit', command:'bit-depth:8', authority:'P1-G color management' },
  { id:'image-mode-16', menu:'image', section:'mode', label:'模式：16-bit', command:'bit-depth:16', authority:'P1-G color management' },
  { id:'image-mode-32', menu:'image', section:'mode', label:'模式：32-bit', command:'bit-depth:32', authority:'P1-G color management' },
  { id:'image-mode-rgb', menu:'image', section:'mode', label:'色彩模式：RGB', command:'color-mode:RGB', authority:'P1-G color management' },
  { id:'image-mode-cmyk', menu:'image', section:'mode', label:'色彩模式：CMYK', command:'color-mode:CMYK', authority:'P1-G color management' },
  { id:'image-mode-lab', menu:'image', section:'mode', label:'色彩模式：Lab', command:'color-mode:Lab', authority:'P1-G color management' },
  { id:'image-mode-multi', menu:'image', section:'mode', label:'色彩模式：Multichannel', command:'color-mode:Multichannel', authority:'P1-G color management', guarded:true },
  { id:'image-profile', menu:'image', section:'color', label:'Color Profile…', command:'color-profile', authority:'P1-G ICC' },
  { id:'image-adjustments', menu:'image', section:'adjustment', label:'Adjustments…', command:'panel:adjustments', authority:'C24 adjustment stack' },
  { id:'image-crop', menu:'image', section:'raster', label:'裁切選取影像…', command:'image-crop', authority:'C22 raster image' },
  { id:'image-resize', menu:'image', section:'raster', label:'影像尺寸…', command:'image-resize', authority:'C22 raster image' },

  { id:'layer-new', menu:'layer', section:'lifecycle', label:'新增圖層', command:'layer-new', authority:'Layers' },
  { id:'layer-duplicate', menu:'layer', section:'lifecycle', label:'複製圖層', command:'layer-duplicate', authority:'Layers' },
  { id:'layer-delete', menu:'layer', section:'lifecycle', label:'刪除圖層', command:'layer-delete', authority:'Layers' },
  { id:'layer-group', menu:'layer', section:'hierarchy', label:'群組選取', command:'group', authority:'Document hierarchy' },
  { id:'layer-ungroup', menu:'layer', section:'hierarchy', label:'解散群組', command:'ungroup', authority:'Document hierarchy' },
  { id:'layer-mask-add', menu:'layer', section:'mask', label:'建立 Mask', command:'mask-add', authority:'C23 mask' },
  { id:'layer-mask-select', menu:'layer', section:'mask', label:'Select and Mask…', command:'select-and-mask', authority:'C23/P1-A refine selection' },
  { id:'layer-effects', menu:'layer', section:'effect', label:'Layer Effects…', command:'layer-effects', authority:'C27 layer effects' },

  { id:'type-horizontal', menu:'type', section:'type', label:'水平／段落文字', command:'text-mode:horizontal-tb', authority:'P1-C text object' },
  { id:'type-vertical-rl', menu:'type', section:'type', label:'垂直文字（右至左）', command:'text-mode:vertical-rl', authority:'P1-C text object' },
  { id:'type-vertical-lr', menu:'type', section:'type', label:'垂直文字（左至右）', command:'text-mode:vertical-lr', authority:'P1-C text object' },
  { id:'type-path', menu:'type', section:'path', label:'文字沿路徑…', command:'text-on-path', authority:'P1-C text layout' },

  { id:'select-all', menu:'select', section:'selection', label:'全部選取', command:'select-all', shortcut:'Ctrl+A', authority:'Selection' },
  { id:'select-clear', menu:'select', section:'selection', label:'取消選取', command:'select-clear', authority:'Selection' },
  { id:'select-polygon', menu:'select', section:'raster', label:'多邊形套索', command:'tool:polygonalLasso', authority:'P1-A selection' },
  { id:'select-magnetic', menu:'select', section:'raster', label:'磁性套索', command:'tool:magneticLasso', authority:'P1-E selection' },
  { id:'select-quick', menu:'select', section:'raster', label:'快速選取', command:'tool:quickSelection', authority:'P1-A selection' },
  { id:'select-magic', menu:'select', section:'raster', label:'魔術棒', command:'tool:magicWand', authority:'P1-A selection' },
  { id:'select-object', menu:'select', section:'raster', label:'物件選取', command:'tool:objectSelection', authority:'P1-E selection' },
  { id:'select-refine', menu:'select', section:'refine', label:'Select and Mask…', command:'select-and-mask', authority:'P1-A refine selection' },

  { id:'filter-gallery', menu:'filter', section:'gallery', label:'Filter Gallery…', command:'filter-gallery', authority:'C25/P1-F filter stack' },
  { id:'filter-gaussian', menu:'filter', section:'blur', label:'Gaussian Blur…', command:'filter:gaussianBlur', authority:'C25 filter stack' },
  { id:'filter-motion', menu:'filter', section:'blur', label:'Motion Blur…', command:'filter:motionBlur', authority:'P1-F filter stack' },
  { id:'filter-median', menu:'filter', section:'noise', label:'Median…', command:'filter:median', authority:'P1-F filter stack' },
  { id:'filter-sharpen', menu:'filter', section:'sharpen', label:'Sharpen', command:'filter:sharpen', authority:'C25 filter stack' },
  { id:'filter-unsharp', menu:'filter', section:'sharpen', label:'Unsharp Mask…', command:'filter:unsharpMask', authority:'P1-F filter stack' },
  { id:'filter-highpass', menu:'filter', section:'edge', label:'High Pass…', command:'filter:highPass', authority:'C25 filter stack' },
  { id:'filter-edge', menu:'filter', section:'edge', label:'Edge Detection…', command:'filter:edgeDetection', authority:'C25 filter stack' },
  { id:'filter-noise', menu:'filter', section:'noise', label:'Noise / Grain…', command:'filter:noiseGrain', authority:'C25 filter stack' },
  { id:'filter-reduce-noise', menu:'filter', section:'noise', label:'Reduce Noise…', command:'filter:reduceNoise', authority:'P1-F filter stack' },
  { id:'filter-texture', menu:'filter', section:'texture', label:'Texture Overlay…', command:'filter:textureOverlay', authority:'C25 filter stack' },
  { id:'filter-emboss', menu:'filter', section:'stylize', label:'Emboss…', command:'filter:emboss', authority:'P1-F filter stack' },
  { id:'filter-mosaic', menu:'filter', section:'pixelate', label:'Mosaic / Pixelate…', command:'filter:mosaic', authority:'P1-F filter stack' },
  { id:'filter-minimum', menu:'filter', section:'other', label:'Minimum…', command:'filter:minimum', authority:'P1-F filter stack' },
  { id:'filter-maximum', menu:'filter', section:'other', label:'Maximum…', command:'filter:maximum', authority:'P1-F filter stack' },
  { id:'filter-liquify', menu:'filter', section:'workspace', label:'Liquify…', command:'liquify', authority:'P1-F liquify' },

  { id:'object-skew', menu:'object', section:'transform', label:'Transform：Skew…', command:'transform:skew', authority:'P1-C advanced transform' },
  { id:'object-distort', menu:'object', section:'transform', label:'Transform：Distort…', command:'transform:distort', authority:'P1-C advanced transform' },
  { id:'object-perspective', menu:'object', section:'transform', label:'Transform：Perspective…', command:'transform:perspective', authority:'P1-C advanced transform' },
  { id:'object-warp', menu:'object', section:'transform', label:'Transform：Warp…', command:'transform:warp', authority:'P1-C deformation' },
  { id:'object-front', menu:'object', section:'arrange', label:'移至最上', command:'arrange:front', authority:'Document hierarchy' },
  { id:'object-back', menu:'object', section:'arrange', label:'移至最下', command:'arrange:back', authority:'Document hierarchy' },
  { id:'object-group', menu:'object', section:'hierarchy', label:'群組', command:'group', shortcut:'Ctrl+G', authority:'Document hierarchy' },
  { id:'object-ungroup', menu:'object', section:'hierarchy', label:'解散群組', command:'ungroup', shortcut:'Ctrl+Shift+G', authority:'Document hierarchy' },

  { id:'view-grid', menu:'view', section:'guide', label:'Grid Snap', command:'snap:grid', authority:'page.snap' },
  { id:'view-snap', menu:'view', section:'snap', label:'Snap', command:'snap:enabled', authority:'page.snap' },
  { id:'view-snap-guides', menu:'view', section:'snap', label:'Snap To：Guides', command:'snap:guides', authority:'page.snap' },
  { id:'view-snap-edges', menu:'view', section:'snap', label:'Snap To：Object Edges', command:'snap:edges', authority:'page.snap' },
  { id:'view-snap-centers', menu:'view', section:'snap', label:'Snap To：Object Centers', command:'snap:centers', authority:'page.snap' },
  { id:'view-snap-angle', menu:'view', section:'snap', label:'Snap To：Angles', command:'snap:angle', authority:'page.snap' },
  { id:'view-snap-equal', menu:'view', section:'snap', label:'Snap To：Equal Distance', command:'snap:equalDistance', authority:'page.snap' },
  { id:'view-guides-show', menu:'view', section:'guide', label:'顯示／隱藏 Guides', command:'guides:toggle', authority:'Document guides' },
  { id:'view-workspace-creation', menu:'view', section:'workspace', label:'Workspace：Creation', command:'workspace:creation', authority:'Workspace' },
  { id:'view-workspace-layout', menu:'view', section:'workspace', label:'Workspace：Layout', command:'workspace:layout', authority:'Workspace' },

  { id:'help-shortcuts', menu:'help', section:'help', label:'Keyboard Shortcuts', command:'keyboard-shortcuts', authority:'UI help' },
  { id:'help-updates', menu:'help', section:'help', label:'Updates', command:'updates', authority:'PWA update manager' },
  { id:'help-diagnostics', menu:'help', section:'help', label:'Product Diagnostics', command:'panel:specialist', authority:'Product health' },
  { id:'help-pen', menu:'help', section:'help', label:'Pen Calibration…', command:'pen-calibration', authority:'Device calibration' }
]);

export const UI_B_TOOL_GROUPS = Object.freeze([
  { id:'draw', label:'Draw', icon:'✎', primary:'pen', tools:[
    ['pen','Pen'],['pencil','Pencil'],['marker','Marker'],['brush','Brush'],['airbrush','Airbrush'],['blender','Blender'],['smudge','Smudge']
  ]},
  { id:'lasso', label:'Lasso', icon:'⌁', primary:'lasso', tools:[
    ['lasso','Lasso'],['polygonalLasso','Polygonal Lasso'],['magneticLasso','Magnetic Lasso']
  ]},
  { id:'smart-selection', label:'Select', icon:'◫', primary:'quickSelection', tools:[
    ['quickSelection','Quick Selection'],['magicWand','Magic Wand'],['objectSelection','Object Selection']
  ]},
  { id:'fill', label:'Fill', icon:'◩', primary:'gradient', tools:[
    ['gradient','Gradient'],['paintBucket','Paint Bucket']
  ]},
  { id:'sampling', label:'Sample', icon:'⌖', primary:'eyedropper', tools:[
    ['eyedropper','Eyedropper'],['colorSampler','Color Sampler'],['measure','Measure']
  ]},
  { id:'clone', label:'Clone', icon:'♧', primary:'cloneStamp', tools:[
    ['cloneStamp','Clone Stamp'],['patternStamp','Pattern Stamp']
  ]},
  { id:'healing', label:'Heal', icon:'✚', primary:'spotHealing', tools:[
    ['healingBrush','Healing Brush'],['spotHealing','Spot Healing'],['patch','Patch']
  ]},
  { id:'tone', label:'Tone', icon:'◐', primary:'dodge', tools:[
    ['dodge','Dodge'],['burn','Burn'],['sponge','Sponge']
  ]},
  { id:'detail', label:'Detail', icon:'◌', primary:'localBlur', tools:[
    ['localBlur','Blur'],['localSharpen','Sharpen'],['colorReplacement','Color Replacement']
  ]},
  { id:'shape', label:'Shape', icon:'◇', primary:'shape:line', tools:[
    ['shape:line','Line'],['shape:arrow','Arrow'],['shape:rect','Rectangle'],['shape:ellipse','Ellipse'],['shape:triangle','Triangle']
  ]},
  { id:'text', label:'Type', icon:'T', primary:'text:horizontal-tb', tools:[
    ['text:horizontal-tb','Horizontal / Paragraph'],['text:vertical-rl','Vertical Right-to-Left'],['text:vertical-lr','Vertical Left-to-Right']
  ]}
]);

export const UI_B_DIALOGS = Object.freeze([
  'select-and-mask','layer-effects','filter-params','filter-gallery','liquify',
  'gradient-editor','pattern-editor','color-profile','image-size','image-crop',
  'advanced-transform','keyboard-shortcuts','pen-calibration','recovery'
]);

export const UI_B_REQUIRED_PANELS = Object.freeze([
  'properties','layers','history','navigator','pages','color','channels','adjustments',
  'libraries','reference','compose','chat','revision','specialist'
]);

export const UI_B_GAP_IDS = Object.freeze(Array.from({length:34},(_,index)=>`G-${String(index+1).padStart(2,'0')}`));
export const UI_B_PUI_IDS = Object.freeze(Array.from({length:74},(_,index)=>`PUI-${String(index+1).padStart(3,'0')}`));

export function validateUiBContributions({
  menus=UI_B_MENU_CONTRIBUTIONS,
  toolGroups=UI_B_TOOL_GROUPS,
  dialogs=UI_B_DIALOGS,
  panels=UI_B_REQUIRED_PANELS
}={}){
  const ids=new Set(),commands=new Map();
  const add=(id,type)=>{
    if(!id||ids.has(id))throw new Error(`INK_UI_B_DUPLICATE_CONTRIBUTION_ID:${id}`);
    ids.add(id);
    if(!type)throw new Error(`INK_UI_B_CONTRIBUTION_TYPE_REQUIRED:${id}`);
  };
  for(const entry of menus){
    add(entry.id,'menu');
    if(!entry.menu||!entry.command||!entry.authority)throw new Error(`INK_UI_B_MENU_CONTRIBUTION_INVALID:${entry.id}`);
    if(!commands.has(entry.command))commands.set(entry.command,[]);
    commands.get(entry.command).push(entry.id);
  }
  for(const group of toolGroups){
    add(`tool-group:${group.id}`,'tool-group');
    if(!Array.isArray(group.tools)||!group.tools.length)throw new Error(`INK_UI_B_TOOL_GROUP_EMPTY:${group.id}`);
    const local=new Set();
    for(const [tool] of group.tools){
      if(local.has(tool))throw new Error(`INK_UI_B_DUPLICATE_TOOL_IN_GROUP:${tool}`);
      local.add(tool);
    }
  }
  for(const id of dialogs)add(`dialog:${id}`,'dialog');
  for(const id of panels)add(`panel:${id}`,'panel');
  return Object.freeze({
    contributionIds:Object.freeze([...ids]),
    commands:Object.freeze([...commands.keys()]),
    menuCount:menus.length,
    toolGroupCount:toolGroups.length,
    dialogCount:dialogs.length,
    panelCount:panels.length
  });
}

export const UI_B_CONTRIBUTION_REPORT=validateUiBContributions();
