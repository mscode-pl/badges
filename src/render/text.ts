import type opentype from 'opentype.js';
import { fontStack, type Family } from './fonts';

interface Placed {
    font: opentype.Font;
    glyph: opentype.Glyph;
    x: number;
}

// Glyphs are placed one by one with kerning only: opentype.js throws on some GSUB lookups in these fonts.
// The latin files lack Polish and other extended letters, so each character goes to the first font that has it.
function layout(family: Family, str: string, size: number): { glyphs: Placed[]; width: number } {
    const stack = fontStack(family);
    const glyphs: Placed[] = [];
    let x = 0;
    let prev: Placed | undefined;
    for (const char of str) {
        const font = stack.find((f) => f.charToGlyphIndex(char) > 0) ?? stack[0]!;
        const glyph = font.charToGlyph(char);
        const scale = size / font.unitsPerEm;
        if (prev && prev.font === font) x += font.getKerningValue(prev.glyph, glyph) * scale;
        const placed = { font, glyph, x };
        glyphs.push(placed);
        x += (glyph.advanceWidth ?? font.unitsPerEm / 2) * scale;
        prev = placed;
    }
    return { glyphs, width: x };
}

export function measure(family: Family, str: string, size: number): number {
    return layout(family, str, size).width;
}

export function capHeight(family: Family, size: number): number {
    const font = fontStack(family)[0]!;
    return ((font.tables.os2?.sCapHeight ?? 700) / font.unitsPerEm) * size;
}

export function textPath(family: Family, str: string, size: number, x: number, y: number): string {
    return layout(family, str, size)
        .glyphs.map((g) => g.glyph.getPath(x + g.x, y, size).toPathData(2))
        .join('');
}
