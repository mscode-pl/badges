import type { Icon } from '../icons/types';
import { textOn } from './colors';
import type { Family } from './fonts';
import { drawIcon, escapeXml, n } from './svg';
import { capHeight, measure, textPath } from './text';

export type Theme = 'light' | 'dark';
export type Style = 'flat' | 'button';

export interface BadgeSpec {
    label?: string;
    message: string;
    color: string;
    labelColor?: string;
    theme: Theme;
    style: Style;
    icon?: Icon;
}

const grounds: Record<Theme, { bg: string; ink: string }> = {
    light: { bg: '#e8ebf0', ink: '#252c38' },
    dark: { bg: '#1b2638', ink: '#dfe6f0' },
};

const sizes: Record<Style, { height: number; radius: number; font: number; pad: number; icon: number; gap: number }> = {
    flat: { height: 20, radius: 5, font: 11, pad: 7, icon: 12, gap: 4 },
    button: { height: 32, radius: 8, font: 13, pad: 13, icon: 16, gap: 7 },
};

interface Segment {
    text: string;
    neutral: boolean;
    family: Family;
    bg: string;
    ink: string;
    width: number;
    icon?: Icon;
}

function segmentShape(x: number, w: number, h: number, r: number, left: boolean, right: boolean, fill: string): string {
    const lr = left ? r : 0;
    const rr = right ? r : 0;
    const d = `M${n(x + lr)} 0H${n(x + w - rr)}`
        + (rr ? `A${r} ${r} 0 0 1 ${n(x + w)} ${r}V${h - r}A${r} ${r} 0 0 1 ${n(x + w - r)} ${h}` : `V${h}`)
        + `H${n(x + lr)}`
        + (lr ? `A${r} ${r} 0 0 1 ${n(x)} ${h - r}V${r}A${r} ${r} 0 0 1 ${n(x + r)} 0` : `H${n(x)}V0`)
        + 'Z';
    return `<path fill="${fill}" d="${d}"/>`;
}

export function renderBadge(spec: BadgeSpec): string {
    const size = sizes[spec.style];
    const ground = grounds[spec.theme];
    const labelBg = spec.labelColor ?? ground.bg;
    const labelInk = spec.labelColor ? textOn(spec.labelColor) : ground.ink;

    const segments: Segment[] = [];
    if (spec.label) segments.push({ text: spec.label, neutral: !spec.labelColor, family: 'body', bg: labelBg, ink: labelInk, width: 0 });
    if (spec.message || !segments.length) {
        segments.push({ text: spec.message, neutral: false, family: 'display', bg: spec.color, ink: textOn(spec.color), width: 0 });
    }
    segments[0]!.icon = spec.icon;

    for (const s of segments) {
        const textWidth = s.text ? measure(s.family, s.text, size.font) : 0;
        const iconWidth = s.icon ? size.icon + (s.text ? size.gap : 0) : 0;
        s.width = Math.ceil(size.pad * 2 + iconWidth + textWidth);
    }

    const width = segments.reduce((w, s) => w + s.width, 0);
    const baseline = size.height / 2 + capHeight('body', size.font) / 2;
    const title = escapeXml(spec.label ? `${spec.label}: ${spec.message}` : spec.message);

    let x = 0;
    let body = '';
    segments.forEach((s, i) => {
        body += segmentShape(x, s.width, size.height, size.radius, i === 0, i === segments.length - 1, s.bg);
        let cx = x + size.pad;
        if (s.icon) {
            // On a coloured segment the mark takes the text colour, like a logo on a brand button.
            body += drawIcon(s.icon, cx, (size.height - size.icon) / 2, size.icon, { ground: s.bg, fill: s.neutral ? undefined : s.ink });
            cx += size.icon + size.gap;
        }
        if (s.text) body += `<path fill="${s.ink}" d="${textPath(s.family, s.text, size.font, cx, baseline)}"/>`;
        x += s.width;
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${size.height}" viewBox="0 0 ${width} ${size.height}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>`;
}
