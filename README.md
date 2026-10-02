# Felipe Espinosa — Research

Academic homepage at https://pipe1213.github.io/.

## Update the site

The homepage is generated as plain HTML and CSS. Node.js 20 or newer is the only build requirement; no package installation is needed.

- `content/site.json`: biography, links, news, education, teaching, and metadata.
- `content/publications.json`: publication and manuscript entries.
- `content/projects.json`: selected projects.
- `src/style.css`: responsive layout and styling.
- `scripts/build.mjs`: HTML template and build.
- `docs/assets/profile.webp`: optimized portrait.
- `docs/files/Felipe_Espinosa_CV.pdf`: downloadable CV.
- `docs/files/cfm.pdf`: downloadable CFM internship report.

After editing content or styles:

```sh
npm run build
npm start
```

Preview at http://127.0.0.1:4173. Commit both the source edits and generated `docs/` files. GitHub Pages publishes the `docs` folder from `main`; no external services or runtime JavaScript are required.

Keep manuscript statuses explicit. Do not add links for unpublished work unless a public URL exists. The CFM project links to the supplied internship report at https://pipe1213.github.io/files/cfm.pdf.

## GitHub Pages setup

Repository: `Pipe1213/Pipe1213.github.io` (public).

In Settings → Pages, select **Deploy from a branch**, branch **main**, folder **/docs**. The site uses HTTPS at https://pipe1213.github.io/.

The original source instructions, full-size portrait, and original CV filename are ignored by Git. Only the selected web assets and site source are published.
