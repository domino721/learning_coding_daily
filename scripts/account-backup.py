"""Offline account backup/restore. Restore requires an empty target and revokes tokens."""
import argparse
import hashlib
import json
from pathlib import Path
import sqlite3


def run(source: Path,destination: Path,restore=False):
    if destination.exists() and any(destination.iterdir()):
        raise ValueError('Destination must be empty; existing records were not replaced')
    if not source.is_dir():raise ValueError('Source does not exist')
    destination.mkdir(parents=True,exist_ok=True,mode=0o700)
    files=list(source.rglob('*.sqlite3'))
    if restore:
        manifest=json.loads((source/'manifest.json').read_text())
        for name,expected in manifest.items():
            p=(source/name).resolve()
            if not p.is_relative_to(source.resolve()) or hashlib.sha256(p.read_bytes()).hexdigest()!=expected:
                raise ValueError('Backup integrity check failed')
        files=[source/name for name in manifest]
    manifest={}
    for path in files:
        relative=path.relative_to(source);target=destination/relative
        target.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
        with sqlite3.connect(f'file:{path.resolve()}?mode=ro',uri=True) as incoming:
            if incoming.execute('PRAGMA integrity_check').fetchone()[0]!='ok':raise ValueError('Invalid database')
            with sqlite3.connect(target) as output:
                incoming.backup(output)
                if restore and relative.name=='accounts.sqlite3':output.execute('DELETE FROM tokens')
        target.chmod(0o600)
        manifest[str(relative)]=hashlib.sha256(target.read_bytes()).hexdigest()
    (destination/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(f'{"Restored" if restore else "Backed up"} {len(files)} databases; no credential values printed')


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source',type=Path,required=True);p.add_argument('--destination',type=Path,required=True);p.add_argument('--restore',action='store_true')
    a=p.parse_args();run(a.source,a.destination,a.restore)
