"""Export the same reviewed content for the free, on-device web build."""
import json
import sys
from dataclasses import asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from backend.content import EXERCISES, TRACKS
from backend.curriculum import CONCEPTS, LEARNING_PATHS, validate_learning_paths
from validate_sql_content import validate_all
from validate_shell_content import validate_all as validate_shell

validate_all(EXERCISES)
validate_shell(EXERCISES)
validate_learning_paths(EXERCISES)

path = ROOT / "src/curriculum.json"
serialized = json.dumps({"exercises": [asdict(ex) for ex in EXERCISES], "tracks": TRACKS, "concepts": CONCEPTS, "learning_paths": LEARNING_PATHS}, ensure_ascii=False, indent=2) + "\n"
if "--check" in sys.argv:
    if not path.exists() or json.loads(path.read_text()) != json.loads(serialized):
        raise SystemExit("웹 콘텐츠가 원본과 다릅니다. python3 scripts/export-content.py를 실행해 주세요.")
else:
    path.write_text(serialized)
