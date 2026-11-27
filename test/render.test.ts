import { categories } from '../src/icons/categories';
import { describe, expect, it } from 'vitest';
import { findIcon, iconIds } from '../src/icons/registry';
import { renderBadge } from '../src/render/badge';
import { contrast, parseColor, textOn } from '../src/render/colors';
import { renderIconRow } from '../src/render/icons';
import { markColor } from '../src/render/svg';
import { measure } from '../src/render/text';

const width = (svg: string) => Number(svg.match(/width="(\d+)"/)?.[1]);

describe('renderBadge', () => {
    const base = { color: '#1a5bb5', theme: 'light', style: 'flat' } as const;

    it('draws text as paths, never as text elements', () => {
        const svg = renderBadge({ ...base, label: 'npm', message: 'v1.0.0' });
        expect(svg).not.toContain('<text');
        expect(svg).toContain('<title>npm: v1.0.0</title>');
        expect(svg.match(/<path/g)?.length).toBeGreaterThanOrEqual(4);
    });

    it('grows with the text', () => {
        expect(width(renderBadge({ ...base, label: 'downloads', message: '12k/month' }))).toBeGreaterThan(
            width(renderBadge({ ...base, label: 'npm', message: '1k' })),
        );
    });

    it('escapes user text in the title', () => {
        const svg = renderBadge({ ...base, label: '<script>', message: '"x" & y' });
        expect(svg).not.toContain('<script>');
        expect(svg).toContain('&#60;script&#62;');
    });

    it('makes buttons taller than flat badges', () => {
        const svg = renderBadge({ ...base, message: 'Discord', style: 'button', icon: findIcon('discord') });
        expect(svg).toContain('height="32"');
    });

    it('renders Polish letters from the extended font', () => {
        expect(measure('display', 'ń', 13)).toBeGreaterThan(0);
        expect(measure('display', 'Wyceń', 13)).toBeGreaterThan(measure('display', 'Wycen', 13) - 0.5);
    });
});

describe('colors', () => {
    it('parses names, short and long hex, and falls back on junk', () => {
        expect(parseColor('green')).toBe('#1a7f45');
        expect(parseColor('#FF2D20')).toBe('#ff2d20');
        expect(parseColor('f00')).toBe('#ff0000');
        expect(parseColor('javascript:alert(1)')).toBe('#1a5bb5');
    });

    it('picks white text on brand colours and dark text on light ones', () => {
        expect(textOn('#1a5bb5')).toBe('#ffffff');
        expect(textOn('#ff2d20')).toBe('#ffffff');
        expect(textOn('#f7df1e')).toBe('#0a0a0a');
    });

    it('keeps marks visible on their ground', () => {
        expect(markColor('#000000', '#0b1728')).toBe('#ffffff');
        expect(contrast(markColor('#a81d33', '#0b1728'), '#0b1728')).toBeGreaterThanOrEqual(2);
        expect(markColor('#61dafb', '#0b1728')).toBe('#61dafb');
    });
});

describe('icons', () => {
    it('covers every icon the organization profile uses', () => {
        const profile = 'nextjs react ts js tailwind vite astro redux html css laravel php nodejs express go py fastapi graphql bash hono postgres mysql redis prisma docker nginx cloudflare vercel githubactions prometheus grafana debian linux caddy traefik github git vscode webstorm phpstorm pycharm idea goland figma postman pnpm discord stripe strapi przelewy24 inpost';
        expect(profile.split(' ').filter((id) => !findIcon(id))).toEqual([]);
    });

    it('resolves skillicons and Simple Icons style aliases', () => {
        expect(findIcon('typescript')).toBe(findIcon('ts'));
        expect(findIcon('PostgreSQL')).toBe(findIcon('postgres'));
        expect(findIcon('nope')).toBeUndefined();
    });

    it('lays icons out in rows of the requested length', () => {
        const list = ['react', 'ts', 'js', 'go', 'php'].map((id) => findIcon(id)!);
        const svg = renderIconRow(list, 'dark', 3);
        expect(svg).toContain('viewBox="0 0 856 556"');
        expect(svg.match(/rx="58"/g)?.length).toBe(5);
    });

    it('nests multi-colour logos with ids prefixed per icon', () => {
        const svg = renderIconRow(['php', 'vscode', 'inpost'].map((id) => findIcon(id)!), 'dark', 15);
        expect(svg).toContain('<svg x=');
        expect(svg).toMatch(/id="php-/);
        expect(svg).toMatch(/url\(#vscode-/);
        expect(svg).not.toMatch(/xlink:|<script|<metadata/);
    });

    it('gives LinkedIn a one-colour mark on coloured buttons', () => {
        const svg = renderBadge({ message: 'LinkedIn', color: '#0a66c2', theme: 'light', style: 'button', icon: findIcon('linkedin') });
        expect(svg).toContain('fill="#ffffff" fill-rule="evenodd"');
        expect(svg).not.toContain('#007EBB');
    });

    it('keeps the JavaScript yellow with black letters on a light tile', () => {
        const svg = renderIconRow([findIcon('js')!], 'light', 15);
        expect(svg).toContain('fill="#000000"');
        expect(svg).toContain('fill="#f7df1e"');
    });

    it('has no duplicate ids', () => {
        expect(new Set(iconIds()).size).toBe(iconIds().length);
    });
});

describe('categories', () => {
    it('puts every icon in exactly one category', () => {
        const listed = categories.flatMap((c) => c.ids);
        expect(listed.filter((id) => !findIcon(id))).toEqual([]);
        expect(new Set(listed).size).toBe(listed.length);
        expect([...iconIds()].filter((id) => !listed.includes(id))).toEqual([]);
    });
});
