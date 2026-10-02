"""Verify captured browser observations and immutable Git identity; no app operations."""
import hashlib
import json
import re
import subprocess
from pathlib import Path

repo = Path(__file__).resolve().parents[2]
root = repo / 'qa/evidence/combined-promotion-20261002'
base = '1fb3f3d5046bb7b7e94b06b07a495e2cea5014ef'
candidate = '78d4e9e5b749d74a8a93503d87f7c85f75e1bd98'
integrated = 'aa01f1e311eb22cb572a61efea19b8bb21a96157'
tree = '5ccaac62ed85176d69e07a1b72b1cac20c507f87'
def git(*args):
    return subprocess.check_output(['git', *args], cwd=repo)
def source(ref, name):
    return git('show', ref + ':product/source/' + name)
checks = []
def check(name, condition):
    assert condition, name
    checks.append({'name': name, 'result': 'PASS'})
pre = json.loads((root / 'promotion-pre-browser.json').read_text())
post = json.loads((root / 'promotion-post-browser.json').read_text())
for ref in [candidate, integrated]:
    check('complete product tree: ' + ref[:8], git('rev-parse', ref + ':product/source').decode().strip() == tree)
check('no intervening product mutation', not git('diff', '892c1917280b87c9e44b7a8567517bf24d7e0122', base, '--', 'product/source'))
expected = {'index-standalone.html','index.html','service-worker.js','shell.template.html','src/config.js','src/ink.js','styles.css'}
changed = set(git('diff', '--name-only', base, candidate, '--', 'product/source').decode().replace('product/source/', '').splitlines())
check('seven accepted product files only', changed == expected)
check('promotion candidate has no unrelated changes', all(x.startswith('product/source/') for x in git('diff','--name-only',base,candidate).decode().splitlines()))
for group, data in [('pre', pre), ('official-main', post)]:
    for item in data['records']:
        s = item['state']; active = s['workspace']['activeSpace']
        good = s['dataset'] == s['spaceMode'] == active and s['cameraAliasesActive'] and s['camera'] == s['workspace']['cameras'][active]
        good &= s['switch']['count'] == 1 and s['switch']['parent'] == 'contextualOptions'
        good &= s['switch']['box']['x'] + s['switch']['box']['width'] == s['viewport']['width'] - 9
        good &= s['buttons'][0]['box']['width'] == s['buttons'][1]['box']['width'] and s['buttons'][0]['box']['height'] == s['buttons'][1]['box']['height']
        good &= all(b['disabled'] == (not s['documentOpen']) and (b['pressed'] == 'true') == (s['documentOpen'] and b['space'] == active) for b in s['buttons'])
        check(group + ' authoritative state and geometry: ' + item['name'], good)
    for asset in data['identity']['assets']:
        check(group + ' fetched asset: ' + asset['name'], asset['status'] == 200 and hashlib.sha256(source(candidate, asset['name'])).hexdigest() == asset['sha256'])
    lines = source(candidate, 'src/ink.js').decode().splitlines()
    for name, method in data['identity']['executedMethods'].items():
        expected_source = next(line.strip() for line in lines if line.strip().startswith(name + '('))
        check(group + ' instantiated method: ' + name, expected_source == method['source'] and hashlib.sha256(expected_source.encode()).hexdigest() == method['sha256'])
    logs = data['logs'] + data.get('logs960', [])
    check(group + ' no product-origin warning/error', all(x.get('url', '').startswith('chrome-extension://') or 'chrome-extension://' in x['message'] for x in logs))
lookup = {r['name']: r['state'] for r in pre['records'] + post['records']}
check('native New remains A4 Layout', all(lookup[n]['spaceMode'] == 'layout' and lookup[n]['content'][0]['artboard']['preset'] == 'A4' for n in ['new-layout','960-new-layout','main-new-layout']))
check('three native repeated round trips', all(lookup['creation-'+str(i)]['spaceMode'] == 'creation' and lookup['layout-'+str(i)]['spaceMode'] == 'layout' for i in range(3)))
selected = [lookup[n] for n in ['selected-layout-before','selected-creation','selected-layout-after']]
check('nonempty selection/content/History preserved', len(selected[0]['selection']) == 1 and all(s['selection'] == selected[0]['selection'] and s['content'] == selected[0]['content'] and s['history'] == selected[0]['history'] for s in selected))
check('official per-page workspace', lookup['main-page1-restored']['spaceMode'] == 'creation' and lookup['main-page2-restored']['spaceMode'] == 'layout' and lookup['main-page2-restored']['pageId'] == lookup['main-page2-creation']['pageId'])
a,b = lookup['main-page2-restored'], lookup['main-layout-reloaded']
check('official autosave/reload restores page/content/camera/workspace', b['documentOpen'] and a['pageId'] == b['pageId'] and a['content'] == b['content'] and a['workspace'] == b['workspace'])
check('official 960 round trip', lookup['main-960-creation']['spaceMode'] == 'creation' and lookup['main-960-layout-return']['spaceMode'] == 'layout')
geo = post['narrowGeometry']
check('960 host does not overlap workspace switch', geo['host']['x'] + geo['host']['width'] <= geo['switch']['x'])
check('shared content-driven menu grammar', len(post['geometry']['menus']) == 11 and len({m['width'] for m in post['geometry']['menus']}) > 1 and all(m['padding'] == '1px 8px' and m['font'] == '12px' for m in post['geometry']['menus']))
check('rectangular overflowing right-panel scrollbars', bool(geo['overflow']) and all(x['scrollbarColor'] == 'auto' and x['thumbRadius'] == '0px' and x['trackRadius'] == '0px' for x in geo['overflow']))
old_css,new_css = source(base,'styles.css').decode(),source(candidate,'styles.css').decode()
check('no new important or breakpoint family', old_css.count('!important') == new_css.count('!important') and set(re.findall(r'@media[^\{]+',old_css)) == set(re.findall(r'@media[^\{]+',new_css)))
check('obsolete authorities absent', not re.search(r'data-application-menu=.*?>button\{width:',new_css) and '.app *{scrollbar-color:' not in new_css)
check('FORMAT_VERSION remains 4', bool(re.search(r'FORMAT_VERSION\s*=\s*4',source(candidate,'src/config.js').decode())))
check('Core spatial-index source retained exactly', not git('diff',base,candidate,'--','product/source/src/spatial'))
result = {'base':base,'candidate':candidate,'integratedMain':integrated,'productTree':tree,'scope':'Fresh captured observations and Git identity; not whole-UI acceptance','checks':checks,'total':len(checks),'passed':len(checks)}
(root/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'total':len(checks),'passed':len(checks)}))
