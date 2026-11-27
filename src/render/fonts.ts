import opentype from 'opentype.js';
import jakarta500 from '../../fonts/plus-jakarta-sans-latin-500-normal.ttf';
import jakarta500Ext from '../../fonts/plus-jakarta-sans-latin-ext-500-normal.woff';
import jakarta800 from '../../fonts/plus-jakarta-sans-latin-800-normal.ttf';
import jakarta800Ext from '../../fonts/plus-jakarta-sans-latin-ext-800-normal.woff';
import mono400 from '../../fonts/jetbrains-mono-latin-400-normal.ttf';
import mono400Ext from '../../fonts/jetbrains-mono-latin-ext-400-normal.woff';

export type Family = 'body' | 'display' | 'mono';

const sources: Record<Family, ArrayBuffer[]> = {
    body: [jakarta500, jakarta500Ext],
    display: [jakarta800, jakarta800Ext],
    mono: [mono400, mono400Ext],
};

const parsed = new Map<Family, opentype.Font[]>();

export function fontStack(family: Family): opentype.Font[] {
    let stack = parsed.get(family);
    if (!stack) {
        stack = sources[family].map((data) => opentype.parse(data));
        parsed.set(family, stack);
    }
    return stack;
}

