import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        {
            name: 'font-data',
            enforce: 'pre',
            load(id) {
                if (!/\.(ttf|woff)$/.test(id)) return null;
                const base64 = readFileSync(id).toString('base64');
                return `const b = Buffer.from(${JSON.stringify(base64)}, 'base64'); export default b.buffer.slice(b.byteOffset, b.byteOffset + b.length);`;
            },
        },
    ],
    test: { include: ['test/**/*.test.ts'] },
});
