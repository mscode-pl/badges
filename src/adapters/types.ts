export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

export interface Context {
    fetch: Fetcher;
    githubToken?: string;
}

export interface BadgeData {
    label: string;
    message: string;
    color?: string;
}

export class UpstreamError extends Error {
    constructor(
        message: string,
        readonly notFound = false,
    ) {
        super(message);
    }
}

export async function getJson<T>(ctx: Context, url: string, headers: Record<string, string> = {}): Promise<T> {
    const res = await ctx.fetch(url, {
        headers: { accept: 'application/json', 'user-agent': 'mscode-badges', ...headers },
        cf: { cacheTtl: 600, cacheEverything: true },
    } as RequestInit);
    if (res.status === 404) throw new UpstreamError(`not found: ${url}`, true);
    if (!res.ok) throw new UpstreamError(`${res.status} from ${url}`);
    return (await res.json()) as T;
}
