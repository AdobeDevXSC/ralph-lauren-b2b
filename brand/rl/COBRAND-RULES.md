# Cobrand Rules: Ralph Lauren × B2B Partner

These rules decide what a cobranded microsite may change. They bind people, agents and every Stardust run (`stardust:direct`, `stardust:prototype`, `stardust:deploy`, `stardust:rollout`). If a design needs something this file does not allow, propose a change to the boilerplate instead of working around it in a microsite.

Freedom level: **guardrailed**. The Ralph Lauren core is locked; partner identity, accents, imagery, motion and page composition may vary.

## 1. Locked: the Ralph Lauren core

Never changed in a microsite, by hand or by an agent:

| Area | Locked value | Where it lives |
|---|---|---|
| Text colour | RL Navy `#031e3a` for all body text and headings on light grounds | `styles/brand.css` |
| Primary button | Navy fill, white mono label, square, 263px minimum, 112px rule beneath | `styles/styles.css` |
| Secondary and outline buttons | Navy text, square, existing underline and outline treatments | `styles/styles.css` |
| Inline links | Ledger Blue `#0068d6` | `styles/brand.css` |
| Typefaces | Heading serif, body sans, mono label (stand-ins or licensed brand faces) | `styles/fonts.css`, `fonts/` |
| Type scale and weights | Sizes per DESIGN.md; headings weight 400 | `styles/brand.css`, `styles/styles.css` |
| Layout | 1200px container, 790px reading measure, gutters, section spacing, breakpoints 600/900/1200 | `styles/brand.css` |
| Shape and depth | 0px radius, no shadows, no gradients, no glass | everywhere |
| Header and footer structure | Rows, order, typography and behaviour | `blocks/header/`, `blocks/footer/` |
| Core blocks | hero, teaser, quote, carousel, news-list, columns and the boilerplate blocks | `blocks/<name>/` |
| Ralph Lauren marks | Logos as supplied, never recoloured, cropped, outlined or merged | content |

## 2. Partner may set

### 2.1 Logo lockup
- **Header:** add the partner logo as a second paragraph in the nav's logo section (after the Ralph Lauren wordmark). The header renders `Ralph Lauren | partner` with a 1px divider. Ralph Lauren always comes first.
- **Footer:** add a footer section with the text `In partnership with` followed by the partner logo.
- **Logo files:** SVG preferred (PNG at 2× otherwise), on a transparent background, horizontal lockup, optically no taller than the Ralph Lauren wordmark.
- **Sizing:** only through `--cobrand-logo-height`, `--cobrand-logo-max-width` and `--cobrand-footer-logo-height` in `styles/cobrand.css`.
- **Clear space:** at least the height of the partner logo's cap height on every side; never place it closer to the Ralph Lauren wordmark than the divider gap.

### 2.2 Accent colours (`styles/cobrand.css`)
| Token | Use | Constraint |
|---|---|---|
| `--cobrand-accent` | Highlight bars, CTA rules on `cobrand` blocks, `cobrand-accent` section ground | Must reach 3:1 against white (UI marks). |
| `--cobrand-accent-contrast` | Text and buttons on a `cobrand-accent` section | Must reach 4.5:1 against `--cobrand-accent`. |
| `--cobrand-accent-soft` | `cobrand` section ground behind navy text | Navy text on it must reach 4.5:1. |
| `--cobrand-accent-on-image` | Accent marks over photography (hero, teaser) | Must reach 3:1 against the darkened image area it sits on. |
| `--cobrand-divider-color` | Header lockup divider | Quiet; default Rule Grey. |

- At most **two partner hues** in total (one accent plus its soft tint is the norm).
- Accent colour covers **at most about 10% of any screen**, except a `cobrand-accent` section band (no more than one per page).
- Accents never replace navy body text, the navy primary button on light grounds, or Ledger Blue inline links.
- Hex values only; no gradients, no transparency effects.

### 2.3 Imagery
- Partner and programme photography may replace sample imagery in any image slot.
- Follow the boilerplate's treatment: full-bleed, square crops, a darkening overlay under white type.
- Use approved, licensed assets uploaded to Document Authoring; never hotlink.

### 2.4 Motion
- A Stardust motion register may be applied (`--cinematic`), as long as it respects `prefers-reduced-motion` and never animates the logos or the primary button.

### 2.5 Composition
- Any page layout made from boilerplate blocks, the `cobrand` options on hero and teaser, and the `cobrand` / `cobrand-accent` section styles.
- New layouts become new blocks named `cb-<name>` (see section 4) and must use the locked tokens for type, colour and spacing.

## 3. Never

- Change, recolour or override anything in section 1, including from `styles/cobrand.css` or a `cb-*` block.
- Recolour the primary call to action with partner colours.
- Place the partner logo before or larger than the Ralph Lauren wordmark, or blend the two marks into a combined logo.
- Introduce a partner typeface. Partner wordmarks appear as images only.
- Use gradients, shadows, rounded corners or glass effects.
- Show partner prices, sales language, badges or promotional starbursts.
- Fabricate partner facts, statistics, testimonials or quotes.

## 4. Where partner work lives

| What | Where | Notes |
|---|---|---|
| Partner tokens | `styles/cobrand.css` | The only stylesheet a microsite edits. |
| Partner brand record | `brand/cobrand/partner.json` | Copied from `partner.example.json`; its presence marks the repo as a microsite. |
| Partner logo source files | `brand/cobrand/logos/` | Upload the production copies to Document Authoring and reference them from nav/footer. |
| New blocks | `blocks/cb-<name>/` | Prefixed so they never collide with upstream blocks. |
| Microsite design target | root `PRODUCT.md`, `DESIGN.md`, `DESIGN.json` | Written by `stardust:direct`; must comply with this file. |
| Stardust state | `stardust/` | Per microsite; never committed to the boilerplate. |

## 5. Guidance for `stardust:direct`

When directing a cobranded microsite:

1. Extract the microsite's own preview first (a fresh copy of the boilerplate). The captured Ralph Lauren surface is signal-strong, so brand-faithful mode (Mode A) pins palette and type to Ralph Lauren automatically.
2. Phrase the direction as brand-faithful with a **targeted palette move**: add one partner accent role, keep every Ralph Lauren pin. Example:

   > Cobranded microsite for <Partner> wholesale buyers. Brand-faithful to the Ralph Lauren standard (brand/rl/DESIGN.md); targeted palette move: add the partner accent <hex> as an accent role only, per brand/rl/COBRAND-RULES.md. Density balanced. IA reimagined around <programme goal>.

3. If Stardust reports a conflict between a request and a Mode A pin, the pin wins; resolve with option (c) "Mode A with a targeted palette move", never `--rebrand`.
4. Write partner accent values into `styles/cobrand.css`, not into DESIGN.md tokens for text or buttons.
5. Never pass `--rebrand` on a cobranded microsite.

### 5.1 Example directions

A brand site request always begins with example directions (see `AGENTS.md` § Brand site requests: examples first). Default: three homepage examples, requested from `stardust:direct` with "— 3 variants" and these roles:

| Example | Role | May differ in | Must stay identical |
|---|---|---|---|
| A · Flagship | Faithful to the standard; partner present but quiet | Partner lockup; `cobrand` option on hero and teaser | Everything in section 1 |
| B · Partner Spotlight | One captured Ralph Lauren trait amplified for the programme | Section order and composition, imagery, one `cobrand-accent` band | Everything in section 1 |
| C · Cinematic | Same structure as A with a motion register | Motion (reduced-motion safe; no animated logos or primary button) | Everything in section 1 |

Example phrase:

> Cobranded microsite for <Partner> wholesale buyers — 3 variants. Brand-faithful to the Ralph Lauren standard (brand/rl/DESIGN.md); targeted palette move: add the partner accent <hex> as an accent role only, per brand/rl/COBRAND-RULES.md. A = Flagship (faithful, partner quiet), B = Partner Spotlight (amplify full-bleed photography, programme-first IA, one accent band), C = Cinematic (A's structure with a motion register). Density balanced.

Before an example is shown, it must:
- pass `tools/cobrand-check/cobrand-check.js` at 1440px and 390px;
- pass Stardust's validation loop;
- differ from every other example in at least two substantive ways.

## 6. Review checklist (before publishing)

- [ ] Ralph Lauren wordmark first and unaltered in header and footer; partner logo sized through cobrand tokens.
- [ ] No file from section 1 changed (`git diff upstream/main -- styles/brand.css styles/styles.css styles/fonts.css fonts blocks/header blocks/footer` shows nothing).
- [ ] Every partner accent pair meets its contrast target (section 2.2).
- [ ] Body text and primary buttons are navy on every light ground.
- [ ] New blocks are prefixed `cb-` and use locked tokens.
- [ ] Imagery is approved, licensed and hosted in Document Authoring.
- [ ] `tools/cobrand-check/cobrand-check.js` passes on every page at 1440px and 390px.
- [ ] `stardust:qa` run on the preview with no open accessibility or contrast findings.
