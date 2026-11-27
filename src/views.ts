// One Durable Object per counter name, so increments are exact and never race.
export class ViewCounter {
    constructor(private readonly state: DurableObjectState) {}

    async fetch(request: Request): Promise<Response> {
        const current = (await this.state.storage.get<number>('count')) ?? 0;
        if (request.method !== 'POST') return Response.json({ count: current });
        const next = current + 1;
        await this.state.storage.put('count', next);
        return Response.json({ count: next });
    }
}

export const viewName = /^[a-z0-9][a-z0-9._-]{0,63}$/i;
