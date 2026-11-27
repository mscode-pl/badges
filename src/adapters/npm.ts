import { compactNumber, version } from './format';
import { getJson, UpstreamError, type BadgeData, type Context } from './types';

function encodePackage(name: string): string {
    return name.startsWith('@') ? `@${encodeURIComponent(name.slice(1))}` : encodeURIComponent(name);
}

interface Manifest {
    version: string;
    license?: string | { type?: string };
}

async function latest(ctx: Context, name: string): Promise<Manifest> {
    return getJson<Manifest>(ctx, `https://registry.npmjs.org/${encodePackage(name)}/latest`);
}

export async function npmVersion(ctx: Context, name: string): Promise<BadgeData> {
    const manifest = await latest(ctx, name);
    return { label: 'npm', message: version(manifest.version) };
}

export async function npmLicense(ctx: Context, name: string): Promise<BadgeData> {
    const { license } = await latest(ctx, name);
    const value = typeof license === 'string' ? license : license?.type;
    if (!value) throw new UpstreamError('no license field');
    return { label: 'license', message: value };
}

export async function npmDownloads(ctx: Context, name: string, period: 'month' | 'week' | 'year'): Promise<BadgeData> {
    let downloads: number;
    try {
        ({ downloads } = await getJson<{ downloads: number }>(ctx, `https://api.npmjs.org/downloads/point/last-${period}/${name}`));
    } catch (error) {
        // The downloads API answers 404 for packages it has no stats for yet, such as newly published ones.
        if (!(error instanceof UpstreamError && error.notFound)) throw error;
        await latest(ctx, name);
        downloads = 0;
    }
    return { label: 'downloads', message: `${compactNumber(downloads)}/${period}` };
}
