// Draws .github/banner-dark.svg and banner-light.svg with real badges from the service. Run: pnpm banner
import fs from 'node:fs';
import opentype from 'opentype.js';

const service = process.env.BADGES_URL ?? 'https://badges.mscode.pl';
const root = new URL('../', import.meta.url);
const load = (name) => {
    const b = fs.readFileSync(new URL(`fonts/${name}`, root));
    return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length));
};
const fonts = {
    display: load('plus-jakarta-sans-latin-800-normal.ttf'),
    body: load('plus-jakarta-sans-latin-500-normal.ttf'),
    mono: load('jetbrains-mono-latin-400-normal.ttf'),
};
const logoSrc = fs.readFileSync(new URL('.github/mscode-logo-black.svg', root), 'utf8');
const logoShapes = [...logoSrc.matchAll(/<(path|polygon)\s[^>]*\/>/g)].map((m) => m[0].replace(/\sfill="[^"]*"/, '')).join('');

// Glyph by glyph like the service, since opentype.js throws on some GSUB lookups in these fonts.
function text(font, size, x, y, segments, { anchor = 'start', spacing = 0 } = {}) {
    const f = fonts[font];
    const scale = size / f.unitsPerEm;
    const glyphs = [];
    let width = 0;
    let prev;
    for (const [str, fill] of segments) {
        for (const char of str) {
            const glyph = f.charToGlyph(char);
            if (prev) width += f.getKerningValue(prev, glyph) * scale + spacing;
            glyphs.push({ glyph, x: width, fill });
            width += glyph.advanceWidth * scale;
            prev = glyph;
        }
    }
    const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
    return glyphs.map((g) => `<path fill="${g.fill}" d="${g.glyph.getPath(x0 + g.x, y, size).toPathData(2)}"/>`).join('');
}

async function embed(path, x, y, height) {
    const res = await fetch(service + path);
    if (!res.ok) throw new Error(`${res.status} for ${path}`);
    const svg = await res.text();
    const w = Number(svg.match(/width="([\d.]+)"/)[1]);
    const h = Number(svg.match(/height="([\d.]+)"/)[1]);
    const width = (w * height) / h;
    return { width, svg: svg.replace(/^<svg [^>]*?width="[\d.]+" height="[\d.]+"/, `<svg xmlns="http://www.w3.org/2000/svg" x="${x.toFixed(1)}" y="${y}" width="${width.toFixed(1)}" height="${height}"`) };
}

async function row(paths, x, y, height, gap) {
    let cx = x;
    let out = '';
    for (const path of paths) {
        const item = await embed(path, cx, y, height);
        out += item.svg;
        cx += item.width + gap;
    }
    return out;
}

const themes = {
    dark: {
        name: 'dark', bg: '#040d1a', ink: '#ffffff', gridInk: '#ffffff', glow: 0.55, accent: '#5b93e6', muted: '#9fb0c8',
        chipFill: '#ffffff', chipFillOpacity: 0.06, chipStroke: '#ffffff', chipStrokeOpacity: 0.12,
        card: '#0b1728', cardStroke: '#ffffff', cardStrokeOpacity: 0.12, dot: '#ffffff', dotOpacity: 0.18, file: '#6f84a3',
    },
    light: {
        name: 'light', bg: '#f5f5f7', ink: '#0a0a0a', gridInk: '#0a0a0a', glow: 0.18, accent: '#1a5bb5', muted: '#4b5563',
        chipFill: '#ffffff', chipFillOpacity: 1, chipStroke: '#0a0a0a', chipStrokeOpacity: 0.1,
        card: '#ffffff', cardStroke: '#0a0a0a', cardStrokeOpacity: 0.1, dot: '#0a0a0a', dotOpacity: 0.12, file: '#6b7280',
    },
};

function card(t, y, h, file, highlight) {
    const dots = [726, 744, 762].map((cx) => `<circle cx="${cx}" cy="${y + 26}" r="5" fill="${t.dot}" fill-opacity="${t.dotOpacity}"/>`).join('');
    const stroke = highlight ? `stroke="${t.accent}" stroke-opacity="0.55"` : `stroke="${t.cardStroke}" stroke-opacity="${t.cardStrokeOpacity}"`;
    return `<rect x="700" y="${y}" width="508" height="${h}" rx="14" fill="${t.card}" ${stroke}/>${dots}`
        + text('mono', 14, 1184, y + 31, [[file, t.file]], { anchor: 'end' });
}

function chip(t, x, w, label) {
    return `<rect x="${x}" y="290" width="${w}" height="32" rx="16" fill="${t.chipFill}" fill-opacity="${t.chipFillOpacity}" stroke="${t.chipStroke}" stroke-opacity="${t.chipStrokeOpacity}"/>`
        + text('mono', 14, x + w / 2, 311, [[label, t.muted]], { anchor: 'middle' });
}

async function banner(t) {
    const q = `theme=${t.name}`;
    const badges1 = await row([`/npm/v/@mscode-pl/email-lint?${q}`, `/badge/downloads/12k%2Fmonth?${q}`, `/badge/tests/passing/green?${q}`], 726, 112, 26, 10);
    const badges2 = await row([`/badge/node/22+/339933?${q}`, `/badge/license/MIT?${q}`, `/badge/built_with/Hono/E36002?icon=hono&${q}`], 726, 148, 26, 10);
    const icons = await embed(`/icons?i=react,ts,laravel,hono,docker,cloudflare,stripe&theme=${t.name}`, 726, 208, 46);
    const colorIcons = await embed('/icons?i=react,ts,laravel,hono,docker,cloudflare,stripe&theme=color', 726, 270, 46);
    const s = 750 / 868 / 5;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="420" viewBox="0 0 1280 420" role="img" aria-label="MSCode Badges: badges and tech icons for your README">
<defs>
<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${t.gridInk}" stroke-opacity="0.05"/></pattern>
<radialGradient id="glow" cx="0.8" cy="0.45" r="0.6"><stop offset="0" stop-color="#1a5bb5" stop-opacity="${t.glow}"/><stop offset="1" stop-color="#1a5bb5" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1280" height="420" rx="24" fill="${t.bg}"/>
<rect width="1280" height="420" rx="24" fill="url(#grid)"/>
<rect width="1280" height="420" rx="24" fill="url(#glow)"/>
<g fill="${t.ink}" transform="translate(72 64) scale(${s.toFixed(5)}) translate(-66 -434)">${logoShapes}</g>
${text('display', 66, 70, 214, [['README ', t.ink], ['Badges', t.accent]], { spacing: -1.5 })}
${text('body', 22, 72, 262, [['Badges and tech icons that match, in light and dark.', t.muted]])}
${chip(t, 72, 132, 'npm + GitHub')}
${chip(t, 214, 120, '109 icons')}
${chip(t, 344, 112, 'No sign-up')}
${card(t, 58, 280, 'README', true)}${badges1}${badges2}
<path d="M726 192H1182" stroke="${t.cardStroke}" stroke-opacity="${t.cardStrokeOpacity}"/>
${icons.svg}${colorIcons.svg}
</svg>
`;
}

for (const t of Object.values(themes)) {
    fs.writeFileSync(new URL(`.github/banner-${t.name}.svg`, root), await banner(t));
}
console.log('wrote .github/banner-dark.svg and banner-light.svg');
