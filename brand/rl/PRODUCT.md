# Product

<!-- impeccable:product-schema 1 -->
<!-- Ralph Lauren B2B Boilerplate: the shared product record every cobranded microsite starts from. A microsite's own root PRODUCT.md (written by stardust:direct) narrows this to one partner and one purpose; it may add, never contradict. -->

## Platform

web

## Users

- **Partner buyers and merchandisers** at wholesale and retail accounts who need Ralph Lauren assortments, launch information, assets and programme details.
- **Partner marketing and store teams** who need brand-approved imagery, copy and guidelines for the products they carry.
- **Ralph Lauren account and sales teams** who send partners to the microsite and need it to represent Ralph Lauren faithfully.

They arrive with a task (find a programme, download an asset, check a launch date), usually on a work laptop, sometimes on a phone in a store. They expect the polish of the Ralph Lauren brand and the clarity of a business tool.

## Product Purpose

A cobranded microsite gives one B2B partner a dedicated Ralph Lauren destination for a shared programme. The boilerplate supplies the Ralph Lauren design standard, header, footer and block library so each microsite starts on brand and only adds partner identity and content.

## Positioning

Ralph Lauren is the host brand and the partner is a guest of honour: every microsite reads unmistakably as Ralph Lauren, with the partner's identity present in the lockup, accents and imagery rather than in the structure or voice.

## Capabilities and Constraints

- Built on AEM Edge Delivery Services with content authored in Document Authoring; pages are composed from the boilerplate's block library.
- The Ralph Lauren core (tokens, fonts, core blocks, header, footer) is locked and updated only through the boilerplate (`git merge upstream/main`).
- Partner identity is limited to the cobrand layer: `styles/cobrand.css`, `brand/cobrand/`, `cb-*` blocks, and content.
- Performance target: Lighthouse 100 on the Edge Delivery preview.
- Fonts are freely licensed stand-ins until the licensed Ralph Lauren faces are added.

## Brand Commitments

- **Register:** brand (editorial, composed, premium), not product-dashboard.
- **Personality:** heritage, understated confidence, editorial calm, precision.
- **Anti-references:** discount-retail energy (badges, starbursts, red sale banners); generic SaaS layouts (gradient heroes, rounded cards, feature-icon grids); co-equal logo mashups where the two brands blend into a new mark.
- **Ralph Lauren always leads:** the Ralph Lauren wordmark comes first in every lockup; navy text and navy primary buttons on every page.

## Evidence on Hand

- Design tokens and components: `styles/brand.css`, `styles/styles.css`, `blocks/`.
- Design system: `brand/rl/DESIGN.md`, `brand/rl/DESIGN.json`.
- Cobrand guardrails: `brand/rl/COBRAND-RULES.md`.
- Block samples: the Document Authoring library (`library/blocks/*`).
- Imagery: Ralph Lauren corporate photography used in the samples is hotlinked from corporate.ralphlauren.com and must be replaced with approved assets before go-live.
- Absent and not to be fabricated: partner testimonials, pricing, stock data, product claims, partner statistics.

## Product Principles

- **Lead with Ralph Lauren.** The partner is welcomed inside the Ralph Lauren voice, never the other way round.
- **Change content, not the system.** New needs are met by composing existing blocks first, partner tokens second, new `cb-*` blocks last.
- **Make the task obvious.** Every page answers one partner question and ends in one clear call to action.
- **Stay upstream-compatible.** Anything that would fork the Ralph Lauren core goes back to the boilerplate as a proposal.

## Accessibility & Inclusion

- WCAG 2.1 AA: 4.5:1 contrast for text, 3:1 for large text and UI marks, including every partner accent pair.
- Proper heading order, alt text on all imagery, visible focus states, keyboard-operable navigation and carousels.
- Motion respects `prefers-reduced-motion`; background video never autoplays when reduced motion is requested and always has a pause control.
