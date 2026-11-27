export interface PathIcon {
    title: string;
    hex: string;
    path: string;
    box?: string;
    backing?: string;
}

export interface SvgIcon {
    title: string;
    hex: string;
    viewBox: string;
    body: string;
    mono?: string;
}

export type Icon = PathIcon | SvgIcon;
