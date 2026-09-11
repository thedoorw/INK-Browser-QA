from pathlib import Path
import hashlib, sys
ROOT=Path(__file__).resolve().parents[1]
manifest=ROOT/'CHECKSUMS_SHA256.txt'
errors=[]; checked=0
for line_no,line in enumerate(manifest.read_text(encoding='utf-8').splitlines(),1):
    if not line.strip(): continue
    try: expected, rel=line.split('  ',1)
    except ValueError:
        errors.append(f'line {line_no}: malformed'); continue
    path=ROOT/rel
    if not path.is_file():
        errors.append(f'missing: {rel}'); continue
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    actual=h.hexdigest(); checked+=1
    if actual!=expected: errors.append(f'mismatch: {rel}: {actual} != {expected}')
if errors:
    print('\n'.join(errors)); print(f'CHECKSUM FAIL: {checked} checked, {len(errors)} errors'); sys.exit(1)
print(f'CHECKSUM PASS: {checked} payload files')
