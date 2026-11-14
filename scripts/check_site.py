#!/usr/bin/env python3
"""Check local links and assets referenced by the gallery's HTML pages."""

from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import quote, unquote, urljoin, urlsplit


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.ak-art.us/"
SITE_HOSTS = {"www.ak-art.us", "ak-art.us"}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.anchors = set()
        self.references = []
        self.feed(path.read_text(encoding="utf-8"))
        self.close()

    def handle_starttag(self, tag, attributes):
        for key, value in attributes:
            if value is None:
                continue
            if key == "id" or (tag == "a" and key == "name"):
                self.anchors.add(value)
            if key in {"href", "src", "data-preview"}:
                self.references.append((self.getpos()[0], value))


def main():
    paths = [ROOT / "index.html", *sorted((ROOT / "galleries").rglob("*.html"))]
    pages = {path: Page(path) for path in paths}
    errors = []
    checked = 0

    for path, page in pages.items():
        relative_path = path.relative_to(ROOT)
        page_url = urljoin(ORIGIN, quote(relative_path.as_posix()))
        for line, reference in page.references:
            location = f"{relative_path}:{line}"
            try:
                url = urlsplit(urljoin(page_url, reference.strip()))
            except ValueError as error:
                errors.append(f"{location}: invalid URL {reference!r} ({error})")
                continue
            if url.scheme not in {"http", "https"} or url.hostname not in SITE_HOSTS:
                continue

            checked += 1
            target = (ROOT / unquote(url.path.lstrip("/"))).resolve()
            if not target.is_relative_to(ROOT):
                errors.append(f"{location}: URL points outside the site: {reference!r}")
                continue
            if target.is_dir():
                target /= "index.html"
            if not target.is_file():
                errors.append(f"{location}: missing file for {reference!r}")
            elif url.fragment and target.suffix.lower() == ".html":
                if target not in pages:
                    pages_for_target = Page(target)
                else:
                    pages_for_target = pages[target]
                if unquote(url.fragment) not in pages_for_target.anchors:
                    errors.append(f"{location}: missing anchor for {reference!r}")

    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"Checked {checked} local references across {len(pages)} HTML pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
