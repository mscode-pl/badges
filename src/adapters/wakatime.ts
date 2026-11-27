import { getJson, UpstreamError, type BadgeData, type Context } from './types';

const ranges: Record<string, string> = {
    '7d': 'last_7_days',
    '30d': 'last_30_days',
    '6m': 'last_6_months',
    '1y': 'last_year',
    all: 'all_time',
    last_7_days: 'last_7_days',
    last_30_days: 'last_30_days',
    last_6_months: 'last_6_months',
    last_year: 'last_year',
    all_time: 'all_time',
};

export function wakaRange(value: string | undefined): string | undefined {
    return value === undefined ? 'all_time' : ranges[value.toLowerCase()];
}

export function codingTime(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'}`;
    const hours = Math.floor(minutes / 60);
    if (hours >= 100) return `${hours.toLocaleString('en-US')} hrs`;
    const rest = minutes % 60;
    return `${hours} hr${hours === 1 ? '' : 's'}${rest ? ` ${rest} min${rest === 1 ? '' : 's'}` : ''}`;
}

// Wakapi speaks the WakaTime API under /api/compat/wakatime, so one loader serves both.
export interface WakaSource {
    label: string;
    base: string;
    yearRange: string;
}

export const wakatimeSource: WakaSource = { label: 'wakatime', base: 'https://wakatime.com/api/v1', yearRange: 'last_year' };

const blockedHosts = /(^|\.)(localhost|local|internal|lan|home|arpa)$/i;

// Self-hosted Wakapi: only public https hosts, never an address or an internal name.
export function wakapiSource(instance: string | null): WakaSource | undefined {
    const raw = instance?.trim() || 'wakapi.dev';
    let url: URL;
    try {
        url = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
    } catch {
        return undefined;
    }
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return undefined;
    const host = url.hostname.toLowerCase();
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(host) || blockedHosts.test(host)) return undefined;
    const path = url.pathname.replace(/\/+$/, '');
    return { label: 'wakapi', base: `https://${host}${path}/api/compat/wakatime/v1`, yearRange: 'last_12_months' };
}

interface Stats {
    data: {
        total_seconds?: number;
        total_seconds_including_other_language?: number;
        languages?: { name: string; total_seconds: number }[];
    };
}

interface AllTime {
    data: { total_seconds: number };
}

export async function wakaTime(ctx: Context, source: WakaSource, user: string, range: string, language?: string): Promise<BadgeData> {
    const userPath = `${source.base}/users/${encodeURIComponent(user)}`;
    if (!language && range === 'all_time') {
        const all = await getJson<AllTime>(ctx, `${userPath}/all_time_since_today`);
        return { label: source.label, message: codingTime(all.data.total_seconds) };
    }
    const apiRange = range === 'last_year' ? source.yearRange : range;
    const stats = await getJson<Stats>(ctx, `${userPath}/stats/${apiRange}`);
    if (language) {
        const wanted = language.toLowerCase();
        const entry = stats.data.languages?.find((l) => l.name.toLowerCase() === wanted);
        if (!entry) throw new UpstreamError(`no ${language} time`, true);
        return { label: entry.name, message: codingTime(entry.total_seconds) };
    }
    const seconds = stats.data.total_seconds_including_other_language ?? stats.data.total_seconds;
    if (seconds === undefined) throw new UpstreamError('stats not public');
    return { label: source.label, message: codingTime(seconds) };
}
