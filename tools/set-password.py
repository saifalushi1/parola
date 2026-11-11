"""Set the shared client-side gate verifier. This is not server authentication.
Run from any directory: python tools/set-password.py
The password is requested without echo and is never written in plaintext.
"""
from pathlib import Path
import getpass,hashlib,json,secrets,subprocess,sys
root=Path(__file__).resolve().parent.parent
password=getpass.getpass('New shared password: ')
if not password:raise SystemExit('Password cannot be empty.')
if password!=getpass.getpass('Confirm password: '):raise SystemExit('Passwords did not match.')
salt=secrets.token_hex(16)
config={'salt':salt,'passwordHash':hashlib.sha256(f'{salt}:{password}'.encode()).hexdigest()}
(root/'dist/data/access.json').write_text(json.dumps(config,separators=(',',':')),encoding='utf8')
subprocess.run([sys.executable,str(root/'tools/refresh-offline.py')],check=True)
print('Shared gate verifier updated. Commit the verifier and refreshed service worker before deploying.')
