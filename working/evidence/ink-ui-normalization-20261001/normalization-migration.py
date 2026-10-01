from pathlib import Path
import re,json
p=Path('ink-local/product/source/styles.css')
source=p.read_text()
removed=[]
visual={'background','background-color','border','border-top','border-bottom','border-left','border-right','border-color','border-radius','box-shadow','font','font-family','font-size','font-weight','line-height','color','padding','padding-inline','padding-top','padding-bottom','margin','gap','min-height','height'}
exact={
 '.window-visual-controls':None,'.window-visual-controls button':None,'.window-visual-controls button:nth-child(2)':None,'.window-visual-controls button:last-child':None,'.window-visual-controls svg':None,'.window-visual-controls button:first-child svg':None,
 '.tool-colors':None,'.tool-color':None,'.foreground-swatch':None,'.background-swatch':None,'.color-utility':None,'.color-reset':None,'.color-swap':None,
 '.tool-layout-controls':None,'.panel-edge-strip':None,'.tool-layout-toggle':None,'.panel-edge-toggle':None,'.edge-chevron':None,'.edge-chevron svg':None,'.panel-edge-toggle .edge-chevron':None,'.panel-edge-toggle .edge-chevron svg':None,
 '.tool-layout-controls>.tool-layout-toggle':None,'.panel-edge-strip>.panel-edge-toggle':None,
 '.panel-stack-splitter':None,'.panel-stack-splitter::after':None,'.panel-stack-splitter:hover':None,
 '.panel-stack-tab':None,'.panel-stack-tab.active':None,'.panel-stack-options':None,'.panel-stack-options svg':None,
 '.tool-bottom-utilities':None,'.app[data-toolbar-layout="single"] .tool-bottom-utilities':None,
 '.layer-row':{'grid-template-columns','gap','height','min-height','padding','border-bottom'},
 '.layer-row.drop-before::before':{'height'},'.layer-row.drop-after::after':{'height'},
 '#closeBrandingSettings svg':None,'#closeBrandingSettings::before':None,
 '.ui-b-layer-filter-menu>summary::after':None,
 '.tool-rail .tool-group':None,'.app.toolbar-layout-dual .tool-rail .tool-group':None,'.app[data-toolbar-layout="single"] .tool-rail .tool-group':None,
 '.tool-rail':{'overflow','overflow-x','overflow-y','gap'},
 '.layers-panel .layer-opacity-card':{'border','border-bottom','background','padding'},
 '.property-card':{'background','border','border-radius','box-shadow','padding','margin','color'},
 '.ui-b-layer-appearance':None,'.segmented':{'background','border','border-color','border-radius','box-shadow','padding'},
 '.subpanel-title strong':{'color','font-weight'},'.section-title strong':{'color','font-weight'},
}
def clean_selector(s): return re.sub(r'\s+',' ',s.strip())
def declarations(body):
 # Semicolons inside quoted strings/functions are retained.
 parts=[];start=0;quote=None;depth=0
 for i,c in enumerate(body):
  if quote:
   if c==quote and (i==0 or body[i-1]!='\\'):quote=None
  elif c in "\"'":quote=c
  elif c=='(':depth+=1
  elif c==')':depth-=1
  elif c==';' and depth==0:parts.append(body[start:i]);start=i+1
 parts.append(body[start:])
 return parts
def process_rule(header,body):
 selectors=[s.strip() for s in header.split(',')]
 groups={}
 for s in selectors:
  key=clean_selector(s);items=[]
  parameter=bool(re.search(r'(?:control-row|color-control|number-unit|inspector-section|contextual-options|ui-b-context-controls|branding-field|ui-b-dialog-body|shell-property-supplement|object-actions|layer-actions|stroke-edit-actions|studio-button-grid|ui-b-panel-actions|shape-grid|segmented|wide-button|#hexInput)',key)) and bool(re.search(r'(?:input|select|textarea|button|wide-button|#hexInput)',key))
  creative=bool(re.search(r'creative-(?:workspace-(?:field|actions|action-grid|primary|body)|structure-option|file-picker)',key))
  for part in declarations(body):
   m=re.match(r'\s*([\w-]+)\s*:',part)
   prop=m.group(1) if m else ''
   drop=(key in exact and (exact[key] is None or prop in exact[key]))
   drop=drop or (creative and prop in visual)
   drop=drop or (parameter and prop in {'background','background-color','color','border','border-color','border-radius','box-shadow','font-weight','font-size'})
   drop=drop or (parameter and 'textarea' not in key and bool(re.search(r'control-row|color-control|#hexInput|number-unit|ui-b-context-controls',key)) and prop in {'height','min-height'})
   drop=drop or (key in {'.app input:not([type="hidden"]):not([disabled])','.app select:not([disabled])','.app textarea:not([disabled])'} and prop=='min-height')
   drop=drop or (prop in {'scrollbar-color','scrollbar-width'} and 'scrollbar-width:none' not in part.replace(' ',''))
   drop=drop or ('::-webkit-scrollbar' in key and '.tool-rail' not in key and '.contextual-control-host' not in key)
   drop=drop or (re.search(r'::-(?:webkit-slider|moz-range)',key) and '.document-scrollbar' not in key)
   drop=drop or (key in {'input[type=range]','input[type="range"]'} and prop in visual|{'appearance','-webkit-appearance','accent-color','min-width'})
   if drop:
    if prop:removed.append({'selector':s,'property':prop,'value':part.split(':',1)[1].strip()})
    continue
   if prop=='font-size' and re.fullmatch(r'\s*\d+(?:\.\d+)?px\s*',part.split(':',1)[1]):
    n=float(part.split(':',1)[1].strip()[:-2]);token='xs' if n<=10 else 'sm' if n<=11 else 'md' if n<=13 else 'display'
    part='font-size:var(--ui-type-'+token+')'
   if '.preferences-category' in key and prop in {'height','min-height'} and re.fullmatch(r'\s*22px\s*',part.split(':',1)[1]) and ('input' in key or 'select' in key):
    part=prop+':var(--ui-dialog-control-height)'
   if ('.contextual-options' in key or '.ui-b-context-controls' in key) and prop in {'height','min-height'} and re.fullmatch(r'\s*21px\s*',part.split(':',1)[1]):
    part=prop+':var(--ui-options-control-height)'
   items.append(part)
  nb=';'.join(items)
  if nb.strip():groups.setdefault(nb,[]).append(s)
 if len(groups)==1:
  b,ss=next(iter(groups.items()))
  if ss==selectors:return header+'{'+b+'}'
 leading=re.match(r'\s*',header).group()
 return leading+('\n'+leading).join(','.join(ss)+'{'+b+'}' for b,ss in groups.items())
def rewrite(text):
 out='';start=0;i=0
 while i<len(text):
  if text.startswith('/*',i):
   end=text.index('*/',i)+2
   # Comments preceding a selector are preserved, not parsed as a selector.
   out+=text[start:end];start=end;i=end;continue
  if text[i]=='{':
   header=text[start:i];j=i+1;level=1;quote=None
   while j<len(text) and level:
    c=text[j]
    if quote:
     if c==quote and text[j-1]!='\\':quote=None
    elif text.startswith('/*',j):j=text.index('*/',j)+1
    elif c in "\"'":quote=c
    elif c=='{':level+=1
    elif c=='}':level-=1
    j+=1
   body=text[i+1:j-1]
   if header.strip().startswith('@'):
    out+=header+'{'+rewrite(body)+'}'
   else:out+=process_rule(header,body)
   start=j;i=j;continue
  i+=1
 return out+text[start:]
result=rewrite(source)
# Consolidate token declarations: one definition for each migrated role.
tokens={
 '--ink-ui-border-soft':'var(--ink-ui-border)', '--ink-ui-popup-separator':'var(--ink-ui-border)',
 '--ink-ui-control-hover':'#EEEEEE','--ink-ui-control-active':'var(--ink-ui-control-hover)',
 '--ink-ui-control-active-border':'var(--ink-ui-border-strong)',
 '--ink-ui-border':'#DDDDDD','--ink-ui-border-strong':'#C8C8C8','--ink-ui-text-disabled':'#757575',
 '--ink-ui-splitter':'#B8B8B8','--ink-ui-scrollbar-thumb':'var(--ink-ui-splitter)',
 '--ui-type-xs':'11px','--ui-type-sm':'11px','--ui-type-md':'12px','--ui-type-lg':'12px','--ui-type-xl':'12px',
 '--ui-weight-control':'400','--ui-weight-heading':'400','--ui-weight-meta':'400',
 '--ui-control-height':'22px','--ui-small-button-height':'22px','--ui-input-height':'22px','--ui-select-height':'22px',
 '--ui-icon-box':'24px','--ui-icon-envelope':'17px','--ui-row-pitch':'26px','--ui-label-baseline':'1.3',
 '--ui-control-gap':'4px','--ui-group-gap':'8px','--ui-section-gap':'16px','--ui-panel-padding':'6px','--ui-menu-padding':'2px',
 '--ui-options-control-height':'21px','--ui-dialog-control-height':'23px','--ui-dialog-action-height':'26px',
 '--ui-scrollbar-width':'12px','--ui-scrollbar-track':'var(--ink-ui-surface-subtle)',
 '--ui-slider-track-height':'2px','--ui-slider-thumb-size':'9px','--ui-slider-track':'var(--ink-ui-splitter)',
 '--ui-slider-thumb-border':'var(--ink-ui-text-muted)', '--ui-tool-cell-width':'31px','--ui-tool-row-pitch':'26px',
 '--ui-collapse-strip-height':'12px','--ui-collapse-control-width':'16px','--ui-collapse-icon-width':'7px','--ui-collapse-icon-height':'5px',
 '--ui-panel-tab-height':'28px','--ui-panel-splitter-height':'3px','--ui-layer-row-pitch':'35px',
 '--ui-panel-icon-width':'10px','--ui-panel-icon-height':'7px',
 '--ui-window-control-width':'28px','--ui-window-close-width':'47px','--ui-window-control-height':'19px',
 '--ui-window-icon-size':'12px','--ui-icon-stroke':'1.5','--ui-swatch-size':'18px','--ui-swatch-overlap':'10px',
 '--ui-color-stack-height':'42px','--ui-color-utility-top':'30px'
}
for name in tokens:
 result=re.sub(re.escape(name)+r'\s*:[^;{}]+;?', '', result)
block='\n/* Shared workstation micro-module authority. Legacy declarations for these\n   families are removed above; state/command ownership remains unchanged. */\n:root{\n'+''.join('  '+k+':'+v+';\n' for k,v in tokens.items())+'}\n'
block+=Path('shared-primitives.css').read_text()
# Place the shared authority at the former typography authority, rather than
# creating another final override layer. Its covered local declarations are removed.
marker='/* Brand is intentionally separate from the workstation hierarchy. */'
result=result.replace(marker,block+'\n'+marker)
result='\n'.join(line.rstrip() for line in result.split('\n'))
p.write_text(result)
Path('/tmp/ink-normalization-removed.json').write_text(json.dumps(removed,ensure_ascii=False,indent=2))
print(json.dumps({'removedDeclarations':len(removed),'tokens':len(tokens),'charsBefore':len(source),'charsAfter':len(result),'importantBefore':source.count('!important'),'importantAfter':result.count('!important')}))
