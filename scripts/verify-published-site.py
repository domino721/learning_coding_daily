"""Check the public Pages HTML and its JS/CSS bytes against the deployed build."""
import argparse
import hashlib
from html.parser import HTMLParser
from pathlib import Path
import time
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        path = attrs.get('src') if tag == 'script' else attrs.get('href') if tag == 'link' and attrs.get('rel') == 'stylesheet' else None
        if path:
            self.paths.append(path)


def fetch_bytes(url):
    request = Request(url, headers={'Cache-Control': 'no-cache', 'Accept-Encoding': 'identity'})
    with urlopen(request, timeout=20) as response:
        return response.read()


def verify_once(site_url, dist, fetch=fetch_bytes):
    if urlsplit(site_url).scheme != 'https':
        raise ValueError('The published site must use HTTPS')
    expected = Assets()
    expected.feed((dist / 'index.html').read_text(encoding='utf-8'))
    if not expected.paths:
        raise ValueError('Build has no JS/CSS references')
    cache_key = hashlib.sha256((dist / 'index.html').read_bytes()).hexdigest()[:16]
    actual = Assets()
    actual.feed(fetch(site_url.rstrip('/') + '/?build_check=' + cache_key).decode('utf-8'))
    if set(actual.paths) != set(expected.paths):
        raise ValueError('Public HTML still references a different build')
    # Vite can put the actual catalog in an imported chunk. Checking only the
    # entry script would accept a deployment whose content chunk is missing.
    paths = list(expected.paths)
    for asset in sorted(dist.rglob('*')):
        if asset.is_file() and asset.suffix in ('.js', '.css'):
            path = './' + asset.relative_to(dist).as_posix()
            if path not in paths:
                paths.append(path)
    for path in paths:
        relative = urlsplit(path).path.removeprefix('./')
        local = (dist / relative).resolve()
        if not local.is_relative_to(dist.resolve()) or not local.is_file():
            raise ValueError('Build asset is outside the build directory')
        remote = fetch(urljoin(site_url.rstrip('/') + '/', path))
        if hashlib.sha256(remote).digest() != hashlib.sha256(local.read_bytes()).digest():
            raise ValueError(f'Published asset differs: {local.name}')
    return paths


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site-url', required=True)
    parser.add_argument('--dist', type=Path, default=Path('web-dist'))
    parser.add_argument('--attempts', type=int, default=18)
    args = parser.parse_args()
    if not 1 <= args.attempts <= 18:
        parser.error('attempts must be between 1 and 18')
    for attempt in range(1, args.attempts + 1):
        try:
            paths = verify_once(args.site_url, args.dist)
            print('Public site build verified: ' + ', '.join(paths))
            return
        except (OSError, ValueError) as error:
            print(f'Public site check {attempt}/{args.attempts}: {error}', flush=True)
            if attempt == args.attempts:
                raise SystemExit('Public site verification failed') from None
            time.sleep(5)


if __name__ == '__main__':
    main()
