import { iconIds, icons } from './icons/registry';
import { named } from './render/colors';

interface Example {
    title: string;
    path: string;
    alt: string;
    note?: string;
}

const sections: { id: string; title: string; intro: string; examples: Example[] }[] = [
    {
        id: 'static',
        title: 'Static badges',
        intro: 'Label, message and color straight from the URL: <code>/badge/&lt;label&gt;/&lt;message&gt;/&lt;color&gt;</code>. Use <code>_</code> for a space and <code>__</code> for an underscore. Leave out the label for a single segment.',
        examples: [
            { title: 'Label and message', path: '/badge/node/22+/339933', alt: 'Node 22+' },
            { title: 'Default blue', path: '/badge/license/MIT', alt: 'License MIT' },
            { title: 'Message only', path: '/badge/open_source', alt: 'Open source' },
            { title: 'With an icon', path: '/badge/built_with/Hono/E36002?icon=hono', alt: 'Built with Hono' },
        ],
    },
    {
        id: 'npm',
        title: 'npm',
        intro: 'Scoped packages work as they are, slash included.',
        examples: [
            { title: 'Version', path: '/npm/v/@mscode-pl/email-lint', alt: 'npm version' },
            { title: 'Downloads per month', path: '/npm/dm/@mscode-pl/email-lint', alt: 'npm downloads', note: 'Also <code>/npm/dw</code> per week and <code>/npm/dy</code> per year.' },
            { title: 'License', path: '/npm/l/@mscode-pl/email-lint', alt: 'License' },
        ],
    },
    {
        id: 'packagist',
        title: 'Packagist',
        intro: 'Vendor and package name. The version skips pre-releases while a stable release exists.',
        examples: [
            { title: 'Version', path: '/packagist/v/mscode-pl/laravel-react-email', alt: 'Packagist version' },
            { title: 'Total downloads', path: '/packagist/dt/mscode-pl/laravel-react-email', alt: 'Packagist downloads', note: 'Also <code>/packagist/dm</code> per month and <code>/packagist/dd</code> per day.' },
            { title: 'License', path: '/packagist/l/mscode-pl/laravel-react-email', alt: 'License' },
        ],
    },
    {
        id: 'github',
        title: 'GitHub',
        intro: 'The workflow badge shows the last completed run. Add <code>?branch=</code> to pick a branch.',
        examples: [
            { title: 'Workflow status', path: '/github/actions/mscode-pl/email-lint/ci.yml?branch=master&label=tests', alt: 'Tests' },
            { title: 'Stars', path: '/github/stars/mscode-pl/email-lint', alt: 'GitHub stars' },
            { title: 'License', path: '/github/license/mscode-pl/email-lint', alt: 'License' },
        ],
    },
    {
        id: 'buttons',
        title: 'Buttons',
        intro: 'Add <code>style=button</code> for a larger badge, for profile links and calls to action. <code>style=for-the-badge</code> works too.',
        examples: [
            { title: 'Website', path: '/badge/mscode.pl?style=button&icon=web', alt: 'mscode.pl' },
            { title: 'Discord', path: '/badge/Discord?style=button&icon=discord&color=5865F2', alt: 'Discord', note: 'With one segment, the color goes in the query.' },
            { title: 'E-mail', path: '/badge/kontakt@mscode.pl?style=button&icon=email&color=111111', alt: 'E-mail' },
        ],
    },
];

const options: [string, string][] = [
    ['theme', '<code>light</code> (default) or <code>dark</code>. Pair both inside <code>&lt;picture&gt;</code>.'],
    ['style', '<code>flat</code> (default) or <code>button</code>.'],
    ['color', `Message color: a hex value without <code>#</code> or a name: ${Object.keys(named).map((k) => `<code>${k}</code>`).join(', ')}.`],
    ['label', 'Replaces the label. Pass it empty (<code>label=</code>) to drop it.'],
    ['labelColor', 'Label background, same values as <code>color</code>.'],
    ['icon', 'An icon id from the list below. <code>logo</code> works too.'],
];

function esc(value: string): string {
    return value.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

function card(origin: string, ex: Example): string {
    const path = ex.path;
    const markdown = `![${ex.alt}](${origin}${path})`;
    return `<article class="card">
<h3>${esc(ex.title)}</h3>
<div class="preview">
  <img src="${esc(path)}${path.includes('?') ? '&amp;' : '?'}theme=light" alt="${esc(ex.alt)}" class="on-light">
  <img src="${esc(path)}${path.includes('?') ? '&amp;' : '?'}theme=dark" alt="${esc(ex.alt)}" class="on-dark">
</div>
<div class="code"><code>${esc(markdown)}</code><button type="button" data-copy="${esc(markdown)}">Copy</button></div>
${ex.note ? `<p class="note">${ex.note}</p>` : ''}
</article>`;
}

export function docsPage(origin: string): string {
    const ids = iconIds();
    const iconCells = ids
        .map((id) => `<button type="button" class="icon" data-copy="${id}" title="${esc(icons[id]!.title)}"><img src="/icons?i=${id}&amp;theme=dark" alt="" class="on-dark" loading="lazy"><img src="/icons?i=${id}&amp;theme=light" alt="" class="on-light" loading="lazy"><span>${id}</span></button>`)
        .join('');
    const pictureSnippet = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${origin}/icons?i=react,ts,hono&theme=dark">
  <img src="${origin}/icons?i=react,ts,hono&theme=light" alt="React, TypeScript, Hono" height="40">
</picture>`;

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MSCode badges</title>
<meta name="description" content="Badges and tech icons for READMEs: static, npm, Packagist and GitHub, in light and dark.">
<style>
@font-face { font-family: Jakarta; src: url(/fonts/plus-jakarta-sans-500.ttf); font-weight: 500; font-display: swap; }
@font-face { font-family: Jakarta; src: url(/fonts/plus-jakarta-sans-800.ttf); font-weight: 800; font-display: swap; }
@font-face { font-family: Mono; src: url(/fonts/jetbrains-mono-400.ttf); font-display: swap; }
:root { --bg: #f5f5f7; --card: #ffffff; --line: rgb(10 10 10 / 0.1); --ink: #0a0a0a; --muted: #4b5563; --accent: #1a5bb5; --code: #eef1f5; color-scheme: light dark; }
@media (prefers-color-scheme: dark) { :root { --bg: #040d1a; --card: #0b1728; --line: rgb(255 255 255 / 0.12); --ink: #ffffff; --muted: #9fb0c8; --accent: #7aa7ff; --code: #071222; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 500 16px/1.6 Jakarta, system-ui, sans-serif; }
main { max-width: 1040px; margin: 0 auto; padding: 64px 24px 96px; }
h1 { font-weight: 800; font-size: clamp(36px, 6vw, 56px); line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 16px; }
h1 span { color: var(--accent); }
h2 { font-weight: 800; font-size: 26px; margin: 64px 0 8px; letter-spacing: -0.01em; }
h3 { font-size: 14px; font-weight: 800; margin: 0 0 12px; }
.lead { color: var(--muted); font-size: 19px; max-width: 640px; margin: 0; }
.intro { color: var(--muted); margin: 0 0 20px; max-width: 720px; }
nav { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
nav a { color: var(--ink); text-decoration: none; font: 14px Mono, monospace; padding: 4px 14px; border: 1px solid var(--line); border-radius: 999px; background: var(--card); }
nav a:hover, nav a:focus-visible { border-color: var(--accent); }
code { font: 13px/1.5 Mono, ui-monospace, monospace; }
p code, td code { background: var(--code); padding: 1px 5px; border-radius: 4px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 18px; min-width: 0; }
.preview { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; min-height: 34px; margin-bottom: 14px; }
.code { display: flex; gap: 8px; align-items: center; background: var(--code); border-radius: 8px; padding: 8px 8px 8px 12px; }
.code code { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); }
.note { color: var(--muted); font-size: 14px; margin: 10px 0 0; }
button { font: 800 12px Jakarta, system-ui, sans-serif; color: var(--ink); background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 6px 10px; cursor: pointer; }
button:hover, button:focus-visible { border-color: var(--accent); }
button:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
table { border-collapse: collapse; width: 100%; background: var(--card); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
td { padding: 12px 16px; border-top: 1px solid var(--line); vertical-align: top; color: var(--muted); }
tr:first-child td { border-top: 0; }
td:first-child { font: 14px Mono, monospace; color: var(--ink); white-space: nowrap; width: 1%; }
pre { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 18px; overflow-x: auto; margin: 0 0 20px; }
.icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 10px; }
.icon { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px 6px 10px; border-radius: 12px; font: 12px Mono, monospace; }
.icon img { width: 40px; height: 40px; }
.on-dark { display: none; }
@media (prefers-color-scheme: dark) { .on-dark { display: block; } .on-light { display: none; } }
footer { margin-top: 80px; color: var(--muted); font-size: 14px; border-top: 1px solid var(--line); padding-top: 24px; }
footer a { color: var(--ink); }
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--bg); padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 14px; opacity: 0; transition: opacity 150ms ease-out; pointer-events: none; }
.toast.show { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .toast { transition: none; } }
</style>
</head>
<body>
<main>
<h1>Badges that match <span>your README</span></h1>
<p class="lead">Static and live badges plus tech icon rows, in light and dark. Text is drawn as vector paths, so they look the same on every machine. Free to use, no sign-up.</p>
<nav>${sections.map((s) => `<a href="#${s.id}">${esc(s.title)}</a>`).join('')}<a href="#options">Options</a><a href="#icons">Icons</a></nav>
${sections.map((s) => `<section id="${s.id}"><h2>${esc(s.title)}</h2><p class="intro">${s.intro}</p><div class="grid">${s.examples.map((ex) => card(origin, ex)).join('')}</div></section>`).join('\n')}
<section id="options">
<h2>Options</h2>
<p class="intro">Query parameters that work on every badge.</p>
<table>${options.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
</section>
<section id="icons">
<h2>Icons</h2>
<p class="intro">Rows of icons in one image: <code>/icons?i=react,ts,hono</code>. Dark by default, <code>theme=light</code> for light, <code>perline=</code> to wrap (15 by default). Each icon is 48 px wide, so <code>height="40"</code> markup from skillicons keeps working. Click an icon to copy its id.</p>
<pre><code>${esc(pictureSnippet)}</code></pre>
<div class="icons">${iconCells}</div>
</section>
<footer>
Made by <a href="https://mscode.pl">MSCode</a>. Source on <a href="https://github.com/mscode-pl/badges">GitHub</a>, MIT license. Brand icons come from <a href="https://simpleicons.org">Simple Icons</a> (CC0) and remain trademarks of their owners.
</footer>
</main>
<div class="toast" role="status" aria-live="polite"></div>
<script>
const toast = document.querySelector('.toast');
let timer;
document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-copy]');
  if (!button) return;
  await navigator.clipboard.writeText(button.dataset.copy);
  toast.textContent = 'Copied ' + (button.dataset.copy.length > 40 ? 'Markdown' : button.dataset.copy);
  toast.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove('show'), 1400);
});
</script>
</body>
</html>`;
}
