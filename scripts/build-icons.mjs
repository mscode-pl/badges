// Builds src/icons/generated.ts from Simple Icons and the logos in icons/brand. Run: pnpm icons
import fs from 'node:fs';
import * as simpleIcons from 'simple-icons';

// Our id on the left, Simple Icons slug on the right. Ids follow skillicons where one exists.
const selection = {
    nextjs: 'nextdotjs',
    react: 'react',
    ts: 'typescript',
    js: 'javascript',
    tailwind: 'tailwindcss',
    vite: 'vite',
    astro: 'astro',
    redux: 'redux',
    html: 'html5',
    css: 'css',
    sass: 'sass',
    vue: 'vuedotjs',
    nuxt: 'nuxt',
    svelte: 'svelte',
    angular: 'angular',
    expo: 'expo',
    electron: 'electron',
    laravel: 'laravel',
    php: 'php',
    nodejs: 'nodedotjs',
    bun: 'bun',
    deno: 'deno',
    express: 'express',
    nestjs: 'nestjs',
    hono: 'hono',
    go: 'go',
    py: 'python',
    django: 'django',
    fastapi: 'fastapi',
    rust: 'rust',
    kotlin: 'kotlin',
    swift: 'swift',
    dart: 'dart',
    flutter: 'flutter',
    graphql: 'graphql',
    bash: 'gnubash',
    postgres: 'postgresql',
    mysql: 'mysql',
    mariadb: 'mariadb',
    sqlite: 'sqlite',
    mongodb: 'mongodb',
    redis: 'redis',
    prisma: 'prisma',
    drizzle: 'drizzle',
    supabase: 'supabase',
    firebase: 'firebase',
    docker: 'docker',
    kubernetes: 'kubernetes',
    nginx: 'nginx',
    caddy: 'caddy',
    traefik: 'traefikproxy',
    cloudflare: 'cloudflare',
    workers: 'cloudflareworkers',
    vercel: 'vercel',
    netlify: 'netlify',
    githubactions: 'githubactions',
    prometheus: 'prometheus',
    grafana: 'grafana',
    sentry: 'sentry',
    terraform: 'terraform',
    ansible: 'ansible',
    debian: 'debian',
    ubuntu: 'ubuntu',
    linux: 'linux',
    github: 'github',
    gitlab: 'gitlab',
    git: 'git',
    webstorm: 'webstorm',
    phpstorm: 'phpstorm',
    pycharm: 'pycharm',
    idea: 'intellijidea',
    goland: 'goland',
    jetbrains: 'jetbrains',
    figma: 'figma',
    postman: 'postman',
    npm: 'npm',
    pnpm: 'pnpm',
    yarn: 'yarn',
    packagist: 'packagist',
    composer: 'composer',
    vitest: 'vitest',
    jest: 'jest',
    eslint: 'eslint',
    prettier: 'prettier',
    storybook: 'storybook',
    stripe: 'stripe',
    strapi: 'strapi',
    shopify: 'shopify',
    woocommerce: 'woocommerce',
    wordpress: 'wordpress',
    medusa: 'medusa',
    discord: 'discord',
    notion: 'notion',
    linear: 'linear',
    instagram: 'instagram',
    facebook: 'facebook',
    youtube: 'youtube',
    x: 'x',
    tiktok: 'tiktok',
    gmail: 'gmail',
    chrome: 'googlechrome',
    claude: 'claude',
    anthropic: 'anthropic',
};

const bySlug = new Map(Object.values(simpleIcons).filter((i) => i?.slug).map((i) => [i.slug, i]));
const missing = Object.entries(selection).filter(([, slug]) => !bySlug.has(slug));
if (missing.length) {
    console.error('not in simple-icons:', missing.map(([id, slug]) => `${id} (${slug})`).join(', '));
    process.exit(1);
}

// Simple Icons only has these as black squares, which all look alike once flipped for a dark tile.
const gradients = {
    webstorm: ['#07c3f2', '#087cfa'],
    phpstorm: ['#b345f1', '#ff318c'],
    goland: ['#3bea62', '#0d7bf7'],
    pycharm: ['#21d789', '#fcf84a'],
    idea: ['#fe315d', '#087cfa'],
};

// Multi-colour logos Simple Icons does not carry, from Wikimedia Commons (public domain) and przelewy24.pl.
const brand = {
    php: { title: 'PHP', hex: '#777bb4' },
    vscode: { title: 'Visual Studio Code', hex: '#007acc' },
    linkedin: { title: 'LinkedIn', hex: '#0a66c2' },
    przelewy24: { title: 'Przelewy24', hex: '#d13239' },
    inpost: { title: 'InPost', hex: '#ffcb04' },
};

function sanitize(id, source) {
    const clean = source
        .replace(/<\?xml[\s\S]*?\?>/g, '')
        .replace(/<!DOCTYPE[\s\S]*?>/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
        .replace(/<title[\s\S]*?<\/title>/g, '');
    const root = clean.match(/<svg\b[^>]*>/)[0];
    const viewBox = root.match(/viewBox="([^"]*)"/)[1].trim().split(/[\s,]+/).map(Number).join(' ');
    const inherited = [...root.matchAll(/\s(fill|fill-rule|clip-rule|stroke)="([^"]*)"/g)].map((m) => `${m[1]}="${m[2]}"`).join(' ');
    let body = clean.slice(clean.indexOf(root) + root.length, clean.lastIndexOf('</svg>'))
        .replace(/\s(sodipodi|inkscape):[\w-]+="[^"]*"/g, '')
        .replace(/xlink:href=/g, 'href=')
        .replace(/\sid="([^"]+)"/g, (_, x) => ` id="${id}-${x}"`)
        .replace(/url\(#([^)]+)\)/g, (_, x) => `url(#${id}-${x})`)
        .replace(/href="#([^"]+)"/g, (_, x) => `href="#${id}-${x}"`)
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
    if (/<script|\son\w+=|javascript:|<foreignObject|href="http/i.test(body)) throw new Error(`unsafe markup in ${id}`);
    if (inherited) body = `<g ${inherited}>${body}</g>`;
    return { viewBox, body };
}

const lines = [];
for (const [id, slug] of Object.entries(selection)) {
    if (brand[id]) continue;
    const icon = bySlug.get(slug);
    const hex = `#${icon.hex.toLowerCase()}`;
    const g = gradients[id];
    if (g) {
        const body = `<defs><linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></linearGradient></defs><path fill="url(#${id}-g)" d="${icon.path}"/>`;
        lines.push([id, `{ title: ${JSON.stringify(icon.title)}, hex: '${g[1]}', viewBox: '0 0 24 24', body: ${JSON.stringify(body)} }`]);
    } else {
        lines.push([id, `{ title: ${JSON.stringify(icon.title)}, hex: '${hex}', path: ${JSON.stringify(icon.path)} }`]);
    }
}
for (const [id, meta] of Object.entries(brand)) {
    const { viewBox, body } = sanitize(id, fs.readFileSync(new URL(`../icons/brand/${id}.svg`, import.meta.url), 'utf8'));
    lines.push([id, `{ title: ${JSON.stringify(meta.title)}, hex: '${meta.hex}', viewBox: '${viewBox}', body: ${JSON.stringify(body)} }`]);
}
lines.sort(([a], [b]) => a.localeCompare(b));

const out = `// Generated by scripts/build-icons.mjs from simple-icons (CC0) and icons/brand. Do not edit by hand.
import type { Icon } from './types';

export const generatedIcons: Record<string, Icon> = {
${lines.map(([id, value]) => `    ${JSON.stringify(id)}: ${value},`).join('\n')}
};
`;
fs.writeFileSync(new URL('../src/icons/generated.ts', import.meta.url), out);
console.log(`wrote ${lines.length} icons`);
