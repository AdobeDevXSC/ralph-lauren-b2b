# Cobrand partner kit

This folder holds the partner side of a cobranded microsite. In the boilerplate it only contains templates.

| File | Purpose |
|---|---|
| `partner.example.json` | Template. Copy it to `partner.json` in a new microsite and fill it in. |
| `partner.json` | The partner record (name, programme, logos, accent colours, contrast checks, approvals). Microsites only. |
| `logos/` | Source logo files (SVG preferred). Upload production copies to Document Authoring and reference them from the nav and footer documents. |

How partner values reach the site:

1. Colours in `partner.json` are copied into `styles/cobrand.css` (`--cobrand-accent`, `--cobrand-accent-contrast`, `--cobrand-accent-soft`, `--cobrand-accent-on-image`).
2. The partner logo is added to the nav document (second paragraph of the logo section) and to a footer section starting with "In partnership with".
3. `stardust:direct` reads `partner.json` and `brand/rl/COBRAND-RULES.md` when setting the microsite direction.

Every colour pair must pass the contrast targets in `brand/rl/COBRAND-RULES.md` section 2.2; record the measured ratios under `contrastChecks`.
