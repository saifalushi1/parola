"""Optional, local-only speech generation. Requires espeak-ng on PATH.
Run from the project root: python tools/generate-audio.py --language it
Piper alternative: --piper-model path/to/voice.onnx (requires the piper executable).
Voice/model licenses must be reviewed separately before distribution.
"""
import argparse,json,pathlib,subprocess
p=argparse.ArgumentParser();p.add_argument('--language',choices=['ar','it'],required=True);p.add_argument('--piper-model');args=p.parse_args()
root=pathlib.Path(__file__).resolve().parent.parent/'dist';items={}
for f in (root/'data'/args.language).glob('*.json'):
 if f.name in ['index.json']:continue
 for item in json.loads(f.read_text(encoding='utf8')):
  if not isinstance(item,dict):continue
  if 'target'in item:items[item['id']]={**item,'target':item.get('example',{}).get('target',item['target'])} if f.name=='alphabet.json' and args.language=='it' else item
  for ex in item.get('examples',[]):items[ex['id']]=ex
out=root/'audio'/args.language;out.mkdir(parents=True,exist_ok=True)
for id,item in items.items():
 dest=out/(id+'.wav')
 if dest.exists():continue
 if args.piper_model:subprocess.run(['piper','--model',args.piper_model,'--output_file',str(dest)],input=item['target']+'\n',text=True,encoding='utf8',check=True)
 else:subprocess.run(['espeak-ng','-v',args.language,'-w',str(dest),'--',item['target']],check=True)
 print(dest.name)
print('Done. Existing audio files were kept. Use Settings → Download bundled audio after deployment.')
