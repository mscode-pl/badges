import { UpstreamError, type BadgeData, type Context, type Fetcher } from './adapters/types';
import { docsPage } from './docs';
import { findIcon } from './icons/registry';
import type { Icon } from './icons/types';
import { renderBadge } from './render/badge';
import { named, parseColor } from './render/colors';
import { fontFiles } from './render/fonts';
import { renderIconRow } from './render/icons';
import { parseRoute, type Options } from './routes';

export interface Env {
    GITHUB_TOKEN?: string;
}

const seconds = { static: 86400, live: 900, error: 120 };

// Bump when rendering changes, so the edge cache drops badges drawn by older code.
const renderVersion = '1';

function svg(body: string, maxAge: number): Response {
    return new Response(body, {
        headers: {
            'content-type': 'image/svg+xml; charset=utf-8',
            'cache-control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
            'access-control-allow-origin': '*',
            'x-content-type-options': 'nosniff',
            'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'",
        },
    });
}

function badge(data: BadgeData, opts: Options, fallbackColor: string): string {
    const label = opts.label ?? data.label;
    return renderBadge({
        label: label || undefined,
        message: data.message,
        color: opts.color ? parseColor(opts.color) : (data.color ?? fallbackColor),
        labelColor: opts.labelColor ? parseColor(opts.labelColor) : undefined,
        theme: opts.theme,
        style: opts.style,
        icon: findIcon(opts.icon),
    });
}

// Workers throw "Illegal invocation" when the global fetch is called as a method of another object.
const globalFetch: Fetcher = (url, init) => fetch(url, init);

export async function handle(request: Request, env: Env, fetcher: Fetcher = globalFetch): Promise<Response> {
    const url = new URL(request.url);
    const route = parseRoute(url);

    switch (route.kind) {
        case 'docs':
            return new Response(docsPage(url.origin), {
                headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=3600' },
            });

        case 'font': {
            const data = fontFiles[route.file];
            if (!data) return new Response('Not found', { status: 404 });
            return new Response(data, {
                headers: { 'content-type': 'font/ttf', 'cache-control': 'public, max-age=31536000, immutable', 'access-control-allow-origin': '*' },
            });
        }

        case 'static': {
            const color = parseColor(route.options.color ?? route.color);
            return svg(badge({ label: route.label ?? '', message: route.message }, route.options, color), seconds.static);
        }

        case 'live': {
            const ctx: Context = { fetch: fetcher, githubToken: env.GITHUB_TOKEN };
            try {
                const data = await route.load(ctx);
                return svg(badge(data, route.options, named.blue!), seconds.live);
            } catch (error) {
                console.error('upstream failed', url.pathname, String(error));
                const message = error instanceof UpstreamError && error.notFound ? 'not found' : 'unknown';
                const data = { label: route.fallbackLabel, message, color: named.inactive };
                return svg(badge(data, { ...route.options, color: undefined }, named.inactive!), seconds.error);
            }
        }

        case 'icons': {
            const list = route.ids.map(findIcon).filter((icon): icon is Icon => Boolean(icon));
            if (!list.length) {
                return svg(renderBadge({ label: 'icons', message: 'none found', color: named.inactive!, theme: 'light', style: 'flat' }), seconds.error);
            }
            return svg(renderIconRow(list, route.theme, route.perLine), seconds.static);
        }

        case 'not-found': {
            const body = renderBadge({ label: '404', message: 'badge not found', color: named.inactive!, theme: 'light', style: 'flat' });
            return new Response(body, { status: 404, headers: { 'content-type': 'image/svg+xml; charset=utf-8', 'cache-control': 'public, max-age=300' } });
        }
    }
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
        }
        const cache = await caches.open('badges');
        const key = new Request(`${request.url}${request.url.includes('?') ? '&' : '?'}__v=${renderVersion}`);
        const hit = await cache.match(key);
        if (hit) return hit;

        const response = await handle(request, env);
        if (response.ok) ctx.waitUntil(cache.put(key, response.clone()));
        return response;
    },
} satisfies ExportedHandler<Env>;
