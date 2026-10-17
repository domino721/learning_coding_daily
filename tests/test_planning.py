"""Regression tests for governance failures that would silently change the plan."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

import tempfile
import unittest

from scripts.planning import ROOT, PlanningError, load, validate


def write(project, name, value):
    (project / 'docs/planning' / name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')


def change_plan(project, change):
    registry = load(project,'docs/planning/versions.json')
    record = next(item for item in registry['versions'] if item['kind']=='plan' and item['version']==registry['current']['plan'])
    path = project / record['path']
    plan = json.loads(path.read_text()); change(plan)
    path.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
    record['sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
    write(project,'versions.json',registry)


def commit_fixture(project):
    subprocess.run(['git','init','-q',str(project)],check=True)
    subprocess.run(['git','-C',str(project),'add','.'],check=True)
    subprocess.run(['git','-C',str(project),'-c','user.name=planning-test','-c','user.email=planning-test@example.invalid','commit','-qm','fixture'],check=True)


class PlanningValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="learning-planning-")
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name)
        for directory in ('docs','backend','src','scripts','tests','.github','public'):
            shutil.copytree(ROOT / directory, self.project / directory, ignore=shutil.ignore_patterns('__pycache__','.pytest_cache'))
        for name in ('README.md','AGENTS.md','.gitignore'):
            shutil.copy2(ROOT / name, self.project / name)

    def test_current_governance_is_consistent(self):
        project = self.project
        assert len(validate(project)['plan']['tasks']) == 32


    def test_changed_baseline_requires_new_digest_and_version(self):
        project = self.project
        path=project/'docs/planning/baselines/design-v1.0.0.md'
        path.write_text(path.read_text()+'\nchanged\n')
        with self.assertRaisesRegex(PlanningError,'baseline digest mismatch'):
            validate(project)


    def test_even_rehashed_plan_cannot_introduce_dependency_cycle(self):
        project = self.project
        change_plan(project,lambda plan: plan['tasks'][0]['depends_on'].append('WBS-110'))
        with self.assertRaisesRegex(PlanningError,'dependency cycle'):
            validate(project)


    def test_completed_task_cannot_lose_its_evidence(self):
        project = self.project
        status=load(project,'docs/planning/status.json')
        status['tasks']['WBS-010']['evidence']=[]
        write(project,'status.json',status)
        with self.assertRaisesRegex(PlanningError,'missing evidence/date'):
            validate(project)


    def test_generated_wbs_cannot_drift_from_definitions(self):
        project = self.project
        with (project/'docs/planning/WBS.md').open('a') as output:
            output.write('\nmanual schedule\n')
        with self.assertRaisesRegex(PlanningError,'generated document stale'):
            validate(project)


    def test_unknown_dependency_is_not_accepted(self):
        project = self.project
        change_plan(project,lambda plan: plan['tasks'][-1]['depends_on'].append('WBS-999'))
        with self.assertRaisesRegex(PlanningError,'unknown dependency'):
            validate(project)


    def test_status_must_reference_current_plan(self):
        project = self.project
        status=load(project,'docs/planning/status.json')
        status['plan_version']='99.0.0'
        write(project,'status.json',status)
        with self.assertRaisesRegex(PlanningError,'plan version references disagree'):
            validate(project)


    def test_committed_baseline_cannot_be_rewritten_even_with_new_hash(self):
        project = self.project
        commit_fixture(project)
        registry=load(project,'docs/planning/versions.json')
        record=next(item for item in registry['versions'] if item['kind']=='design')
        path=project/record['path']; path.write_text(path.read_text()+'\nSilent scope change\n')
        record['sha256']=hashlib.sha256(path.read_bytes()).hexdigest()
        write(project,'versions.json',registry)
        with self.assertRaisesRegex(PlanningError,'immutable baseline/evidence changed'):
            validate(project)


    def test_implementation_changes_require_work_log_update(self):
        project = self.project
        commit_fixture(project)
        with (project/'src/api.ts').open('a') as output:
            output.write('\n// implementation change\n')
        with self.assertRaisesRegex(PlanningError,'source changes require a work log update'):
            validate(project)


    def test_applied_change_cannot_be_silently_rewritten(self):
        project = self.project
        commit_fixture(project)
        changes=load(project,'docs/planning/changes.json')
        changes['changes'][0]['authorization']='Different historical approval'
        write(project,'changes.json',changes)
        with self.assertRaisesRegex(PlanningError,'applied change must not be rewritten'):
            validate(project)


if __name__ == "__main__":
    unittest.main()
