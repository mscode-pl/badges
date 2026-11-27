export interface PathIcon {
    title: string;
    hex: string;
    path: string;
}

export interface SvgIcon {
    title: string;
    hex: string;
    viewBox: string;
    body: string;
}

export type Icon = PathIcon | SvgIcon;
