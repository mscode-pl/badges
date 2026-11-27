export const categories: { name: string; ids: string[] }[] = [
    { name: 'Languages', ids: ['ts', 'js', 'php', 'py', 'go', 'rust', 'kotlin', 'swift', 'dart', 'bash', 'html', 'css', 'sass', 'graphql'] },
    { name: 'Frontend', ids: ['nextjs', 'react', 'vue', 'nuxt', 'svelte', 'angular', 'astro', 'vite', 'tailwind', 'redux', 'expo', 'flutter', 'electron', 'storybook'] },
    { name: 'Backend', ids: ['nodejs', 'bun', 'deno', 'hono', 'express', 'nestjs', 'laravel', 'django', 'fastapi'] },
    { name: 'Databases', ids: ['postgres', 'mysql', 'mariadb', 'sqlite', 'mongodb', 'redis', 'prisma', 'drizzle', 'supabase', 'firebase'] },
    {
        name: 'Cloud and DevOps',
        ids: ['docker', 'kubernetes', 'nginx', 'caddy', 'traefik', 'cloudflare', 'workers', 'vercel', 'netlify', 'githubactions', 'terraform', 'ansible', 'prometheus', 'grafana', 'sentry', 'linux', 'debian', 'ubuntu'],
    },
    {
        name: 'Tools and editors',
        ids: ['git', 'github', 'gitlab', 'vscode', 'webstorm', 'phpstorm', 'goland', 'pycharm', 'idea', 'jetbrains', 'figma', 'postman', 'npm', 'pnpm', 'yarn', 'composer', 'packagist', 'vitest', 'jest', 'eslint', 'prettier', 'notion', 'linear'],
    },
    { name: 'Commerce and payments', ids: ['stripe', 'przelewy24', 'inpost', 'shopify', 'woocommerce', 'medusa', 'wordpress', 'strapi'] },
    { name: 'AI', ids: ['claude', 'anthropic'] },
    { name: 'Social and contact', ids: ['web', 'email', 'gmail', 'chrome', 'discord', 'linkedin', 'x', 'instagram', 'facebook', 'youtube', 'tiktok'] },
];

export const keywords: Record<string, string> = {
    webstorm: 'jetbrains ide',
    phpstorm: 'jetbrains ide',
    goland: 'jetbrains ide',
    pycharm: 'jetbrains ide',
    idea: 'jetbrains ide intellij',
    vscode: 'ide editor microsoft',
    postgres: 'sql',
    mysql: 'sql',
    mariadb: 'sql',
    sqlite: 'sql',
    przelewy24: 'payments p24 blik',
    stripe: 'payments',
    inpost: 'shipping paczkomat',
    workers: 'cloudflare',
    githubactions: 'ci',
    nodejs: 'javascript runtime',
    bun: 'javascript runtime',
    deno: 'javascript runtime',
};

export const presets: { name: string; ids: string[] }[] = [
    { name: 'Frontend', ids: ['nextjs', 'react', 'ts', 'tailwind', 'vite'] },
    { name: 'Laravel', ids: ['laravel', 'php', 'mysql', 'redis', 'docker'] },
    { name: 'Cloudflare', ids: ['cloudflare', 'workers', 'hono', 'ts', 'githubactions'] },
    { name: 'JetBrains', ids: ['idea', 'webstorm', 'phpstorm', 'pycharm', 'goland'] },
];
