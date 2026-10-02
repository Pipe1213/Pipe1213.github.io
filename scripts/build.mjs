import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = async (file) => JSON.parse(await readFile(path.join(root, 'content', file), 'utf8'));
const [site, publications, projects] = await Promise.all(['site.json', 'publications.json', 'projects.json'].map(read));
const updatedLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(site.updated));
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const link = ({ url, label, download = false }) => `<a href="${escape(url)}"${url.startsWith('https://') ? ' target="_blank" rel="noopener noreferrer"' : ''}${download ? ' download' : ''}>${escape(label)}</a>`;
const links = (items) => items?.length ? `<div class="entry-links">${items.map(link).join('<span aria-hidden="true"> / </span>')}</div>` : '';
const authors = (items) => items.map((name) => name === site.publicationName ? `<strong>${escape(name)}</strong>` : escape(name)).join(', ');
const publication = (item, earlier = false) => `<article class="publication${earlier ? ' compact' : ''}">
  <h${earlier ? '4' : '3'}>${escape(item.title)}</h${earlier ? '4' : '3'}>
  <p class="authors">${authors(item.authors)}</p>
  <p class="venue">${escape(item.venue)}${item.note ? `<span class="entry-note"> · ${escape(item.note)}</span>` : ''}</p>
  ${item.description ? `<p class="entry-description">${escape(item.description)}</p>` : ''}
  ${links(item.links)}
</article>`;
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(site.name)} | ${escape(site.role)}</title>
  <meta name="description" content="${escape(site.description)}">
  <meta name="author" content="${escape(site.name)}">
  <meta name="theme-color" content="#fafbf9">
  <link rel="canonical" href="${site.url}/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Felipe Espinosa — Research">
  <meta property="og:description" content="${escape(site.description)}">
  <meta property="og:url" content="${site.url}/">
  <meta name="twitter:card" content="summary">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="wordmark" href="#about" aria-label="Felipe Espinosa, homepage">FE<span aria-hidden="true">.</span></a>
    <nav aria-label="Main navigation">
      <a href="#about">About</a>
      <a href="#publications">Publications</a>
      <a href="#projects">Projects</a>
      <a href="files/Felipe_Espinosa_CV.pdf">CV <span aria-hidden="true">↗</span><span class="sr-only"> (PDF)</span></a>
    </nav>
  </header>
  <div class="page-layout">
    <aside class="profile" aria-label="Profile and contact">
      <img class="portrait" src="assets/profile.webp" width="480" height="600" alt="Portrait of Felipe Espinosa" fetchpriority="high">
      <div class="profile-info">
        <h1>${escape(site.name)}</h1>
        <p class="role">${escape(site.role)}</p>
        <p class="location">${escape(site.location)}</p>
        <ul class="profile-links">${site.links.map((item) => `<li>${link(item)}</li>`).join('')}</ul>
      </div>
    </aside>
    <main id="main" tabindex="-1">
      <section id="about" aria-labelledby="about-title">
        <h2 id="about-title">About Me</h2>
        ${site.about.map((paragraph) => `<p>${escape(paragraph)}</p>`).join('\n')}
      </section>
      <section id="news" aria-labelledby="news-title">
        <h2 id="news-title">News</h2>
        <ul class="news-list">${site.news.map((item) => `<li><time datetime="${item.datetime}">${escape(item.date)}</time><div>${escape(item.text)}${item.link ? ' ' + link(item.link) : ''}</div></li>`).join('')}</ul>
      </section>
      <section id="vision" class="vision" aria-labelledby="vision-title">
        <h2 id="vision-title">Research Vision</h2>
        <p>${escape(site.vision)}</p>
      </section>
      <section id="publications" aria-labelledby="publications-title">
        <h2 id="publications-title">Selected Publications</h2>
        ${publications.filter((item) => !item.earlier).map((item) => publication(item)).join('\n')}
        <div class="earlier-publications">
          <h3 class="subheading">Earlier Robotics Publications</h3>
          ${publications.filter((item) => item.earlier).map((item) => publication(item, true)).join('\n')}
        </div>
      </section>
      <section id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">Selected Projects</h2>
        ${projects.map((item) => `<article class="project"><h3>${escape(item.title)}</h3><p class="affiliation">${escape(item.affiliation)} <span aria-hidden="true">·</span> ${escape(item.date)}</p><p>${escape(item.description)}</p>${item.result ? `<p>${escape(item.result)}</p>` : ''}${links(item.links)}</article>`).join('\n')}
      </section>
      <section id="education" aria-labelledby="education-title">
        <h2 id="education-title">Education</h2>
        ${site.education.map((item) => `<div class="education-entry"><div class="education-heading"><h3>${escape(item.school)}</h3><span>${escape(item.dates)}</span></div><p>${escape(item.degree)}</p><p class="education-note">${escape(item.note)}</p></div>`).join('\n')}
      </section>
      <section id="teaching" aria-labelledby="teaching-title">
        <h2 id="teaching-title">Teaching</h2>
        <p>${escape(site.teaching)}</p>
      </section>
    </main>
  </div>
  <footer><span>© ${escape(site.name)}</span><span>Last updated ${escape(updatedLabel)}</span></footer>
</body>
</html>
`;

await mkdir(path.join(root, 'docs/assets'), { recursive: true });
await writeFile(path.join(root, 'docs/index.html'), html.replace(/ +$/gm, ''));
await copyFile(path.join(root, 'src/style.css'), path.join(root, 'docs/assets/style.css'));
await copyFile(path.join(root, 'src/favicon.svg'), path.join(root, 'docs/assets/favicon.svg'));
await writeFile(path.join(root, 'docs/.nojekyll'), '');
await writeFile(path.join(root, 'docs/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
await writeFile(path.join(root, 'docs/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.url}/</loc><lastmod>${site.updated}</lastmod></url></urlset>\n`);
console.log('Built homepage in docs/');
