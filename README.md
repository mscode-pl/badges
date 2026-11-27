# MSCode badges

Status: planned, not started.

Badges and tech icons in the MSCode style, to replace shields.io and skillicons.dev in our READMEs and the organization profile. Public, so anyone can use them.

## TODO

- [ ] Visual style: MSCode blue `#1A5BB5`, Plus Jakarta Sans and JetBrains Mono, light and dark variants
- [ ] Static badges from a URL, e.g. `/badge/node/22+`
- [ ] Live badges: npm version and downloads, Packagist version and downloads, GitHub Actions status, GitHub stars, license
- [ ] Tech icons in one set, including the ones skillicons lacks (Hono, Caddy, Traefik, GoLand, Stripe, Strapi, Przelewy24, InPost)
- [ ] Text rendered as paths so badges look the same without the fonts installed
- [ ] Caching, so READMEs do not hit the npm and GitHub APIs on every view
- [ ] Hosting and domain, e.g. a Cloudflare Worker on `badges.mscode.pl`
- [ ] Swap the badges in email-lint, laravel-react-email and the `mscode-pl/.github` profile

## License

MIT
