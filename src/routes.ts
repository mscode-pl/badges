import { githubLicense, githubStars, githubWorkflow } from './adapters/github';
import { npmDownloads, npmLicense, npmVersion } from './adapters/npm';
import { packagistDownloads, packagistLicense, packagistVersion } from './adapters/packagist';
import type { BadgeData, Context } from './adapters/types';
import type { Style, Theme } from './render/badge';

export interface Options {
    theme: Theme;
    style: Style;
    label?: string;
    color?: string;
    labelColor?: string;
    icon?: string;
}

export type Route =
    | { kind: 'docs' }
    | { kind: 'font'; file: string }
    | { kind: 'static'; label?: string; message: string; color?: string; options: Options }
    | { kind: 'live'; fallbackLabel: string; load: (ctx: Context) => Promise<BadgeData>; options: Options }
    | { kind: 'icons'; ids: string[]; theme: Theme; perLine: number }
    | { kind: 'not-found' };

// Same escaping as shields.io: "_" is a space and "__" a literal underscore.
export function decodeSegment(segment: string): string {
    return decodeURIComponent(segment)
        .replace(/__/g, '\u0000')
        .replace(/_/g, ' ')
        .replace(/\u0000/g, '_');
}

function options(query: URLSearchParams): Options {
    const theme = query.get('theme') === 'dark' ? 'dark' : 'light';
    const style = query.get('style') === 'button' || query.get('style') === 'for-the-badge' ? 'button' : 'flat';
    return {
        theme,
        style,
        label: query.get('label') ?? undefined,
        color: query.get('color') ?? undefined,
        labelColor: query.get('labelColor') ?? query.get('labelcolor') ?? undefined,
        icon: query.get('icon') ?? query.get('logo') ?? undefined,
    };
}

type Loader = (parts: string[], query: URLSearchParams) => ((ctx: Context) => Promise<BadgeData>) | undefined;

const live: Record<string, { label: string; load: Loader }> = {
    'npm/v': { label: 'npm', load: (p) => (p.length ? (ctx) => npmVersion(ctx, p.join('/')) : undefined) },
    'npm/dm': { label: 'downloads', load: (p) => (p.length ? (ctx) => npmDownloads(ctx, p.join('/'), 'month') : undefined) },
    'npm/dw': { label: 'downloads', load: (p) => (p.length ? (ctx) => npmDownloads(ctx, p.join('/'), 'week') : undefined) },
    'npm/dy': { label: 'downloads', load: (p) => (p.length ? (ctx) => npmDownloads(ctx, p.join('/'), 'year') : undefined) },
    'npm/l': { label: 'license', load: (p) => (p.length ? (ctx) => npmLicense(ctx, p.join('/')) : undefined) },
    'packagist/v': { label: 'packagist', load: (p) => (p.length === 2 ? (ctx) => packagistVersion(ctx, p[0]!, p[1]!) : undefined) },
    'packagist/dt': { label: 'downloads', load: (p) => (p.length === 2 ? (ctx) => packagistDownloads(ctx, p[0]!, p[1]!, 'total') : undefined) },
    'packagist/dm': { label: 'downloads', load: (p) => (p.length === 2 ? (ctx) => packagistDownloads(ctx, p[0]!, p[1]!, 'monthly') : undefined) },
    'packagist/dd': { label: 'downloads', load: (p) => (p.length === 2 ? (ctx) => packagistDownloads(ctx, p[0]!, p[1]!, 'daily') : undefined) },
    'packagist/l': { label: 'license', load: (p) => (p.length === 2 ? (ctx) => packagistLicense(ctx, p[0]!, p[1]!) : undefined) },
    'github/actions': {
        label: 'build',
        load: (p, q) => (p.length === 3 ? (ctx) => githubWorkflow(ctx, p[0]!, p[1]!, p[2]!, q.get('branch') ?? undefined) : undefined),
    },
    'github/stars': { label: 'stars', load: (p) => (p.length === 2 ? (ctx) => githubStars(ctx, p[0]!, p[1]!) : undefined) },
    'github/license': { label: 'license', load: (p) => (p.length === 2 ? (ctx) => githubLicense(ctx, p[0]!, p[1]!) : undefined) },
};

export function parseRoute(url: URL): Route {
    const path = url.pathname.replace(/\.svg$/, '').replace(/\/+$/, '');
    const parts = path.split('/').filter(Boolean);
    const query = url.searchParams;

    if (!parts.length) return { kind: 'docs' };
    if (parts[0] === 'fonts' && parts.length === 2) return { kind: 'font', file: parts[1]! };

    if (parts[0] === 'badge' && parts.length >= 2 && parts.length <= 4) {
        const [label, message, color] = parts.length === 2 ? [undefined, parts[1]!, undefined] : [parts[1], parts[2]!, parts[3]];
        return {
            kind: 'static',
            label: label === undefined ? undefined : decodeSegment(label),
            message: decodeSegment(message),
            color: color === undefined ? undefined : decodeURIComponent(color),
            options: options(query),
        };
    }

    if (parts[0] === 'icons' && parts.length === 1) {
        const ids = (query.get('i') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
        const perLine = Number(query.get('perline') ?? 15);
        return {
            kind: 'icons',
            ids,
            theme: query.get('theme') === 'light' ? 'light' : 'dark',
            perLine: Number.isInteger(perLine) && perLine > 0 && perLine <= 50 ? perLine : 15,
        };
    }

    const key = parts.slice(0, 2).join('/');
    const entry = live[key];
    if (entry) {
        const load = entry.load(parts.slice(2).map((p) => decodeURIComponent(p)), query);
        if (load) return { kind: 'live', fallbackLabel: entry.label, load, options: options(query) };
    }

    return { kind: 'not-found' };
}
