"""Refresh the precache after editing static files. No build is needed to run the app."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent.parent/'dist'
paths=['./']+[str(p.relative_to(root)).replace('\\','/') for p in sorted(root.rglob('*')) if p.is_file() and p.name!='sw.js' and not str(p.relative_to(root)).startswith('audio')]
digest=hashlib.sha256(b''.join(p.read_bytes() for p in sorted(root.rglob('*')) if p.is_file() and p.name!='sw.js')).hexdigest()[:10]
source=(root/'sw.js').read_text(encoding='utf8')
start=source.index("const CACHE=");end=source.index("self.addEventListener('install'")
source=source[:start]+f"const CACHE='parola-shell-{digest}';\nconst FILES={json.dumps(paths)};\n"+source[end:]
(root/'sw.js').write_text(source,encoding='utf8');print('Precached files:',len(paths))
