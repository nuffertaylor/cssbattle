# CSS Battle Solutions

This repo contains all my solutions for various challenges on [cssbattle.dev](https://cssbattle.dev/). They are sorted according to the day or challenge number.

To simulate how they appear on that website, I wrote a simple frame class to create a 400x300 frame. Each solution is contained within a <div class="frame">, and the interior of that div is what I would actually submit on the website.

There are a few things I needed to change to make it display correctly, so anyplace you see ".frame{}" referenced within the style tags, you can replace that with either "*" or "body" depending.

* note: at a certain point I stopped putting them in frames entirely. so most of them won't actually be in a frame, just the raw code I copied directly from the cssbattle site as I wrote it and pasted into this repo. Most files have a comment at the bottom containing the minified solution, which removes any unnecessary characters (e.g. closing html tags, the final css curly brace, most px annotations)


## Viewing the solutions

`index.html` displays every solution in an endlessly scrolling grid (Daily and Battles tabs). Each one is lazy-loaded into its own 400x300 iframe so styles don't clash.

It needs to be served over HTTP (browsers block `fetch` on `file://`), so from the repo root run:

```
python3 -m http.server
```

then open http://localhost:8000. Any static server works (`npx serve`, VS Code Live Server, GitHub Pages, etc.).

The page reads `manifest.json` to know which files exist. It's generated (and gitignored), so run this once locally, and again after adding a new solution:

```
node build-manifest.js
```

On push to `master`, `.github/workflows/pages.yml` regenerates the manifest and deploys the site to GitHub Pages automatically, so no manual step is needed for the hosted version.
