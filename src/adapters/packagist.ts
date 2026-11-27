import { compactNumber, version } from './format';
import { getJson, UpstreamError, type BadgeData, type Context } from './types';

interface Release {
    version: string;
    version_normalized: string;
    license?: string[];
}

function packageName(vendor: string, name: string): string {
    return `${encodeURIComponent(vendor.toLowerCase())}/${encodeURIComponent(name.toLowerCase())}`;
}

async function latestRelease(ctx: Context, vendor: string, name: string): Promise<Release> {
    const id = packageName(vendor, name);
    const data = await getJson<{ packages: Record<string, Release[]> }>(ctx, `https://repo.packagist.org/p2/${id}.json`);
    const releases = data.packages[decodeURIComponent(id)] ?? [];
    // Releases come newest first; skip pre-releases unless nothing stable exists.
    const stable = releases.find((r) => !/-(alpha|beta|rc|dev|patch)/i.test(r.version_normalized));
    const release = stable ?? releases[0];
    if (!release) throw new UpstreamError('no releases');
    // The p2 format is minified: later entries omit fields that did not change, so license comes from the newest entry.
    return { ...release, license: release.license ?? releases[0]?.license };
}

export async function packagistVersion(ctx: Context, vendor: string, name: string): Promise<BadgeData> {
    const release = await latestRelease(ctx, vendor, name);
    return { label: 'packagist', message: version(release.version.replace(/^v/, '')) };
}

export async function packagistLicense(ctx: Context, vendor: string, name: string): Promise<BadgeData> {
    const release = await latestRelease(ctx, vendor, name);
    if (!release.license?.length) throw new UpstreamError('no license field');
    return { label: 'license', message: release.license.join(' or ') };
}

export async function packagistDownloads(ctx: Context, vendor: string, name: string, period: 'total' | 'monthly' | 'daily'): Promise<BadgeData> {
    const data = await getJson<{ package: { downloads: Record<string, number> } }>(
        ctx,
        `https://packagist.org/packages/${packageName(vendor, name)}.json`,
    );
    const count = data.package.downloads[period] ?? 0;
    const suffix = period === 'monthly' ? '/month' : period === 'daily' ? '/day' : '';
    return { label: 'downloads', message: `${compactNumber(count)}${suffix}` };
}
