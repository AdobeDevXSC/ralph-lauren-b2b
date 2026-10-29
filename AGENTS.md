# AGENTS.md

This repository is the **Ralph Lauren B2B Boilerplate**: the single source of the Ralph Lauren design standard for cobranded B2B microsites, built on Edge Delivery Services in Adobe Experience Manager Sites as a Cloud Service. Teams create a Ralph Lauren × partner microsite by using this repo as a template and then running the Stardust skills to design the cobranded site within the Ralph Lauren guardrails. As an agent, follow this file to keep every site on brand and to deliver code that meets Adobe's standards for fast, easy-to-author, maintainable web experiences.

## Read this first

1. **Find out which repo you are in** (§ Boilerplate or microsite?). The rules differ.
2. **The Ralph Lauren standard is locked.** Read `brand/rl/DESIGN.md` and `brand/rl/COBRAND-RULES.md` before any design or styling work. Never edit the protected files (§ Protected files) in a microsite.
3. **Partner work goes only in the partner layer**: `styles/cobrand.css`, `brand/cobrand/`, `blocks/cb-*`, content, and the microsite's own Stardust output.
4. **Remote changes need an explicit request.** Never write to Document Authoring, preview, publish, push or open pull requests unless the user explicitly asks for it in their message.
5. **Brand sites start with examples.** When someone asks for a brand site, build a few example directions within the guidelines, check them, and show them to the user before building anything else (§ Brand site requests: examples first).

## Boilerplate or microsite?

| Signal | Boilerplate | Cobranded microsite |
|---|---|---|
| `git remote -v` | `origin` is `AdobeDevXSC/ralph-lauren-b2b` | `upstream` is `AdobeDevXSC/ralph-lauren-b2b`, `origin` is the microsite repo |
| `brand/cobrand/partner.json` | absent (only `partner.example.json`) | present |
| Root `PRODUCT.md` / `DESIGN.md` / `DESIGN.json` | absent | written by `stardust:direct` |
| `stardust/state.json` | absent | present once Stardust has run |

**In the boilerplate** you may change the Ralph Lauren core, but every change ships to all microsites on their next upstream merge. Keep changes backwards compatible: keep block content models, class names and CSS variable names stable, and update `brand/rl/*` whenever tokens or components change. Never add partner-specific content or tokens here.

**In a microsite** treat the core as read-only. If the design needs something the core cannot do, compose existing blocks first, use the partner tokens second, add a `cb-*` block last, and propose a boilerplate change for anything that should be shared.

## Protected files (Ralph Lauren core)

Never modified in a microsite, by hand or by an agent. Changes are made in the boilerplate and arrive through `git merge upstream/main`.

- `styles/brand.css`, `styles/styles.css`, `styles/fonts.css`, `styles/lazy-styles.css`, `fonts/`
- `blocks/` except `blocks/cb-*`. Core blocks are header, footer, hero, teaser, quote, carousel, news-list, columns, library-metadata and the other boilerplate blocks.
- `scripts/` (and never `scripts/aem.js` anywhere)
- `head.html`, `404.html`
- `brand/rl/` (`DESIGN.md`, `DESIGN.json`, `PRODUCT.md`, `COBRAND-RULES.md`)
- `tools/`, `docs/`

Partner layer (microsite-owned): `styles/cobrand.css`, `brand/cobrand/partner.json`, `brand/cobrand/logos/`, `blocks/cb-*`, root `PRODUCT.md` / `DESIGN.md` / `DESIGN.json`, `stardust/`, `fstab.yaml`, and all content.

## Design standard

- **Design system:** `brand/rl/DESIGN.md` (tokens and prose) and `brand/rl/DESIGN.json` (sidecar: colour meta, components, cobrand tokens, Stardust token aliases).
- **Product record:** `brand/rl/PRODUCT.md` (users, purpose, brand commitments).
- **Cobrand guardrails:** `brand/rl/COBRAND-RULES.md`. This is binding: what is locked, what a partner may set, and what is never allowed.
- **Tokens in code:**
  - `styles/brand.css` holds the Ralph Lauren tokens plus the Stardust token-contract aliases (`--heading-*`, `--body`, `--color-*`, `--spacing-*`, `--section-padding`, `--max-width`, `--radius`).
  - `styles/cobrand.css` holds the partner tokens (`--cobrand-*`), with neutral defaults in the boilerplate.
- **Cobrand hooks already in the core:**
  - Header partner lockup: a second logo paragraph in the nav document's logo section.
  - Footer "In partnership with" section.
  - `cobrand` option on hero and teaser.
  - `cobrand` and `cobrand-accent` section styles.
- **Fonts:** freely licensed stand-ins for the Ralph Lauren faces; see `fonts/README.md`.

If `styles/brand.css` and `brand/rl/DESIGN.md` disagree, the CSS is the truth and the doc must be updated (boilerplate only).

## Brand site requests: examples first

Requests like "create a brand site for <partner>", "build a cobranded microsite", "design a site for our <programme> with <partner>" or "show me what a <partner> site could look like" always start with **example directions**. Never jump straight to a single design, and never build blocks or touch Document Authoring before the user has picked one.

### 1. Gather the brief (at most two questions)
- Required: partner name, programme or purpose, audience, and the partner brand source (website URL or brand kit).
- Ask only for what is missing, in at most two questions.
- If the user wants examples before giving the partner's details, use the placeholder "Partner" with the neutral accent from `brand/cobrand/partner.example.json`, and say so.
- Never invent partner facts, statistics, quotes or claims; examples use the boilerplate starter copy and the brief.

### 2. Decide where the examples are built
- **In a microsite repo:** build them in place (`stardust/`).
- **In the boilerplate:** never write microsite artifacts to the boilerplate's `main`. Build the examples in a scratch worktree (`git worktree add ../examples-<partner> -b examples/<partner>`) and tell the user they are throwaway until a microsite repo exists.

### 3. Build three example directions of the homepage
Default to three examples of the homepage. The user can ask for a different number or for other pages. Every example obeys `brand/rl/COBRAND-RULES.md` (Ralph Lauren type, navy, buttons, layout and lockup order are identical in all of them); they differ only in what the rules leave free.

| Example | Role | What changes | How |
|---|---|---|---|
| **A · Flagship** | Faithful to the Ralph Lauren standard; partner present but quiet | Partner lockup, `cobrand` option on hero and teaser, accent only in bars and rules | Variant A (strict Mode A) |
| **B · Partner Spotlight** | Leans into one captured Ralph Lauren trait in service of the programme, e.g. full-bleed photography or a programme-first page order | Different section order and composition, one `cobrand-accent` band, partner imagery up front | Variant B (one captured trait amplified) |
| **C · Cinematic** | Same structure as A, with motion as part of the identity | A Stardust motion register; respects reduced motion; never animates logos or the primary button | Variant C, prototyped with `--cinematic` |

How to produce them:
1. `stardust:extract <microsite or worktree preview URL>` (if not already extracted).
2. `stardust:direct "<brief phrase> — 3 variants"`. Phrase it as in COBRAND-RULES § 5, and name the roles above so B and C get distinct jobs. This writes `PRODUCT.md` plus `DESIGN-A`, `DESIGN-B` and `DESIGN-C` `.md`/`.json`.
3. `stardust:prototype` for the homepage, with `--cinematic` for C. This writes `stardust/prototypes/<slug>-A-proposed.html` and the B and C equivalents.

If Stardust reports too little brand signal for three distinct directions, build two strong ones rather than three weak ones and say why.

### 4. Check every example before showing it
- Run `tools/cobrand-check/cobrand-check.js` on each prototype at **1440px and 390px** (recipe in `tools/cobrand-check/README.md`), plus Stardust's own validation loop.
- Fix and re-check until `passed: true`. Never present an example that fails. If a finding is accepted as an exception, name it in the presentation.
- Save a desktop and a mobile screenshot per example to `stardust/validation/<slug>-<A|B|C>/`.

### 5. Show the examples together
In one message, for each example give:
- its name and a one-line pitch;
- what partner elements it uses (lockup, accent placements, imagery, motion);
- the check result at both widths;
- the desktop and mobile screenshots;
- the file to open.

Then ask the user to choose with the question tool: A, B or C, a mix (e.g. "A with B's page order"), or another round of changes. Keep the message short; the examples are on disk.

### 6. After the choice
- Approve the chosen example through `stardust:prototype`'s approval flow; its direction becomes the microsite's root `DESIGN.md` / `DESIGN.json`. Keep the other examples on disk for reference.
- Record the choice and the reason in `stardust/direction.md`.
- Only now continue with the remaining pages and the build (§ Creating a cobranded microsite, steps 6–9).
- Changes requested on an example are made in that example and re-checked before it is shown again.

## Creating a cobranded microsite

The full human checklist is `docs/NEW-MICROSITE.md`. The agent workflow:

### Prerequisites
- Stardust and impeccable add-ons enabled (`.agents/settings.json`: `stardust@excat-extended`; impeccable is a Stardust dependency).
- The microsite repo created from this template, with `upstream` set and Code Sync installed.
- Its Document Authoring site created, `fstab.yaml` pointing at it, and the starter content copied with `tools/new-microsite/copy-starter-content.mjs`. That script only runs when the user asks; it previews by default and needs `--apply` to write.
- The microsite preview (`https://main--<site>--<org>.aem.page/`) shows the Ralph Lauren starter site.

### Steps

| # | Step | Skill / action | Writes | Gate |
|---|---|---|---|---|
| 1 | Record the partner | Copy `brand/cobrand/partner.example.json` to `partner.json`, add logos to `brand/cobrand/logos/` | `brand/cobrand/` | Partner name, programme and audience confirmed by the user |
| 2 | Capture the partner brand | **Partner URL:** run `stardust:extract <partner-url> --single` in a scratch git worktree (`git worktree add ../<site>-partner-capture`), copy logo, palette and type facts from its `stardust/current/_brand-extraction.json` into `partner.json`, then remove the worktree. **Brand kit:** enter the supplied values. | `brand/cobrand/partner.json` | Never run the partner extract in the microsite's own `stardust/` (it would make the partner the primary origin) |
| 3 | Set partner tokens and lockup | Choose `accent`, `accentContrast`, `accentSoft`, `accentOnImage`, measure contrast, write `styles/cobrand.css`. Add the partner logo to the nav and footer documents (only when the user asks to change Document Authoring). | `styles/cobrand.css`, content | Every pair meets COBRAND-RULES § 2.2 |
| 4 | Capture the Ralph Lauren standard | `stardust:extract <microsite preview URL>` | `stardust/current/`, `stardust/state.json` | Brand signal must be `signal-strong` so Mode A pins Ralph Lauren palette and type |
| 5 | Build example directions | `stardust:direct "<phrase> — 3 variants"`, phrased as in COBRAND-RULES § 5 (brand-faithful Mode A plus a targeted palette move for the partner accent; never `--rebrand`), then `stardust:prototype` for the homepage (C with `--cinematic`). Full procedure in § Brand site requests: examples first. | root `PRODUCT.md`, `DESIGN-{A,B,C}.{md,json}`, `stardust/prototypes/`, `stardust/direction.md` | Every example passes `tools/cobrand-check` at 1440 and 390; the user picks one |
| 6 | Prototype the remaining pages | Approve the chosen example (it becomes `DESIGN.md` / `DESIGN.json`), then `stardust:prototype` the other key pages in that direction | `stardust/prototypes/` | User approves each page; critique, validation and `tools/cobrand-check` pass |
| 7 | Build | `stardust:deploy` (one page) or `stardust:rollout` (all pages) into Edge Delivery blocks and Document Authoring content | `blocks/cb-*`, content | Reuse core blocks where a section matches one. Name new blocks `cb-<name>`. Put partner values only in `styles/cobrand.css`. Never edit protected files. Document Authoring writes only on explicit request. |
| 8 | Verify | `stardust:diff` (build vs prototype), `stardust:qa <preview URL>`, and `tools/cobrand-check` on every built page | `stardust/` reports | No open fidelity, accessibility, contrast or guideline findings |
| 9 | Review and ship | COBRAND-RULES § 6 checklist, `npm run lint`, pull request with the preview link, PageSpeed check, merge, publish | | Ralph Lauren and partner brand sign-off recorded in `partner.json` |

Other Stardust skills that fit this project:
- `stardust:uplift <url>`: a quick three-variant concept for presales, before committing to a microsite.
- `stardust:audit <url>`: an assessment of a partner's existing site.
- Hands-off mode (`--hands-off`) is acceptable for steps 4–8 only when the user asks for it. The quality gates still apply.

This is the Stardust **redesign** flow. Never use `stardust:replica`, `stardust:reskin` or `stardust:prepare-migration` for a cobranded microsite unless the user asks for that flow explicitly.

### Naming rules (microsites)
- New blocks: `blocks/cb-<name>/cb-<name>.{js,css}`, scoped to the block, using the Ralph Lauren tokens (`var(--heading-font-family)`, `var(--rl-navy)`, `var(--section-spacing)`, …) and the partner tokens (`var(--cobrand-*)`), never hard-coded colours or fonts.
- Partner assets: `brand/cobrand/logos/` (source); production copies are uploaded to Document Authoring.
- Section styles for partner colour: `cobrand` (soft ground) and `cobrand-accent` (accent band, at most one per page).

## Getting boilerplate updates (microsites)

```bash
git fetch upstream
git merge upstream/main
```

- Conflict in a protected file: take the upstream version (`git checkout --theirs <file>`).
- Conflict in a partner file: keep the microsite version (`git checkout --ours <file>`).
- After merging, run `npm run lint`, check the preview at 390px and 1440px, and commit the merge on a branch with a pull request.

## Project Overview

This project is based on the https://github.com/adobe/aem-boilerplate/ project. Follow the coding style and practices established in the boilerplate, and add functionality according to the needs of the site.

The repository provides the basic structure, blocks, and configuration needed to run a complete site with `*.aem.live` as the backend. Content is authored in Document Authoring (`adobedevxsc/ralph-lauren-b2b` for the boilerplate).

### Key Technologies
- Edge Delivery Services for AEM Sites (documentation at https://www.aem.live/; search with `site:www.aem.live` to restrict web search results)
- Vanilla JavaScript (ES6+), no transpiling, no build steps
- CSS3 with modern features, no Tailwind or other CSS frameworks
- HTML5 semantic markup generated by the aem.live backend, decorated by our code
- Node.js tooling

## Setup Commands

- Install dependencies: `npm install`
- Start local development: `npx -y @adobe/aem-cli up --no-open --forward-browser-logs` (run in background, if possible)
  - Install the AEM CLI globally by running `npm install -g @adobe/aem-cli` then `aem up` is equivalent to the command above
  - The dev server runs at `http://localhost:3000` with auto-reload. Open it in playwright, puppeteer, or a browser. If none are available, ask the human to open it and give feedback.
- Run linting before committing: `npm run lint`
- Auto-Fix linting issues: `npm run lint:fix`

## Project Structure

```
├── blocks/          # Reusable content blocks (core; microsites add blocks/cb-*)
    └── {blockname}/   - Individual block directory
        ├── {blockname}.js      # Block's JavaScript
        ├── {blockname}.css     # Block's styles
        ├── metadata.json       # Block metadata for the block library (options, content model)
        └── README.md           # Authoring notes
├── brand/
    ├── rl/          # Ralph Lauren standard: DESIGN.md, DESIGN.json, PRODUCT.md, COBRAND-RULES.md (locked)
    └── cobrand/     # Partner kit: partner.example.json (template), partner.json + logos/ (microsites)
├── docs/            # NEW-MICROSITE.md checklist
├── tools/
    ├── new-microsite/   # copy-starter-content.mjs (Document Authoring starter copy)
    └── cobrand-check/   # cobrand-check.js (guideline check for examples and pages)
├── styles/          # Global styles and CSS
    ├── brand.css           # Ralph Lauren tokens + Stardust token aliases (locked)
    ├── cobrand.css         # Partner tokens (the only stylesheet a microsite edits)
    ├── styles.css          # Global styling, buttons, section styles; required for LCP
    ├── lazy-styles.css     # Additional global styling for below the fold/post LCP content
    └── fonts.css           # Font definitions
├── scripts/         # JavaScript libraries and utilities
    ├── aem.js           # Core AEM Library for Edge Delivery page decoration logic (NEVER MODIFY THIS FILE)
    ├── scripts.js       # Global JavaScript utilities, main entry point for page decoration
    └── delayed.js       # Delayed functionality such as martech loading
├── fonts/           # Web fonts (stand-ins; see fonts/README.md)
├── icons/           # SVG icons
├── stardust/        # Stardust state (microsites only; not served)
├── head.html        # Global HTML head content
└── 404.html         # Custom 404 page
```

`brand/`, `docs/`, `tools/` and `stardust/` are listed in `.hlxignore` and are never served.

## Code Style Guidelines

### JavaScript
- Use ES6+ features (arrow functions, destructuring, etc.)
- Follow Airbnb ESLint rules (already configured)
- Always include `.js` file extensions in imports
- Use Unix line endings (LF)

### CSS
- Follow Stylelint standard configuration
- Use modern CSS features (CSS Grid, Flexbox, CSS Custom Properties)
- Use the design tokens from `styles/brand.css` and `styles/cobrand.css`; never hard-code brand colours or font stacks in blocks
- Maintain responsive design principles
  - Declare styles mobile first, use `min-width` media queries at 600px/900px/1200px for tablet and desktop
- Ensure all selectors are scoped to the block.
  - Bad: `.item-list`
  - Good: `.{blockname} .item-list`
- Avoid classes `{blockname}-container` and `{blockname}-wrapper` as those are used on sections and could be confusing.

### HTML
- Use semantic HTML5 elements
- Ensure accessibility standards (ARIA labels, proper heading hierarchy)
- Follow AEM markup conventions for blocks and sections

## Key Concepts

### Content

CMS authored content is a key part of every AEM Website. The content of a page is broken into sections. Sections can have default content (text, headings, links, etc.) as well as content in blocks. Section styles available in this project: `center`, `narrow`, `light`, `dark`, `black`, `cobrand`, `cobrand-accent`.

If no authored content exists to test against, you can create static HTML files in a `drafts/` folder at the project root. Pass `--html-folder drafts` when starting the dev server. Follow the aem markup structure and save files with `.html` or `.plain.html` extensions.

Background on content and markup structure can be found at https://www.aem.live/developer/markup-sections-blocks and https://www.aem.live/developer/markup-reference respectively.

You can inspect the contents of any page with `curl http://localhost:3000/path/to/page`, `curl http://localhost:3000/path/to/page.md`, and `curl http://localhost:3000/path/to/page.plain.html`

### Blocks

Blocks are the re-usable building blocks of AEM. Blocks add styling and functionality to content. Each block has an initial content structure it expects, and transforms the html in the block using DOM APIs to render a final structure.

The initial content structure is important because it impacts how the author will create the content and how you will write your code to decorate it. In some sense, you can think of this structure as the contract for your block between the author and the developer. You should decide on this initial structure before writing any code, and be careful when making changes to code that makes assumptions about that structure as it could break existing pages. In the boilerplate this matters twice: every microsite's content depends on these contracts.

The block javascript should export a default function which is called to perform the block decoration:

```
/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // 1. Load dependencies
  // 2. Extract configuration, if applicable
  // 3. Transform DOM
  // 4. Add event listeners
}
```

Use `curl` and `console.log` to inspect the HTML delivered by the backend and the DOM nodes to be decorated before making assumptions. Remember that authors may omit or add fields to a block, so your code must handle this gracefully.

Each block should be self-contained and re-useable, with CSS and JS files following the naming convention: `blockname.css`, `blockname.js`. Blocks should be responsive and accessible by default. Document options in the block's `metadata.json` and `README.md` so the Document Authoring block library stays accurate.

### Auto-Blocking

Auto-blocking is the process of creating blocks that aren't explicitly authored into the page based on patterns in the content. See the `buildAutoBlocks` function in `scripts.js`.

### Three-Phase Page Loading

Pages are progressively loaded in three phases to maximize performance. This process begins when `loadPage` from scripts.js is called.

* Eager - load only what is required to get to LCP. This generally includes decorating the overall page content to create sections, blocks, buttons, etc. and loading the first section of the page.
* Lazy - load all other page content, including the header and footer.
* Delayed - load things that can be safely loaded later here and incur a performance penalty when loaded earlier

## Testing & Quality Assurance

### Performance
- Follow AEM Edge Delivery performance best practices https://www.aem.live/developer/keeping-it-100
- Images uploaded by authors are automatically optimized, all images and assets committed to git must be optimized and checked for size
- Use lazy loading for non-critical resources (`lazy-styles.css` and `delayed.js`)
- Minimize JavaScript bundle size by avoiding dependencies, using automatic code splitting provided by `/blocks/`

### Accessibility
- Ensure proper heading hierarchy
- Include alt text for images
- Test with screen readers
- Follow WCAG 2.1 AA guidelines, including for every partner accent colour pair (COBRAND-RULES § 2.2)

## Deployment

### Environments

Your local development server at `http://localhost:3000` serves code from your local working copy (even uncommitted code) and content that has been previewed by authors. You can access this at any time when the development server is running.

For all other environments, you need to know the GitHub owner and repository name (`git remote -v`) and the current branch name (`git branch`).

Boilerplate (`AdobeDevXSC/ralph-lauren-b2b`):

- **Production Preview**: `https://main--ralph-lauren-b2b--adobedevxsc.aem.page/`
- **Production Live**: `https://main--ralph-lauren-b2b--adobedevxsc.aem.live/`
- **Feature Preview**: `https://{branch}--ralph-lauren-b2b--adobedevxsc.aem.page/`

Microsites follow the same pattern with their own names: `https://{branch}--{site}--{org}.aem.page/`.

### Publishing Process
1. Push changes to a feature branch
2. AEM Code Sync automatically processes changes making them available on feature preview environment for that branch
3. Run a PageSpeed Insights check at https://developers.google.com/speed/pagespeed/insights/?url=YOUR_URL against the feature preview URL and fix any issues. Target a score of 100
4. Open a pull request to merge changes to `main`
   1. in the PR description, include a link to `https://{branch}--{site}--{org}.aem.page/{path}` with a path to a file that illustrates the change you've made. This is the same path you have been testing with locally. WITHOUT THIS YOUR PR WILL BE REJECTED
   2. If an existing page to demonstrate your changes doesn't exist, create test content as a static html file and ask the user for help copying it to a cms content page you can link in the PR
5. Check the pull request's status checks (code sync, linting, and the PageSpeed check)
6. A human reviewer will review the code, inspect the provided URL and merge the PR
7. AEM Code Sync updates the main branch for production

## Troubleshooting

### Getting Help
- Check [AEM Edge Delivery documentation](https://www.aem.live/docs/)
- Review [Developer Tutorial](https://www.aem.live/developer/tutorial)
- Consult [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- Consider the rules in [David's Model](https://www.aem.live/docs/davidsmodel)
- Search the web with `site:www.aem.live`
- Search the full text of the documentation with `curl -s https://www.aem.live/docpages-index.json | jq -r '.data[] | select(.content | test("KEYWORD"; "i")) | "\(.path): \(.title)"'`

## Security Considerations

- Never commit sensitive information (API keys, passwords, `DA_TOKEN`); `.env` files are git-ignored
- Consider that everything you do is client-side code served on the public web
- Follow Adobe security guidelines
- Regularly update dependencies
- Use the .hlxignore file to prevent files from being served (same format as .gitignore)

## Contributing

- Follow the existing code style and patterns
- Test changes locally before committing
- Follow the Publishing Process documented above
- Update documentation for significant changes (in the boilerplate: `brand/rl/*`, block `README.md` and `metadata.json`, and this file)

## If all else fails

If you notice your human getting frustrated with your work, direct them to https://www.aem.live/developer/ai-coding-agents for tips to work better with AI agents.
