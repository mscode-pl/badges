import { generatedIcons } from './generated';
import type { Icon } from './types';

const drawn: Record<string, Icon> = {
    web: {
        title: 'Website',
        hex: '#1a5bb5',
        path: 'M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm7.93 7h-3.4a18.7 18.7 0 0 0-1.6-4.57A10.03 10.03 0 0 1 19.93 7ZM12 2.04c.98 1.3 1.82 2.98 2.4 4.96H9.6c.58-1.98 1.42-3.66 2.4-4.96ZM2.25 14a10.1 10.1 0 0 1 0-4h3.9a20.5 20.5 0 0 0 0 4h-3.9Zm.82 2h3.4c.37 1.67.92 3.21 1.6 4.57A10.03 10.03 0 0 1 3.07 16Zm3.4-9h-3.4a10.03 10.03 0 0 1 5-4.57A18.7 18.7 0 0 0 6.47 7ZM12 21.96c-.98-1.3-1.82-2.98-2.4-4.96h4.8c-.58 1.98-1.42 3.66-2.4 4.96ZM14.84 15H9.16a18.4 18.4 0 0 1 0-6h5.68a18.4 18.4 0 0 1 0 6Zm.09 5.57A18.7 18.7 0 0 0 16.53 16h3.4a10.03 10.03 0 0 1-5 4.57ZM17.85 14a20.5 20.5 0 0 0 0-4h3.9a10.1 10.1 0 0 1 0 4h-3.9Z',
    },
    email: {
        title: 'E-mail',
        hex: '#1a5bb5',
        path: 'M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 3.4V18h20V7.4l-10 6.25L2 7.4ZM3.8 6 12 11.13 20.2 6H3.8Z',
    },
};

export const icons: Record<string, Icon> = { ...generatedIcons, ...drawn };

const aliases: Record<string, string> = {
    next: 'nextjs',
    typescript: 'ts',
    javascript: 'js',
    tailwindcss: 'tailwind',
    html5: 'html',
    css3: 'css',
    vuejs: 'vue',
    node: 'nodejs',
    python: 'py',
    golang: 'go',
    gnubash: 'bash',
    postgresql: 'postgres',
    k8s: 'kubernetes',
    traefikproxy: 'traefik',
    intellij: 'idea',
    intellijidea: 'idea',
    visualstudiocode: 'vscode',
    p24: 'przelewy24',
    googlechrome: 'chrome',
    website: 'web',
    mail: 'email',
    twitter: 'x',
    woo: 'woocommerce',
};

export function findIcon(id: string | null | undefined): Icon | undefined {
    if (!id) return undefined;
    const key = id.trim().toLowerCase();
    return icons[key] ?? icons[aliases[key] ?? ''];
}

export function aliasesOf(id: string): string[] {
    return Object.keys(aliases).filter((alias) => aliases[alias] === id);
}

export function iconIds(): string[] {
    return Object.keys(icons).sort();
}
