import { describe, expect, it } from 'vitest';
import { decodeSegment, parseRoute } from '../src/routes';

const route = (path: string) => parseRoute(new URL(`https://badges.mscode.pl${path}`));

describe('parseRoute', () => {
    it('serves the docs page at the root', () => {
        expect(route('/')).toEqual({ kind: 'docs' });
    });

    it('reads label and message for a static badge', () => {
        expect(route('/badge/node/22+')).toMatchObject({ kind: 'static', label: 'node', message: '22+', color: undefined });
    });

    it('reads an optional color segment and a .svg suffix', () => {
        expect(route('/badge/php/8.1_to_8.5/777BB4.svg')).toMatchObject({ label: 'php', message: '8.1 to 8.5', color: '777BB4' });
    });

    it('treats a single segment as a message without label', () => {
        expect(route('/badge/Discord')).toMatchObject({ kind: 'static', label: undefined, message: 'Discord' });
    });

    it('decodes percent escapes and Polish letters', () => {
        expect(route('/badge/Wyce%C5%84_projekt')).toMatchObject({ message: 'Wyceń projekt' });
    });

    it('reads the query options', () => {
        const r = route('/badge/a/b?theme=dark&style=for-the-badge&color=red&labelColor=111&logo=discord&label=x');
        expect(r).toMatchObject({ options: { theme: 'dark', style: 'button', color: 'red', labelColor: '111', icon: 'discord', label: 'x' } });
    });

    it('defaults to the light flat style', () => {
        expect(route('/badge/a/b')).toMatchObject({ options: { theme: 'light', style: 'flat' } });
    });

    it('accepts scoped npm packages', () => {
        expect(route('/npm/v/@mscode-pl/email-lint')).toMatchObject({ kind: 'live', fallbackLabel: 'npm' });
    });

    it('needs vendor and package for packagist', () => {
        expect(route('/packagist/v/mscode-pl/laravel-react-email')).toMatchObject({ kind: 'live' });
        expect(route('/packagist/v/mscode-pl')).toEqual({ kind: 'not-found' });
    });

    it('needs owner, repo and workflow for github actions', () => {
        expect(route('/github/actions/mscode-pl/email-lint/ci.yml?branch=master')).toMatchObject({ kind: 'live', fallbackLabel: 'build' });
        expect(route('/github/actions/mscode-pl/email-lint')).toEqual({ kind: 'not-found' });
    });

    it('parses icon lists, theme and per line count', () => {
        expect(route('/icons?i=react, ts,,hono&theme=light&perline=5')).toEqual({ kind: 'icons', ids: ['react', 'ts', 'hono'], theme: 'light', perLine: 5 });
        expect(route('/icons?i=react&perline=0')).toMatchObject({ theme: 'dark', perLine: 15 });
    });

    it('rejects unknown paths', () => {
        expect(route('/nope/v/x')).toEqual({ kind: 'not-found' });
        expect(route('/badge/a/b/c/d')).toEqual({ kind: 'not-found' });
    });
});

describe('decodeSegment', () => {
    it('turns underscores into spaces and keeps double underscores', () => {
        expect(decodeSegment('snake__case_name')).toBe('snake_case name');
    });
});
