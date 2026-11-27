import { named } from '../render/colors';
import { compactNumber } from './format';
import { getJson, UpstreamError, type BadgeData, type Context } from './types';

function api<T>(ctx: Context, path: string): Promise<T> {
    const headers: Record<string, string> = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' };
    if (ctx.githubToken) headers.authorization = `Bearer ${ctx.githubToken}`;
    return getJson<T>(ctx, `https://api.github.com${path}`, headers);
}

function repoPath(owner: string, repo: string): string {
    return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
}

interface Repo {
    stargazers_count: number;
    license: { spdx_id: string; name: string } | null;
}

export async function githubStars(ctx: Context, owner: string, repo: string): Promise<BadgeData> {
    const data = await api<Repo>(ctx, repoPath(owner, repo));
    return { label: 'stars', message: compactNumber(data.stargazers_count) };
}

export async function githubLicense(ctx: Context, owner: string, repo: string): Promise<BadgeData> {
    const data = await api<Repo>(ctx, repoPath(owner, repo));
    if (!data.license) throw new UpstreamError('no license');
    const id = data.license.spdx_id;
    return { label: 'license', message: id && id !== 'NOASSERTION' ? id : data.license.name };
}

const conclusions: Record<string, { message: string; color: string }> = {
    success: { message: 'passing', color: named.success! },
    failure: { message: 'failing', color: named.critical! },
    timed_out: { message: 'timed out', color: named.critical! },
    startup_failure: { message: 'failing', color: named.critical! },
    cancelled: { message: 'cancelled', color: named.inactive! },
    skipped: { message: 'skipped', color: named.inactive! },
    neutral: { message: 'neutral', color: named.inactive! },
    action_required: { message: 'action required', color: named.important! },
};

export async function githubWorkflow(ctx: Context, owner: string, repo: string, workflow: string, branch?: string): Promise<BadgeData> {
    const query = new URLSearchParams({ status: 'completed', per_page: '1', exclude_pull_requests: 'true' });
    if (branch) query.set('branch', branch);
    const data = await api<{ workflow_runs: { conclusion: string | null }[] }>(
        ctx,
        `${repoPath(owner, repo)}/actions/workflows/${encodeURIComponent(workflow)}/runs?${query}`,
    );
    const run = data.workflow_runs[0];
    if (!run) return { label: 'build', message: 'no runs', color: named.inactive };
    const state = conclusions[run.conclusion ?? ''] ?? { message: run.conclusion ?? 'unknown', color: named.inactive! };
    return { label: 'build', ...state };
}
