# Anzhelika Korneeva | Contemporary Art

This repository contains the static site for Anzhelika Korneeva’s online gallery. GitHub Pages publishes the files from `main` at [www.ak-art.us](https://www.ak-art.us/).

## Preview locally

From the repository folder, start a local web server:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open [localhost:8080](http://localhost:8080/). Stop the server with **Ctrl+C**.

## Update the site

- `index.html` contains the homepage and The Artist section.
- `galleries/<gallery-name>/index.html` contains each collection’s description and artwork links.
- `assets/collections/` contains artwork previews and full-resolution files. Keep the **Download original** links pointed at the full-resolution files.
- `style.css` contains shared styles. `site.js` handles common interactions and `collection-viewer.js` controls the artwork viewer.
- `CNAME` defines the custom domain. `.nojekyll` tells GitHub Pages to serve the static files directly.

## Check and publish changes

Run these checks from the repository folder with Python 3 and Node.js installed:

```sh
python3 scripts/check_site.py
node --check site.js
node --check collection-viewer.js
node --check gallery.js
```

The link checker validates same-site links, HTML anchors, and referenced files, including previews and artwork downloads. The [Site checks workflow](.github/workflows/site-checks.yml) runs the same checks on pull requests targeting `main` and pushes to `main`.

Commit your changes on a branch, push the branch to GitHub, and open a pull request into `main`. After the checks pass, merge the pull request and watch the Pages deployment in [GitHub Actions](https://github.com/AlexeiChirokikh/ak-art/actions). Open the live site after deployment to confirm the changes.
