import importlib.util
from pathlib import Path

import pytest

spec = importlib.util.spec_from_file_location('published', Path(__file__).parents[1] / 'scripts/verify-published-site.py')
published = importlib.util.module_from_spec(spec)
spec.loader.exec_module(published)


@pytest.fixture
def build(tmp_path):
    (tmp_path / 'assets').mkdir()
    (tmp_path / 'index.html').write_text('<script type="module" src="./assets/app-new.js"></script><link rel="stylesheet" href="./assets/app-new.css">')
    (tmp_path / 'assets/app-new.js').write_bytes(b'new questions')
    (tmp_path / 'assets/app-new.css').write_bytes(b'body{}')
    return tmp_path


def reader(build, *, stale=False, corrupt=False):
    def fetch(url):
        if '?build_check=' in url:
            data = (build / 'index.html').read_bytes()
            return data.replace(b'app-new.js', b'app-old.js') if stale else data
        assert url.startswith('https://example.org/course/assets/')
        name = url.rsplit('/', 1)[1]
        return b'wrong bytes' if corrupt and name.endswith('.js') else (build / 'assets' / name).read_bytes()
    return fetch


def test_matching_public_build_and_relative_subpath_assets(build):
    assert published.verify_once('https://example.org/course/', build, reader(build)) == ['./assets/app-new.js', './assets/app-new.css']


def test_stale_html_is_not_success(build):
    with pytest.raises(ValueError, match='different build'):
        published.verify_once('https://example.org/course/', build, reader(build, stale=True))


def test_matching_filename_with_corrupt_bytes_is_not_success(build):
    with pytest.raises(ValueError, match='differs'):
        published.verify_once('https://example.org/course/', build, reader(build, corrupt=True))


def test_tls_is_required(build):
    with pytest.raises(ValueError, match='HTTPS'):
        published.verify_once('http://example.org/course/', build, reader(build))
