<p align="center">
  <a href="https://badges.mscode.pl"><img src="https://badges.mscode.pl/badge/MSCode/badges?style=button&labelColor=040d1a" alt="MSCode badges"></a>
</p>

<p align="center">
  <a href="https://github.com/mscode-pl/badges/actions/workflows/ci.yml"><img src="https://badges.mscode.pl/github/actions/mscode-pl/badges/ci.yml?branch=master&label=tests" alt="Tests"></a>
  <img src="https://badges.mscode.pl/badge/cloudflare/workers/F38020?icon=cloudflare" alt="Cloudflare Workers">
  <a href="LICENSE"><img src="https://badges.mscode.pl/badge/license/MIT" alt="License MIT"></a>
</p>

<p align="center">
  Badges and tech icon rows for READMEs, in light and dark. Static badges from the URL, live npm, Packagist and GitHub badges, larger buttons for profile links, and one consistent icon set that also covers Hono, Caddy, Traefik, GoLand, Stripe, Strapi, Przelewy24 and InPost. Text is drawn as vector paths, so every badge looks the same with or without the fonts installed. Free to use, no sign-up.
</p>

<p align="center">
  <a href="#badges">Badges</a> · <a href="#icons">Icons</a> · <a href="#options">Options</a> · <a href="#run-it-yourself">Run it yourself</a>
</p>

## Badges

The docs page at [badges.mscode.pl](https://badges.mscode.pl) lists every badge with Markdown to copy.

| Badge | URL |
|---|---|
| Static | `/badge/<label>/<message>/<color>`, e.g. `/badge/node/22+/339933` |
| npm version, downloads, license | `/npm/v/<package>`, `/npm/dm/<package>` (also `dw`, `dy`), `/npm/l/<package>` |
| Packagist version, downloads, license | `/packagist/v/<vendor>/<package>`, `/packagist/dt/...` (also `dm`, `dd`), `/packagist/l/...` |
| GitHub Actions | `/github/actions/<owner>/<repo>/<workflow file>?branch=master` |
| GitHub stars, license | `/github/stars/<owner>/<repo>`, `/github/license/<owner>/<repo>` |

In static badges `_` is a space and `__` an underscore. When an upstream API fails, the badge says `unknown` instead of breaking the image.

## Icons

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://badges.mscode.pl/icons?i=react,ts,hono&theme=dark">
  <img src="https://badges.mscode.pl/icons?i=react,ts,hono&theme=light" alt="React, TypeScript, Hono" height="40">
</picture>
```

Ids follow skillicons (`ts`, `py`, `postgres`, `idea`) and accept Simple Icons slugs as aliases. `perline=` wraps the row, 15 by default.

## Options

| Query | Effect |
|---|---|
| `theme` | `light` (default for badges) or `dark` (default for icons) |
| `style` | `flat` (default) or `button`; `for-the-badge` works too |
| `color`, `labelColor` | Hex without `#`, or a name such as `blue`, `green`, `red`, `orange`, `gray` |
| `label` | Replaces the label; `label=` drops it |
| `icon` | An icon id; `logo` works too |

## Run it yourself

```bash
pnpm install
pnpm dev        # http://localhost:8787
pnpm test
pnpm deploy     # needs a Cloudflare account
```

Set `GITHUB_TOKEN` with `wrangler secret put GITHUB_TOKEN` to lift the GitHub API rate limit. A token with no scopes is enough for public repositories.

To add icons, edit the list in `scripts/build-icons.mjs` and run `pnpm icons`.

## Credits

Fonts: [Plus Jakarta Sans](https://github.com/tokotype/PlusJakartaSans) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), SIL Open Font License, copies in `fonts/`. Brand icons: [Simple Icons](https://simpleicons.org), CC0. Logos remain trademarks of their owners.

---

<p align="center">
  <a href="https://mscode.pl">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/mscode-logo-white.svg">
      <img src=".github/mscode-logo-black.svg" alt="MSCode" height="28">
    </picture>
  </a>
</p>

<p align="center">
  Built and maintained by <a href="https://mscode.pl">MSCode</a>, a Polish software house that makes websites and web and mobile apps.
</p>

<p align="center">
  <a href="https://mscode.pl">mscode.pl</a> · <a href="https://github.com/mscode-pl">More packages</a> · <a href="https://github.com/mscode-pl/badges/issues">Report an issue</a>
</p>
