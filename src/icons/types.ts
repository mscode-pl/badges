export interface PathIcon {
    title: string;
    hex: string;
    path: string;
}

export interface MonogramIcon {
    title: string;
    hex: string;
    monogram: string;
}

export type Icon = PathIcon | MonogramIcon;
