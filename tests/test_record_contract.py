import json
from pathlib import Path
import subprocess
from backend.record_contract import merge_submission


def test_same_portable_submissions_produce_identical_results_in_both_modes():
    path='tests/fixtures/record-contract.json'
    cases=json.loads(Path(path).read_text())
    browser=json.loads(subprocess.check_output(['node','--experimental-strip-types','scripts/replay-records.ts',path],text=True))
    for sample,actual in zip(cases,browser,strict=True):
        try:expected={'name':sample['name'],'value':merge_submission(sample['a'],sample['b'])}
        except ValueError:expected={'name':sample['name'],'error':True}
        assert actual==expected
        assert bool(actual.get('error'))==sample['error']
