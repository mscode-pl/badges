import { categories, keywords, presets } from './icons/categories';
import { aliasesOf, iconIds, icons } from './icons/registry';
import { named } from './render/colors';

interface Example {
    title: string;
    path: string;
    alt: string;
}

interface Group {
    id: string;
    title: string;
    intro: string;
    examples: Example[];
}

const groups: Group[] = [
    {
        id: 'static',
        title: 'Static',
        intro: '<code>/badge/&lt;label&gt;/&lt;message&gt;/&lt;color&gt;</code>. <code>_</code> is a space, <code>__</code> an underscore. Leave out the label for one segment.',
        examples: [
            { title: 'Label and message', path: '/badge/node/22+/339933', alt: 'Node 22+' },
            { title: 'Default blue', path: '/badge/license/MIT', alt: 'License MIT' },
            { title: 'With an icon', path: '/badge/built_with/Hono/E36002?icon=hono', alt: 'Built with Hono' },
        ],
    },
    {
        id: 'buttons',
        title: 'Buttons',
        intro: '<code>style=button</code> for profile links and calls to action. With one segment, the color goes in the query.',
        examples: [
            { title: 'Website', path: '/badge/mscode.pl?style=button&icon=web', alt: 'mscode.pl' },
            { title: 'Discord', path: '/badge/Discord?style=button&icon=discord&color=5865F2', alt: 'Discord' },
            { title: 'E-mail', path: '/badge/kontakt@mscode.pl?style=button&icon=email&color=111111', alt: 'E-mail' },
        ],
    },
    {
        id: 'npm',
        title: 'npm',
        intro: 'Scoped packages work as they are. Downloads also come per week (<code>dw</code>) and per year (<code>dy</code>).',
        examples: [
            { title: 'Version', path: '/npm/v/@mscode-pl/email-lint', alt: 'npm version' },
            { title: 'Downloads per month', path: '/npm/dm/@mscode-pl/email-lint', alt: 'npm downloads' },
            { title: 'License', path: '/npm/l/@mscode-pl/email-lint', alt: 'License' },
        ],
    },
    {
        id: 'packagist',
        title: 'Packagist',
        intro: 'Pre-releases are skipped while a stable release exists. Downloads also come per month (<code>dm</code>) and per day (<code>dd</code>).',
        examples: [
            { title: 'Version', path: '/packagist/v/mscode-pl/laravel-react-email', alt: 'Packagist version' },
            { title: 'Total downloads', path: '/packagist/dt/mscode-pl/laravel-react-email', alt: 'Packagist downloads' },
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
        id: 'profile',
        title: 'Profile',
        intro: '<code>/views/&lt;name&gt;</code> counts every view of your profile README and is never cached; <code>?base=</code> adds a starting number when you move from another counter. <code>/wakatime/&lt;user&gt;</code> shows your coding time (stats must be public); add a range after the user: <code>7d</code>, <code>30d</code>, <code>6m</code>, <code>1y</code> or <code>all</code>, and <code>?lang=TypeScript</code> for one language. <code>/wakapi/&lt;user&gt;</code> works the same for Wakapi, on wakapi.dev or your own instance with <code>?instance=wakapi.example.com</code>.',
        examples: [
            { title: 'Profile views', path: '/views/mscode-badges-demo', alt: 'Profile views' },
            { title: 'With an icon and a start', path: '/views/mscode-badges-demo?icon=github&color=gray&base=1000', alt: 'Profile views' },
        ],
    },
];

const options: [string, string][] = [
    ['theme', '<code>light</code> (default) or <code>dark</code>. Pair both in <code>&lt;picture&gt;</code>.'],
    ['style', '<code>flat</code> (default) or <code>button</code>. <code>for-the-badge</code> works too.'],
    ['color', 'Hex without <code>#</code>, or a name below.'],
    ['labelColor', 'Label background, same values as <code>color</code>.'],
    ['label', 'Replaces the label. <code>label=</code> drops it.'],
    ['icon', 'Any icon id from the list. <code>logo</code> works too.'],
];

const swatches = ['blue', 'green', 'red', 'orange', 'yellow', 'purple', 'pink', 'gray', 'black'];

const esc = (value: string) => value.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const withTheme = (path: string, theme: string) => `${path}${path.includes('?') ? '&' : '?'}theme=${theme}`;

const copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15H9"/></svg>';
const arrowIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

const latin = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const latinExt = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';
const face = (family: string, file: string, range: string) =>
    `@font-face { font-family: ${family}; font-weight: 100 900; font-display: swap; src: url(/fonts/${file}) format("woff2"); unicode-range: ${range}; }`;

function copyRow(text: string, label: string): string {
    return `<div class="row"><code>${esc(text)}</code><button type="button" class="copy" data-copy="${esc(text)}" aria-label="Copy ${esc(label)}" title="Copy">${copyIcon}</button></div>`;
}

function example(origin: string, ex: Example): string {
    return `<div class="example">
<p class="eyebrow">${esc(ex.title)}</p>
<div class="stage"><span class="dark-ground"><img src="${esc(withTheme(ex.path, 'dark'))}" alt="${esc(ex.alt)}" loading="lazy"></span><span class="light-ground"><img src="${esc(withTheme(ex.path, 'light'))}" alt="" loading="lazy"></span></div>
${copyRow(`![${ex.alt}](${origin}${ex.path})`, `${ex.title} Markdown`)}
</div>`;
}

export function docsPage(origin: string): string {
    const year = new Date().getFullYear();
    const ids = iconIds();
    const picture = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${origin}/icons?i=react,ts,hono&theme=dark">
  <img src="${origin}/icons?i=react,ts,hono&theme=light" alt="React, TypeScript, Hono" height="40">
</picture>`;

    const cards = groups.map((g, i) => `<section class="card rise" style="--d: ${160 + i * 60}ms" id="${g.id}" aria-labelledby="${g.id}-title">
<h2 id="${g.id}-title">${esc(g.title)}</h2>
<p class="intro">${g.intro}</p>
<div class="examples">${g.examples.map((ex) => example(origin, ex)).join('')}</div>
</section>`).join('\n');

    const iconCell = (id: string) => {
        const icon = icons[id]!;
        const search = [id, icon.title, ...aliasesOf(id), keywords[id] ?? ''].join(' ').toLowerCase();
        return `<li data-search="${esc(search)}"><button type="button" class="icon" data-id="${id}" aria-pressed="false" title="${esc(icon.title)}"><img src="/icons?i=${id}" alt="" width="40" height="40" loading="lazy"><span>${id}</span></button></li>`;
    };
    const iconGroups = categories.map((c) => `<section class="icon-group"><h3>${esc(c.name)} <span>${c.ids.length}</span></h3><ul class="icons">${c.ids.map(iconCell).join('')}</ul></section>`).join('');
    const searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MSCode Badges - badges and tech icons for your README</title>
<meta name="description" content="Static and live badges for npm, Packagist and GitHub, profile buttons and tech icon rows, in light and dark. Free, no sign-up.">
<link rel="canonical" href="${origin}/">
<meta name="theme-color" content="#07090f">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:title" content="MSCode Badges">
<meta property="og:description" content="Badges and tech icons for your README, in light and dark.">
<meta property="og:url" content="${origin}/">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/outfit-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<style>
${face('Geist', 'geist-latin-wght-normal.woff2', latin)}
${face('Geist', 'geist-latin-ext-wght-normal.woff2', latinExt)}
${face('Outfit', 'outfit-latin-wght-normal.woff2', latin)}
${face('Outfit', 'outfit-latin-ext-wght-normal.woff2', latinExt)}
${face('"Geist Mono"', 'geist-mono-latin-wght-normal.woff2', latin)}
:root {
  color-scheme: dark;
  --ink: #07090f; --ink-2: #0c1019; --popover: #10151f;
  --fg: #e8ecf4; --muted-fg: #8a93a6; --subtle: #5d6578;
  --brand: #4c8dff; --primary: #3d7dff; --ok: #4ade80;
  --border: rgb(255 255 255 / 0.07); --input: rgb(255 255 255 / 0.09); --muted: rgb(255 255 255 / 0.04); --accent: rgb(255 255 255 / 0.05);
  --sans: Geist, ui-sans-serif, system-ui, "Segoe UI", sans-serif;
  --heading: Outfit, Geist, ui-sans-serif, system-ui, "Segoe UI", sans-serif;
  --mono: "Geist Mono", ui-monospace, "Cascadia Code", Consolas, monospace;
  --highlight: inset 0 1px 0 rgb(255 255 255 / 0.06), 0 1px 2px rgb(0 0 0 / 0.05);
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 1.5rem; -webkit-font-smoothing: antialiased; scrollbar-width: thin; scrollbar-color: rgb(140 160 200 / 0.28) var(--ink); }
body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; overflow-x: clip; background: var(--ink); color: var(--fg); font: 400 15px/1.6 var(--sans); }
body::before { content: ""; position: fixed; inset: 0; z-index: 100; pointer-events: none; opacity: 0.05; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
::selection { background: rgb(61 125 255 / 0.38); color: #fff; }
h1, h2 { font-family: var(--heading); text-wrap: balance; word-spacing: 0.04em; margin: 0; }
a { color: inherit; }
code { font-family: var(--mono); font-size: 0.86em; }
p code, dd code { color: var(--fg); background: var(--accent); border: 1px solid var(--border); border-radius: 0.3rem; padding: 0.05rem 0.3rem; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

.page { width: 100%; max-width: 72rem; margin-inline: auto; padding-inline: 1.25rem; }
@media (min-width: 768px) { .page { padding-inline: 2rem; } }
.hero { position: relative; isolation: isolate; flex: 1; }
.backdrop { position: absolute; inset: 0 0 auto; height: 34rem; z-index: -1; pointer-events: none; }
.backdrop img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 70%; opacity: 0.3; }
.backdrop::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom, rgb(7 9 15 / 0.6), rgb(7 9 15 / 0.7) 50%, var(--ink)); }

header { height: 5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand { display: inline-flex; align-items: center; gap: 0.625rem; text-decoration: none; font-weight: 600; letter-spacing: -0.02em; }
.brand img { width: 26px; height: 26px; }
.brand em { font-style: normal; color: var(--muted-fg); font-weight: 500; }
.nav { display: flex; gap: 0.5rem; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; height: 2.25rem; padding-inline: 0.85rem; white-space: nowrap; border-radius: 0.75rem; border: 1px solid var(--input); background-color: color-mix(in srgb, var(--popover), white 3%); color: var(--fg); font-weight: 500; font-size: 0.875rem; text-decoration: none; cursor: pointer; box-shadow: var(--highlight); transition: translate 200ms ease, background-color 200ms ease, border-color 200ms ease, background-position 800ms cubic-bezier(0.2, 0.7, 0.2, 1); }
.btn:hover { translate: 0 -1px; border-color: rgb(255 255 255 / 0.16); background-color: color-mix(in srgb, var(--popover), white 7%); }
.btn:active { translate: 0 1px; }
.btn svg { width: 1rem; height: 1rem; transition: transform 200ms ease; }
.btn:hover svg { transform: translate(2px, -2px); }
.btn-primary { border-color: rgb(255 255 255 / 0.14); background-image: linear-gradient(110deg, transparent 38%, rgb(255 255 255 / 0.3) 50%, transparent 62%), linear-gradient(to bottom, #5a95ff, var(--primary)); background-size: 250% 100%, 100% 100%; background-position: 100% 0, 0 0; background-repeat: no-repeat; color: #fff; }
.btn-primary:hover { background-position: 0% 0, 0 0; }
@media (max-width: 480px) { .nav .btn:first-child { display: none; } }

main { padding-block: 2rem 4rem; }
@media (min-width: 640px) { main { padding-block: 3rem 5rem; } }
h1 { font-size: 2.15rem; line-height: 1.08; font-weight: 600; letter-spacing: -0.025em; }
@media (min-width: 640px) { h1 { font-size: 2.85rem; } }
h1 span { display: block; }
.text-gradient { padding-bottom: 0.25rem; background: linear-gradient(100deg, #b9d3ff 0%, var(--brand) 55%, #9bbcff 100%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 8s ease-in-out infinite; }
.lead { margin: 1rem 0 0; max-width: 36rem; color: var(--muted-fg); font-size: 1rem; line-height: 1.65; }
.chips { list-style: none; margin: 2rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chips li { display: inline-flex; align-items: center; height: 1.25rem; padding-inline: 0.35rem; border-radius: 0.3rem; border: 1px solid var(--input); background: color-mix(in srgb, var(--ink), white 3%); font-size: 0.75rem; font-weight: 500; }
.jump { margin-top: 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }

.grid { margin-top: 2.5rem; display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .wide { grid-column: 1 / -1; } }
.card { min-width: 0; border: 1px solid var(--border); border-radius: 1rem; background: var(--ink-2); padding: 1.5rem; box-shadow: var(--highlight); }
@media (min-width: 640px) { .card { padding: 1.75rem; } }
.card h2 { font-size: 1.125rem; line-height: 1; font-weight: 600; }
.intro { margin: 0.75rem 0 0; color: var(--muted-fg); font-size: 0.9375rem; }
.eyebrow { margin: 0 0 0.5rem; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--subtle); }
.examples { margin-top: 1.25rem; display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; }
.example { min-width: 0; }

.stage { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid var(--input); border-radius: 0.75rem; overflow: hidden; margin-bottom: 0.5rem; }
.stage span { display: flex; align-items: center; justify-content: center; min-height: 3.5rem; padding: 0.75rem; }
.stage img { max-width: 100%; height: auto; }
.dark-ground { background: var(--ink); }
.light-ground { background: #f5f5f7; }

.row { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; border: 1px solid var(--input); background: var(--muted); border-radius: 0.75rem; padding: 0.375rem 0.375rem 0.375rem 0.875rem; min-width: 0; }
.row code { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.8125rem; }
.copy { flex: none; display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border: 0; border-radius: 0.5rem; background: transparent; color: var(--muted-fg); cursor: pointer; transition: background-color 150ms ease, color 150ms ease; }
.copy:hover { background: var(--accent); color: var(--fg); }
.copy[data-done] { color: var(--ok); }
.copy svg { width: 1rem; height: 1rem; }

.builder { display: grid; gap: 1.5rem; margin-top: 1.25rem; }
@media (min-width: 860px) { .builder { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); align-items: start; } }
.fields { display: grid; gap: 0.875rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.field { display: grid; gap: 0.375rem; align-content: start; min-width: 0; }
.field.full { grid-column: 1 / -1; }
.field label, .field legend { font-size: 0.8125rem; font-weight: 500; color: var(--muted-fg); padding: 0; }
fieldset.field { border: 0; margin: 0; padding: 0; }
.field input { height: 2.375rem; width: 100%; border: 1px solid var(--input); border-radius: 0.75rem; background: var(--muted); color: var(--fg); font: 400 0.875rem var(--sans); padding-inline: 0.75rem; transition: border-color 150ms ease, box-shadow 150ms ease; }
.field input::placeholder { color: var(--subtle); }
.field input:hover { border-color: rgb(255 255 255 / 0.16); }
.field input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgb(76 141 255 / 0.2); }
.segmented { display: inline-flex; justify-self: start; padding: 0.1875rem; gap: 0.1875rem; border: 1px solid var(--input); border-radius: 0.75rem; background: var(--muted); }
.segmented label { position: relative; }
.segmented input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.segmented span { display: block; padding: 0.3rem 0.75rem; border-radius: 0.55rem; font-size: 0.8125rem; font-weight: 500; color: var(--muted-fg); transition: background-color 150ms ease, color 150ms ease; }
.segmented input:checked + span { background: color-mix(in srgb, var(--popover), white 8%); color: var(--fg); box-shadow: var(--highlight); }
.segmented input:focus-visible + span { outline: 2px solid var(--brand); outline-offset: 1px; }
.swatches { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-top: 0.25rem; }
.swatch { width: 1.375rem; height: 1.375rem; padding: 0; border-radius: 0.4rem; border: 1px solid rgb(255 255 255 / 0.14); cursor: pointer; transition: transform 150ms ease; }
.swatch:hover { transform: translateY(-1px); }
.result { display: grid; gap: 0.5rem; min-width: 0; }
.result .stage span { min-height: 6.5rem; }
.result .eyebrow { margin-top: 0.5rem; }

dl { margin: 1.25rem 0 0; }
dl div { display: flex; align-items: baseline; justify-content: space-between; gap: 1.5rem; padding-block: 0.75rem; border-top: 1px solid var(--border); font-size: 0.9375rem; }
dl div:first-child { border-top: 0; padding-top: 0; }
dt { font-family: var(--mono); font-size: 0.875rem; }
dd { margin: 0; color: var(--muted-fg); text-align: right; }

pre { margin: 1.25rem 0 0; padding: 0.875rem 1rem; border: 1px solid var(--input); background: var(--muted); border-radius: 0.75rem; overflow-x: auto; font-size: 0.8125rem; line-height: 1.6; }
.search { position: relative; margin-top: 1.25rem; }
.search svg { position: absolute; left: 0.85rem; top: 50%; width: 1rem; height: 1rem; translate: 0 -50%; color: var(--subtle); pointer-events: none; }
.search input { width: 100%; height: 2.75rem; padding: 0 3rem 0 2.5rem; border: 1px solid var(--input); border-radius: 0.75rem; background: var(--muted); color: var(--fg); font: 400 0.9375rem var(--sans); transition: border-color 150ms ease, box-shadow 150ms ease; }
.search input::placeholder { color: var(--subtle); }
.search input:hover { border-color: rgb(255 255 255 / 0.16); }
.search input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgb(76 141 255 / 0.2); }
.search kbd { position: absolute; right: 0.75rem; top: 50%; translate: 0 -50%; font: 500 0.75rem var(--mono); color: var(--muted-fg); border: 1px solid var(--input); border-radius: 0.3rem; padding: 0 0.35rem; }
.search input:focus ~ kbd, .search input:not(:placeholder-shown) ~ kbd { display: none; }
.picker { position: sticky; bottom: 1rem; z-index: 5; margin-top: 1.5rem; padding: 0.625rem 0.625rem 0.625rem 1rem; border: 1px solid var(--input); border-radius: 0.875rem; background: color-mix(in srgb, var(--ink-2), black 12%); box-shadow: var(--highlight), 0 12px 32px rgb(0 0 0 / 0.5); display: flex; align-items: center; gap: 1rem; }
.picker-count { flex: none; font-size: 0.875rem; color: var(--muted-fg); }
.picker-count strong { color: var(--fg); font-weight: 600; }
.picker-preview { flex: 1; min-width: 0; overflow: hidden; display: flex; align-items: center; }
.picker-preview img { height: 2rem; width: auto; max-width: none; }
.picker-actions { flex: none; display: flex; gap: 0.375rem; }
@media (max-width: 640px) { .picker { flex-wrap: wrap; } .picker-actions { width: 100%; } .picker-actions .btn { flex: 1; } }
.btn[data-done] { border-color: rgb(74 222 128 / 0.6); }
.picker[data-empty] { display: none; }
.ib { margin-top: 1.25rem; padding: 1rem; border: 1px solid var(--input); border-radius: 0.875rem; background: rgb(255 255 255 / 0.02); display: grid; gap: 1rem; scroll-margin-top: 1.5rem; }
.ib-top { display: flex; flex-wrap: wrap; gap: 1rem 1.5rem; align-items: end; }
.ib-perline input { width: 5.5rem; }
.ib-presets .label { font-size: 0.8125rem; font-weight: 500; color: var(--muted-fg); }
.ib-preset-list { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.ib-hint { margin: 0; font-size: 0.875rem; color: var(--muted-fg); }
.ib-hint kbd { font: 500 0.75rem var(--mono); border: 1px solid var(--input); border-radius: 0.3rem; padding: 0 0.35rem; }
.ib-picked { display: grid; gap: 0.625rem; }
.chips-row { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.375rem; }
.chips-row:empty { display: none; }
.chips-row li { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.25rem 0.25rem 0.3rem; border: 1px solid var(--input); border-radius: 0.7rem; background: var(--muted); cursor: grab; user-select: none; transition: border-color 150ms ease, opacity 150ms ease; }
.chips-row li:hover { border-color: rgb(255 255 255 / 0.2); }
.chips-row li:focus-visible { outline: 2px solid var(--brand); outline-offset: 1px; }
.chips-row li.dragging { opacity: 0.45; border-style: dashed; }
.chips-row li span { font: 400 0.8125rem var(--mono); }
.chip-x { width: 1.5rem; height: 1.5rem; display: grid; place-items: center; padding: 0; border: 0; border-radius: 0.45rem; background: transparent; color: var(--muted-fg); font-size: 1rem; line-height: 1; cursor: pointer; }
.chip-x:hover { background: var(--accent); color: var(--fg); }
.link { padding: 0; border: 0; background: none; color: var(--fg); font: inherit; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.ib[data-empty] .ib-when-picked { display: none; }
.ib:not([data-empty]) .ib-when-empty { display: none; }
.ib-result { display: grid; gap: 0.5rem; min-width: 0; }
.ib-result .stage span { min-height: 5rem; }
.ib-result .stage[data-theme="dark"] .light-ground, .ib-result .stage[data-theme="color"] .light-ground, .ib-result .stage[data-theme="light"] .dark-ground { display: none; }
.ib-result .stage img { max-width: 100%; height: auto; max-height: 7rem; }
.ib-result .stage:not([data-theme="auto"]) { grid-template-columns: minmax(0, 1fr); }
.picker { transition: opacity 200ms ease, transform 200ms ease; }
.picker.near { opacity: 0; pointer-events: none; transform: translateY(0.5rem); }
.btn-small { height: 1.875rem; padding-inline: 0.65rem; font-size: 0.8125rem; border-radius: 0.6rem; }
.icon-group { margin-top: 1.75rem; }
.icon-group h3 { margin: 0 0 0.5rem; font: 600 0.75rem var(--sans); letter-spacing: 0.06em; text-transform: uppercase; color: var(--subtle); }
.icon-group h3 span { margin-left: 0.25rem; color: var(--muted-fg); font-family: var(--mono); letter-spacing: 0; }
.icons { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(5.75rem, 1fr)); gap: 0.25rem; }
.icon { position: relative; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 0.75rem 0.25rem 0.5rem; border: 1px solid transparent; border-radius: 0.75rem; background: transparent; cursor: pointer; transition: background-color 150ms ease, border-color 150ms ease; }
.icon:hover { background: var(--accent); border-color: var(--border); }
.icon:active img { transform: scale(0.94); }
.icon img { transition: transform 150ms ease; }
.icon span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; font-family: var(--mono); font-size: 0.75rem; color: var(--muted-fg); }
.icon[aria-pressed="true"] { background: rgb(76 141 255 / 0.1); border-color: rgb(76 141 255 / 0.55); }
.icon[aria-pressed="true"] span { color: var(--fg); }
.icon[aria-pressed="true"]::after { content: attr(data-order); position: absolute; top: 0.35rem; right: 0.35rem; min-width: 1.125rem; height: 1.125rem; padding-inline: 0.25rem; border-radius: 999px; background: var(--primary); color: #fff; font: 600 0.6875rem/1.125rem var(--sans); text-align: center; }
.empty { margin: 1.75rem 0 0; color: var(--muted-fg); font-size: 0.9375rem; }

footer { position: relative; }
footer::before { content: ""; position: absolute; inset: 0 0 auto; height: 1px; background: linear-gradient(to right, transparent, rgb(255 255 255 / 0.12), transparent); }
footer .page { display: flex; flex-direction: column; gap: 0.75rem; padding-block: 1.5rem; font-size: 0.75rem; color: var(--subtle); }
footer p { margin: 0; }
@media (min-width: 640px) { footer .page { flex-direction: row; align-items: center; justify-content: space-between; } }
footer a { text-decoration: none; transition: color 150ms ease; }
footer a:hover { color: var(--fg); }
footer nav { display: flex; gap: 1rem; }

@keyframes shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
@keyframes rise { from { opacity: 0; transform: translateY(16px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
.rise { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; animation-delay: var(--d, 0ms); }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *, *::before, *::after { animation-duration: 0.01ms !important; animation-delay: 0s !important; transition-duration: 0.01ms !important; } }
</style>
</head>
<body>
<div class="hero">
<div class="backdrop" aria-hidden="true"><img src="/img/bg3-1920.webp" srcset="/img/bg3-768.webp 768w, /img/bg3-1920.webp 1920w" sizes="100vw" alt="" fetchpriority="high"></div>
<header class="page">
<a href="/" class="brand" aria-label="MSCode Badges"><img src="/img/logo-26.webp" srcset="/img/logo-26.webp 1x, /img/logo-52.webp 2x" alt="" width="26" height="26"><span>MSCode <em>Badges</em></span></a>
<div class="nav">
<a class="btn" href="https://github.com/mscode-pl/badges">GitHub ${arrowIcon}</a>
<a class="btn" href="https://mscode.pl">mscode.pl ${arrowIcon}</a>
</div>
</header>

<main class="page">
<div class="rise">
<h1><span>Badges and icons</span><span class="text-gradient">for your README</span></h1>
<p class="lead">Static and live badges for npm, Packagist and GitHub, profile buttons and tech icon rows. Light and dark, drawn as vector paths so they look the same everywhere. Free, no sign-up.</p>
</div>
<ul class="chips rise" style="--d: 60ms" aria-label="Features">
<li>Light and dark</li><li>npm</li><li>Packagist</li><li>GitHub Actions</li><li>Profile views</li><li>WakaTime</li><li>${ids.length} icons</li><li>MIT</li>
</ul>
<nav class="jump rise" style="--d: 100ms" aria-label="Sections">
<a class="btn btn-primary" href="#builder">Make a badge</a>
<a class="btn" href="#static">Badges</a>
<a class="btn" href="#icons">Icons</a>
<a class="btn" href="#profile">Profile</a>
<a class="btn" href="#options">Options</a>
</nav>

<div class="grid">
<section class="card wide rise" style="--d: 120ms" id="builder" aria-labelledby="builder-title">
<h2 id="builder-title">Make a badge</h2>
<p class="intro">Type, pick, copy. The preview updates as you go.</p>
<form class="builder" id="form" autocomplete="off">
<div class="fields">
<div class="field"><label for="f-label">Label</label><input id="f-label" name="label" value="node" placeholder="Optional"></div>
<div class="field"><label for="f-message">Message</label><input id="f-message" name="message" value="22+" placeholder="Required"></div>
<div class="field"><label for="f-color">Color</label><input id="f-color" name="color" value="339933" placeholder="Hex or name" spellcheck="false">
<div class="swatches">${swatches.map((s) => `<button type="button" class="swatch" data-color="${s}" style="background:${named[s]}" title="${s}" aria-label="Use ${s}"></button>`).join('')}</div></div>
<div class="field"><label for="f-icon">Icon</label><input id="f-icon" name="icon" list="icon-ids" placeholder="e.g. nodejs" spellcheck="false"><datalist id="icon-ids">${ids.map((id) => `<option value="${id}">`).join('')}</datalist></div>
<fieldset class="field full"><legend>Style</legend><div class="segmented"><label><input type="radio" name="style" value="flat" checked><span>Flat</span></label><label><input type="radio" name="style" value="button"><span>Button</span></label></div></fieldset>
</div>
<div class="result">
<div class="stage"><span class="dark-ground"><img id="p-dark" alt="Preview on dark"></span><span class="light-ground"><img id="p-light" alt="Preview on light"></span></div>
<p class="eyebrow">Markdown</p>
<div class="row"><code id="o-md"></code><button type="button" class="copy" id="c-md" aria-label="Copy Markdown" title="Copy">${copyIcon}</button></div>
<p class="eyebrow">HTML with light and dark</p>
<div class="row"><code id="o-html"></code><button type="button" class="copy" id="c-html" aria-label="Copy HTML" title="Copy">${copyIcon}</button></div>
</div>
</form>
</section>

${cards}

<section class="card rise" style="--d: 460ms" id="options" aria-labelledby="options-title">
<h2 id="options-title">Options</h2>
<p class="intro">Query parameters that work on every badge.</p>
<dl>${options.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
<p class="intro">Color names: ${swatches.map((s) => `<code>${s}</code>`).join(' ')}.</p>
</section>

<section class="card wide rise" style="--d: 520ms" id="icons" aria-labelledby="icons-title">
<h2 id="icons-title">Icons</h2>
<p class="intro">Rows of icons in one image, <code>/icons?i=react,ts,hono</code>. Three themes: <code>dark</code> (default), <code>light</code> and <code>color</code>, where every tile takes its brand colour. <code>perline=</code> wraps the row (15 by default). Sized like skillicons, so <code>height="40"</code> keeps working.</p>
<div class="ib" id="ib" data-empty>
<div class="ib-top">
<fieldset class="field"><legend>Theme</legend><div class="segmented" id="ib-theme"><label><input type="radio" name="ib-theme" value="auto" checked><span>Auto</span></label><label><input type="radio" name="ib-theme" value="dark"><span>Dark</span></label><label><input type="radio" name="ib-theme" value="light"><span>Light</span></label><label><input type="radio" name="ib-theme" value="color"><span>Color</span></label></div></fieldset>
<div class="field ib-perline"><label for="ib-perline">Per line</label><input id="ib-perline" type="number" min="1" max="50" value="15" inputmode="numeric"></div>
<div class="field ib-presets"><span class="label">Start from</span><div class="ib-preset-list">${presets.map((p) => `<button type="button" class="btn btn-small" data-preset="${p.ids.join(',')}">${esc(p.name)}</button>`).join('')}</div></div>
</div>
<div class="ib-picked">
<p class="ib-hint ib-when-empty">Nothing picked yet. Click icons below, search with <kbd>/</kbd>, or start from a preset.</p>
<ol class="chips-row" id="ib-list" aria-label="Your icons, in order"></ol>
<p class="ib-hint ib-when-picked">Drag to reorder, or focus an icon and use the arrow keys. <button type="button" class="link" id="ib-clear">Clear all</button></p>
</div>
<div class="ib-when-picked ib-result">
<div class="stage" id="ib-stage"><span class="dark-ground"><img id="ib-dark" alt="Your row on dark"></span><span class="light-ground"><img id="ib-light" alt="Your row on light"></span></div>
<p class="eyebrow" id="ib-html-label">HTML with light and dark</p>
<div class="row"><code id="ib-html"></code><button type="button" class="copy" id="ib-copy-html" aria-label="Copy HTML" title="Copy">${copyIcon}</button></div>
<p class="eyebrow">Markdown</p>
<div class="row"><code id="ib-md"></code><button type="button" class="copy" id="ib-copy-md" aria-label="Copy Markdown" title="Copy">${copyIcon}</button></div>
<p class="eyebrow">Link to this row</p>
<div class="row"><code id="ib-link"></code><button type="button" class="copy" id="ib-copy-link" aria-label="Copy link" title="Copy">${copyIcon}</button></div>
</div>
</div>
<div class="search">${searchIcon}<input id="icon-search" type="search" placeholder="Search ${ids.length} icons, e.g. laravel, database, jetbrains" aria-label="Search icons" autocomplete="off" spellcheck="false"><kbd>/</kbd></div>
<div id="icon-groups">${iconGroups}</div>
<p class="empty" id="icon-empty" hidden>No icons match. Missing one? <a href="https://github.com/mscode-pl/badges/issues">Ask for it on GitHub</a>.</p>
<div class="picker" id="picker" data-empty aria-live="polite">
<span class="picker-count"><strong id="pick-count">0</strong> picked</span>
<span class="picker-preview"><img id="pick-img" alt="Your row"></span>
<span class="picker-actions"><button type="button" class="btn btn-small btn-primary" id="pick-copy">Copy HTML</button><a class="btn btn-small" href="#ib">Edit row</a></span>
</div>
</section>
</div>
</main>
</div>

<footer>
<div class="page">
<p>&copy; ${year} MSCode Mateusz Sikorski. Brand icons from <a href="https://github.com/devicons/devicon">devicon</a> (MIT) and <a href="https://simpleicons.org">Simple Icons</a> (CC0), trademarks of their owners.</p>
<nav><a href="https://github.com/mscode-pl/badges">GitHub</a><a href="https://mscode.pl">mscode.pl</a></nav>
</div>
</footer>

<script>
const origin = ${JSON.stringify(origin)};
const form = document.getElementById('form');
const seg = (s) => encodeURIComponent(s.replace(/_/g, '__').replace(/ /g, '_')).replace(/%2B/g, '+').replace(/%40/g, '@');
function build() {
  const f = new FormData(form);
  const label = String(f.get('label') || '').trim();
  const message = String(f.get('message') || '').trim() || 'badge';
  const color = String(f.get('color') || '').trim().replace(/^#/, '');
  const icon = String(f.get('icon') || '').trim();
  const query = new URLSearchParams();
  if (f.get('style') === 'button') query.set('style', 'button');
  if (icon) query.set('icon', icon);
  let path = '/badge/' + (label ? seg(label) + '/' : '') + seg(message);
  if (color) { if (label) path += '/' + encodeURIComponent(color); else query.set('color', color); }
  const q = query.toString();
  const url = path + (q ? '?' + q : '');
  const themed = (t) => url + (q ? '&' : '?') + 'theme=' + t;
  const alt = label ? label + ' ' + message : message;
  document.getElementById('p-dark').src = themed('dark');
  document.getElementById('p-light').src = themed('light');
  const md = '![' + alt + '](' + origin + url + ')';
  const html = '<picture><source media="(prefers-color-scheme: dark)" srcset="' + origin + themed('dark') + '"><img src="' + origin + themed('light') + '" alt="' + alt.replace(/"/g, '&quot;') + '"></picture>';
  document.getElementById('o-md').textContent = md;
  document.getElementById('o-html').textContent = html;
  document.getElementById('c-md').dataset.copy = md;
  document.getElementById('c-html').dataset.copy = html;
}
let timer;
form.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(build, 150); });
form.addEventListener('submit', (e) => e.preventDefault());
document.querySelectorAll('.swatch').forEach((b) => b.addEventListener('click', () => { form.color.value = b.dataset.color; build(); }));
build();
const ib = document.getElementById('ib');
const list = document.getElementById('ib-list');
const picker = document.getElementById('picker');
const known = new Set([...document.querySelectorAll('.icon[data-id]')].map((b) => b.dataset.id));
const picked = (new URLSearchParams(location.search).get('i') || '').split(',').map((s) => s.trim().toLowerCase()).filter((id) => known.has(id));
const themeOf = () => document.querySelector('input[name="ib-theme"]:checked').value;
const perLine = () => Math.min(50, Math.max(1, parseInt(document.getElementById('ib-perline').value, 10) || 15));
let gridTheme = 'dark';
function setCopy(id, text) { document.getElementById(id).dataset.copy = text; }
function renderPick(keepList) {
  const theme = themeOf();
  const tileTheme = theme === 'auto' ? 'dark' : theme;
  if (tileTheme !== gridTheme) {
    gridTheme = tileTheme;
    document.querySelectorAll('.icon[data-id] img').forEach((img) => { img.src = '/icons?i=' + img.closest('.icon').dataset.id + '&theme=' + tileTheme; });
  }
  document.querySelectorAll('.icon[data-id]').forEach((b) => {
    const at = picked.indexOf(b.dataset.id);
    b.setAttribute('aria-pressed', at >= 0 ? 'true' : 'false');
    if (at >= 0) b.dataset.order = String(at + 1); else delete b.dataset.order;
  });
  if (!keepList) list.innerHTML = picked.map((id, i) => '<li draggable="true" tabindex="0" data-id="' + id + '" aria-label="' + id + ', position ' + (i + 1) + '"><img src="/icons?i=' + id + '&theme=' + tileTheme + '" alt="" width="28" height="28"><span>' + id + '</span><button type="button" class="chip-x" aria-label="Remove ' + id + '">&times;</button></li>').join('');
  document.getElementById('pick-count').textContent = String(picked.length);
  history.replaceState(null, '', location.pathname + (picked.length ? '?i=' + picked.join(',') : '') + location.hash);
  ib.toggleAttribute('data-empty', !picked.length);
  picker.toggleAttribute('data-empty', !picked.length);
  if (!picked.length) return;
  const line = perLine();
  const base = '/icons?i=' + picked.join(',') + (line !== 15 ? '&perline=' + line : '');
  const themed = (t) => base + (t === 'dark' ? '' : '&theme=' + t);
  const alt = picked.join(', ');
  document.getElementById('ib-stage').dataset.theme = theme;
  document.getElementById('ib-dark').src = themed(tileTheme);
  document.getElementById('ib-light').src = themed('light');
  const html = theme === 'auto'
    ? '<picture><source media="(prefers-color-scheme: dark)" srcset="' + origin + themed('dark') + '"><img src="' + origin + themed('light') + '" alt="' + alt + '" height="40"></picture>'
    : '<img src="' + origin + themed(theme) + '" alt="' + alt + '" height="40">';
  const md = '![' + alt + '](' + origin + themed(tileTheme) + ')';
  const link = origin + '/?i=' + picked.join(',') + '#icons';
  document.getElementById('ib-html-label').textContent = theme === 'auto' ? 'HTML with light and dark' : 'HTML';
  document.getElementById('ib-html').textContent = html;
  document.getElementById('ib-md').textContent = md;
  document.getElementById('ib-link').textContent = link;
  setCopy('ib-copy-html', html);
  setCopy('ib-copy-md', md);
  setCopy('ib-copy-link', link);
  setCopy('pick-copy', html);
  document.getElementById('pick-img').src = '/icons?i=' + picked.join(',') + '&perline=50' + (tileTheme === 'dark' ? '' : '&theme=' + tileTheme);
}
document.getElementById('icon-groups').addEventListener('click', (event) => {
  const button = event.target.closest('.icon[data-id]');
  if (!button) return;
  const at = picked.indexOf(button.dataset.id);
  if (at >= 0) picked.splice(at, 1); else picked.push(button.dataset.id);
  renderPick();
});
document.getElementById('ib-clear').addEventListener('click', () => { picked.length = 0; renderPick(); });
document.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => { picked.splice(0, picked.length, ...b.dataset.preset.split(',')); renderPick(); }));
document.getElementById('ib-theme').addEventListener('change', () => renderPick());
document.getElementById('ib-perline').addEventListener('input', () => renderPick());
list.addEventListener('click', (event) => {
  const x = event.target.closest('.chip-x');
  if (!x) return;
  picked.splice(picked.indexOf(x.closest('li').dataset.id), 1);
  renderPick();
});
function move(id, to) {
  const from = picked.indexOf(id);
  if (from < 0 || to < 0 || to >= picked.length || to === from) return false;
  picked.splice(to, 0, picked.splice(from, 1)[0]);
  renderPick();
  return true;
}
list.addEventListener('keydown', (event) => {
  const li = event.target.closest('li[data-id]');
  if (!li || event.target !== li) return;
  const id = li.dataset.id;
  const at = picked.indexOf(id);
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    if (move(id, at + (event.key === 'ArrowLeft' ? -1 : 1))) list.querySelector('li[data-id="' + id + '"]').focus();
  } else if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault();
    picked.splice(at, 1);
    renderPick();
    const next = list.children[Math.min(at, list.children.length - 1)];
    if (next) next.focus();
  }
});
let dragging = null;
list.addEventListener('dragstart', (event) => {
  const li = event.target.closest('li[data-id]');
  if (!li) return;
  dragging = li.dataset.id;
  li.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', dragging);
});
list.addEventListener('dragover', (event) => {
  if (!dragging) return;
  event.preventDefault();
  const li = event.target.closest('li[data-id]');
  if (!li || li.dataset.id === dragging) return;
  const box = li.getBoundingClientRect();
  const target = picked.indexOf(li.dataset.id);
  const from = picked.indexOf(dragging);
  let to = event.clientX > box.left + box.width / 2 ? target + 1 : target;
  if (from < to) to--;
  if (to === from) return;
  // Move the node itself: re-rendering would detach the dragged element and its dragend would never arrive.
  picked.splice(to, 0, picked.splice(from, 1)[0]);
  const nodes = new Map([...list.children].map((node) => [node.dataset.id, node]));
  picked.forEach((id, i) => { const node = nodes.get(id); node.setAttribute('aria-label', id + ', position ' + (i + 1)); list.appendChild(node); });
  renderPick(true);
});
list.addEventListener('drop', (event) => event.preventDefault());
list.addEventListener('dragend', () => { dragging = null; list.querySelectorAll('.dragging').forEach((li) => li.classList.remove('dragging')); });
new IntersectionObserver(([entry]) => picker.classList.toggle('near', entry.isIntersecting)).observe(ib);
renderPick();

const search = document.getElementById('icon-search');
search.addEventListener('input', () => {
  const terms = search.value.toLowerCase().split(/\\s+/).filter(Boolean);
  let shown = 0;
  document.querySelectorAll('.icon-group').forEach((group) => {
    let visible = 0;
    group.querySelectorAll('li[data-search]').forEach((li) => {
      const groupName = group.querySelector('h3').textContent.toLowerCase();
      const hay = li.dataset.search + ' ' + groupName;
      const match = terms.every((t) => hay.includes(t));
      li.hidden = !match;
      if (match) visible++;
    });
    group.hidden = visible === 0;
    group.querySelector('h3 span').textContent = String(visible);
    shown += visible;
  });
  document.getElementById('icon-empty').hidden = shown > 0;
});
document.addEventListener('keydown', (event) => {
  if (event.key !== '/' || event.target.closest('input, textarea')) return;
  event.preventDefault();
  search.focus();
  search.scrollIntoView({ block: 'center', behavior: 'smooth' });
});

document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-copy]');
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.setAttribute('data-done', '');
    setTimeout(() => button.removeAttribute('data-done'), 1200);
  } catch {}
});
</script>
</body>
</html>`;
}
