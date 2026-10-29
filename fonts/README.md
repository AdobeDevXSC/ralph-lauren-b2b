# Fonts

The boilerplate ships freely licensed stand-ins for the Ralph Lauren brand faces. They are self-hosted WOFF2 files (Latin subset) loaded by `styles/fonts.css`.

| Role | Ralph Lauren brand face (licensed) | Stand-in (SIL Open Font License) | Files |
|---|---|---|---|
| Headings | LeJeune Deck | Libre Caslon Text | `libre-caslon-text-regular.woff2`, `libre-caslon-text-italic.woff2` |
| Body | Founders Grotesk Text | Hanken Grotesk (variable, 300–600) | `hanken-grotesk-variable.woff2` |
| Labels, nav, buttons | Founders Grotesk Mono | DM Mono (300, 400, 500) | `dm-mono-light.woff2`, `dm-mono-regular.woff2`, `dm-mono-medium.woff2` |

## Swapping in the licensed brand faces

Only do this once Ralph Lauren has confirmed a web licence that covers self-hosting on Edge Delivery. Font changes are a boilerplate change: make them here and let microsites receive them through `git merge upstream/main`. Never swap fonts inside a single microsite.

1. Add the licensed WOFF2 files to this folder.
2. In `styles/fonts.css`, add `@font-face` rules for the new families (keep `font-display: swap` and a Latin `unicode-range`), and remove the stand-in rules.
3. In `styles/brand.css`, change `--heading-font-family`, `--body-font-family` and `--mono-font-family` to the new family names, keeping the fallback stacks.
4. Re-tune the fallback `size-adjust` values in `styles/styles.css` (`caslon-fallback`, `hanken-fallback`) so the swap does not shift layout.
5. Update the font names in `brand/rl/DESIGN.md` and `brand/rl/DESIGN.json`.
6. Check the header, hero and button metrics in the preview at 390px and 1440px; the stand-ins and brand faces have slightly different widths.
