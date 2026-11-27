export interface PathIcon {
    title: string;
    hex: string;
    path: string;
    box?: string;
    backing?: string;
    bold?: number;
}

export interface SvgIcon {
    title: string;
    hex: string;
    viewBox: string;
    body: string;
    mono?: string;
    // viewBox of `mono` when it comes from another source than `body`.
    monoBox?: string;
    // One-colour body whose fills are currentColor, for logos whose paths carry transforms.
    monoBody?: string;
    // The logo is itself a rounded square, so it fills the whole tile.
    full?: boolean;
    // Colour theme: tile fill (one colour or two for a gradient) and an optional mark in a 24 unit box.
    tile?: string;
    tileBody?: string;
}

export type Icon = PathIcon | SvgIcon;
