import { describe, expect, it } from 'vitest';
import { githubLicense, githubStars, githubWorkflow } from '../src/adapters/github';
import { npmDownloads, npmLicense, npmVersion } from '../src/adapters/npm';
import { packagistDownloads, packagistLicense, packagistVersion } from '../src/adapters/packagist';
import { compactNumber } from '../src/adapters/format';
import type { Context } from '../src/adapters/types';
import { codingTime, wakaTime, wakapiSource, wakatimeSource } from '../src/adapters/wakatime';
import { handle } from '../src/index';

function mock(routes: Record<string, unknown>, token?: string) {
    const calls: { url: string; headers: Record<string, string> }[] = [];
    const ctx: Context = {
        githubToken: token,
        fetch: async (url, init) => {
            calls.push({ url, headers: (init?.headers ?? {}) as Record<string, string> });
            if (!(url in routes)) return new Response('missing', { status: 404 });
            const body = routes[url];
            if (body instanceof Response) return body;
            return Response.json(body);
        },
    };
    return { ctx, calls };
}

describe('npm', () => {
    it('reads the latest version of a scoped package', async () => {
        const { ctx, calls } = mock({ 'https://registry.npmjs.org/@mscode-pl%2Femail-lint/latest': { version: '0.1.0', license: 'MIT' } });
        expect(await npmVersion(ctx, '@mscode-pl/email-lint')).toEqual({ label: 'npm', message: 'v0.1.0' });
        expect(await npmLicense(ctx, '@mscode-pl/email-lint')).toEqual({ label: 'license', message: 'MIT' });
        expect(calls[0]?.headers['user-agent']).toBe('mscode-badges');
    });

    it('formats monthly downloads', async () => {
        const { ctx } = mock({ 'https://api.npmjs.org/downloads/point/last-month/@mscode-pl/email-lint': { downloads: 12345 } });
        expect(await npmDownloads(ctx, '@mscode-pl/email-lint', 'month')).toEqual({ label: 'downloads', message: '12k/month' });
    });

    it('shows zero for a published package the downloads API does not know yet', async () => {
        const { ctx } = mock({ 'https://registry.npmjs.org/fresh/latest': { version: '0.1.0' } });
        expect((await npmDownloads(ctx, 'fresh', 'month')).message).toBe('0/month');
        await expect(npmDownloads(mock({}).ctx, 'typo', 'month')).rejects.toThrow('not found');
    });

    it('reads an object license field', async () => {
        const { ctx } = mock({ 'https://registry.npmjs.org/old/latest': { version: '1.0.0', license: { type: 'ISC' } } });
        expect((await npmLicense(ctx, 'old')).message).toBe('ISC');
    });
});

describe('packagist', () => {
    const p2 = {
        packages: {
            'mscode-pl/laravel-react-email': [
                { version: 'v2.0.0-beta.1', version_normalized: '2.0.0.0-beta1', license: ['MIT'] },
                { version: 'v1.4.0', version_normalized: '1.4.0.0' },
                { version: 'v1.3.0', version_normalized: '1.3.0.0' },
            ],
        },
    };
    const stats = { package: { downloads: { total: 48211, monthly: 3100, daily: 90 } } };
    const urls = {
        'https://repo.packagist.org/p2/mscode-pl/laravel-react-email.json': p2,
        'https://packagist.org/packages/mscode-pl/laravel-react-email.json': stats,
    };

    it('skips pre-releases for the version', async () => {
        const { ctx } = mock(urls);
        expect(await packagistVersion(ctx, 'mscode-pl', 'laravel-react-email')).toEqual({ label: 'packagist', message: 'v1.4.0' });
    });

    it('carries the license over from the minified newest entry', async () => {
        const { ctx } = mock(urls);
        expect((await packagistLicense(ctx, 'mscode-pl', 'laravel-react-email')).message).toBe('MIT');
    });

    it('formats total and monthly downloads', async () => {
        const { ctx } = mock(urls);
        expect((await packagistDownloads(ctx, 'mscode-pl', 'laravel-react-email', 'total')).message).toBe('48k');
        expect((await packagistDownloads(ctx, 'mscode-pl', 'laravel-react-email', 'monthly')).message).toBe('3.1k/month');
    });
});

describe('github', () => {
    const repo = { stargazers_count: 1520, license: { spdx_id: 'MIT', name: 'MIT License' } };

    it('reads stars and license, sending the token when set', async () => {
        const { ctx, calls } = mock({ 'https://api.github.com/repos/mscode-pl/email-lint': repo }, 'secret');
        expect(await githubStars(ctx, 'mscode-pl', 'email-lint')).toEqual({ label: 'stars', message: '1.5k' });
        expect(await githubLicense(ctx, 'mscode-pl', 'email-lint')).toEqual({ label: 'license', message: 'MIT' });
        expect(calls[0]?.headers.authorization).toBe('Bearer secret');
    });

    it('maps the last completed run of a workflow', async () => {
        const url = 'https://api.github.com/repos/mscode-pl/email-lint/actions/workflows/ci.yml/runs?status=completed&per_page=1&exclude_pull_requests=true&branch=master';
        const { ctx } = mock({ [url]: { workflow_runs: [{ conclusion: 'failure' }] } });
        expect(await githubWorkflow(ctx, 'mscode-pl', 'email-lint', 'ci.yml', 'master')).toEqual({ label: 'build', message: 'failing', color: '#c4343a' });
    });

    it('says when a workflow has no runs', async () => {
        const url = 'https://api.github.com/repos/o/r/actions/workflows/ci.yml/runs?status=completed&per_page=1&exclude_pull_requests=true';
        const { ctx } = mock({ [url]: { workflow_runs: [] } });
        expect((await githubWorkflow(ctx, 'o', 'r', 'ci.yml')).message).toBe('no runs');
    });
});

describe('handle', () => {
    const get = (path: string, routes: Record<string, unknown> = {}) =>
        handle(new Request(`https://badges.mscode.pl${path}`), {}, mock(routes).ctx.fetch);

    it('returns a cacheable SVG for a static badge', async () => {
        const res = await get('/badge/node/22+?color=339933');
        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')).toContain('image/svg+xml');
        expect(res.headers.get('cache-control')).toContain('max-age=3600');
        expect(await res.text()).toContain('aria-label="node: 22+"');
    });

    it('applies label and color overrides to live badges', async () => {
        const res = await get('/npm/v/pkg?label=version&color=green', { 'https://registry.npmjs.org/pkg/latest': { version: '2.0.0' } });
        const body = await res.text();
        expect(body).toContain('version: v2.0.0');
        expect(body).toContain('#1a7f45');
    });

    it('returns a grey "not found" badge with a short cache when upstream 404s', async () => {
        const res = await get('/npm/v/missing-package');
        expect(res.status).toBe(200);
        expect(res.headers.get('cache-control')).toContain('max-age=120');
        expect(await res.text()).toContain('npm: not found');
    });

    it('returns "unknown" when upstream fails', async () => {
        const res = await get('/github/stars/o/r', { 'https://api.github.com/repos/o/r': new Response('rate limited', { status: 403 }) });
        expect(await res.text()).toContain('stars: unknown');
    });

    it('answers unknown routes with a 404 badge', async () => {
        const res = await get('/whatever');
        expect(res.status).toBe(404);
        expect(await res.text()).toContain('badge not found');
    });

    it('serves icon rows', async () => {
        const res = await get('/icons?i=react,hono,inpost');
        expect(await res.text()).toContain('aria-label="React, Hono, InPost"');
    });
});

describe('compactNumber', () => {
    it('shortens large numbers', () => {
        expect([0, 999, 1000, 1540, 12345, 1_250_000, 3_000_000_000].map(compactNumber)).toEqual(['0', '999', '1k', '1.5k', '12k', '1.3M', '3B']);
    });
});

describe('wakatime and wakapi', () => {
    it('formats coding time', () => {
        expect(codingTime(59)).toBe('1 min');
        expect(codingTime(3 * 3600 + 5 * 60)).toBe('3 hrs 5 mins');
        expect(codingTime(1234 * 3600)).toBe('1,234 hrs');
    });

    it('reads all-time and ranged WakaTime stats', async () => {
        const { ctx } = mock({
            'https://wakatime.com/api/v1/users/mati/all_time_since_today': { data: { total_seconds: 500 * 3600 } },
            'https://wakatime.com/api/v1/users/mati/stats/last_7_days': {
                data: { total_seconds: 7200, languages: [{ name: 'TypeScript', total_seconds: 3600 }] },
            },
        });
        expect(await wakaTime(ctx, wakatimeSource, 'mati', 'all_time')).toEqual({ label: 'wakatime', message: '500 hrs' });
        expect(await wakaTime(ctx, wakatimeSource, 'mati', 'last_7_days')).toEqual({ label: 'wakatime', message: '2 hrs' });
        expect(await wakaTime(ctx, wakatimeSource, 'mati', 'last_7_days', 'typescript')).toEqual({ label: 'TypeScript', message: '1 hr' });
    });

    it('reads the public WakaTime badge for a user id', async () => {
        const id = 'b7065cab-63e5-400a-9acf-4689cff3cc57';
        const svg = '<svg><text x="1">wakatime</text><text x="2">3,496 hrs 21 mins</text></svg>';
        const { ctx } = mock({ [`https://wakatime.com/badge/user/${id}.svg`]: new Response(svg) });
        expect(await wakaTime(ctx, wakatimeSource, id, 'all_time')).toEqual({ label: 'wakatime', message: '3,496 hrs' });
    });

    it('talks to a Wakapi instance through its WakaTime API, mapping the year range', async () => {
        const source = wakapiSource('https://waka.example.com/sub/')!;
        const { ctx, calls } = mock({ 'https://waka.example.com/sub/api/compat/wakatime/v1/users/mati/stats/last_12_months': { data: { total_seconds: 60 } } });
        expect(await wakaTime(ctx, source, 'mati', 'last_year')).toEqual({ label: 'wakapi', message: '1 min' });
        expect(calls).toHaveLength(1);
        expect(wakapiSource(null)?.base).toBe('https://wakapi.dev/api/compat/wakatime/v1');
    });

    it('refuses Wakapi instances that are not public https hosts', () => {
        for (const bad of ['http://waka.example.com', 'localhost', '127.0.0.1', '10.0.0.2', 'waka.internal', 'https://a:b@waka.dev', 'waka.dev:8443']) {
            expect(wakapiSource(bad)).toBeUndefined();
        }
    });
});

describe('views', () => {
    function counter() {
        let count = 0;
        const stub = { fetch: async (_: string, init?: RequestInit) => { if (init?.method === 'POST') count++; return Response.json({ count }); } };
        return { idFromName: (name: string) => name, get: () => stub } as unknown as DurableObjectNamespace;
    }

    it('counts every view and is never cached', async () => {
        const env = { VIEWS: counter() };
        await handle(new Request('https://badges.mscode.pl/views/msikorski26'), env);
        const res = await handle(new Request('https://badges.mscode.pl/views/msikorski26?base=1000'), env);
        expect(await res.text()).toContain('<title>profile views: 1,002</title>');
        expect(res.headers.get('cache-control')).toContain('no-store');
    });

    it('rejects odd counter names', async () => {
        expect((await handle(new Request('https://badges.mscode.pl/views/..%2Fx'), { VIEWS: counter() })).status).toBe(404);
    });
});
