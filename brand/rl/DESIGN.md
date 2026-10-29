---
name: Ralph Lauren B2B Boilerplate
description: The Ralph Lauren corporate design standard for cobranded B2B microsites on AEM Edge Delivery Services.
colors:
  rl-navy: "#031e3a"
  paper-white: "#ffffff"
  linen: "#f5f5f2"
  ledger-blue: "#0068d6"
  rule-grey: "#cbcbcb"
  divider-grey: "#898b8e"
  caption-grey: "#6d6f73"
  ink-black: "#000000"
typography:
  display:
    fontFamily: "Libre Caslon Text, Georgia, 'Times New Roman', serif"
    fontSize: "60px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  headline:
    fontFamily: "Libre Caslon Text, Georgia, 'Times New Roman', serif"
    fontSize: "35px"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "0.01em"
  title:
    fontFamily: "Libre Caslon Text, Georgia, 'Times New Roman', serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.43
  subtitle:
    fontFamily: "Libre Caslon Text, Georgia, 'Times New Roman', serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.42
  body:
    fontFamily: "Hanken Grotesk, Helvetica, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.556
  label:
    fontFamily: "DM Mono, 'Lucida Console', monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "1px"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  gutter: "32px"
  xl: "48px"
  section: "75px"
components:
  button-primary:
    backgroundColor: "{colors.rl-navy}"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "20px 26px"
    width: "263px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.rl-navy}"
    rounded: "{rounded.none}"
    padding: "0 0 6px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.rl-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "18px 26px"
  button-outline-hover:
    backgroundColor: "{colors.rl-navy}"
    textColor: "{colors.paper-white}"
  link-inline:
    textColor: "{colors.ledger-blue}"
---

# Design System: Ralph Lauren B2B Boilerplate

<!-- Source of truth for every cobranded microsite. Tokens mirror styles/brand.css; if the two disagree, styles/brand.css wins and this file is out of date. Partner rules live in brand/rl/COBRAND-RULES.md. -->

## Overview

**Creative North Star: "The Quiet Flagship"**

The system is the Ralph Lauren corporate voice translated for business partners: the calm of a Madison Avenue flagship rather than the energy of a retail campaign. Photography carries the emotion; type, colour and layout stay composed and almost silent around it. Navy on white, a classic serif for headlines, a clean sans for reading and a small mono label for wayfinding are the whole vocabulary.

Density is balanced. Sections breathe (75px apart on desktop), content sits in a 1200px column with a narrower 790px measure for reading, and almost everything is centred. Nothing is rounded, nothing floats on shadows and nothing is decorated for its own sake.

Cobranded microsites inherit this system intact. A partner adds its logo, a restrained accent colour, its imagery and its page compositions, but it never changes the voice.

**Key Characteristics:**
- Navy (#031e3a) on white is the default for text, buttons and rules.
- Serif headlines, sans body, mono uppercase labels and buttons.
- Square corners everywhere; no shadows.
- Centred, editorial layout with generous section spacing.
- Full-bleed photography with white type over it.

## Colors

A restrained, near-monochrome palette: one deep navy carries the brand, warm neutrals frame it, and a single blue is reserved for inline links.

### Primary
- **RL Navy** (#031e3a): body text, headings, primary buttons, outline buttons, rules under primary buttons, the header and footer text. It is the brand's signature; nothing replaces it.

### Secondary
- **Ledger Blue** (#0068d6): inline text links inside paragraphs only. It never appears on buttons, backgrounds or headings. Darkened from the corporate site's #007dfe so links pass WCAG AA (5.31:1 on white, 4.87:1 on Linen).

### Neutral
- **Paper White** (#ffffff): the page ground and text over photography.
- **Linen** (#f5f5f2): the `light` section ground for quiet alternation.
- **Rule Grey** (#cbcbcb): header and footer borders, input strokes.
- **Divider Grey** (#898b8e): row dividers in lists such as the news list.
- **Caption Grey** (#6d6f73): dates, copyright, secondary labels.
- **Ink Black** (#000000): the `black` section ground only (immersive sections).

### Named Rules
**The One Navy Rule.** Navy is the only colour for body text and primary calls to action, on every site, cobranded or not.

**The Blue Is For Reading Rule.** Ledger Blue marks links inside running text and nowhere else.

## Typography

**Display Font:** Libre Caslon Text (with Georgia, Times New Roman)
**Body Font:** Hanken Grotesk (with Helvetica, Arial)
**Label/Mono Font:** DM Mono (with Lucida Console)

**Character:** A classic transitional serif with a quiet grotesk and a precise mono: heritage in the headlines, clarity in the reading text, engineering in the wayfinding. These are freely licensed stand-ins for the licensed Ralph Lauren faces (LeJeune Deck, Founders Grotesk Text and Founders Grotesk Mono); see `fonts/README.md` to swap them.

### Hierarchy
- **Display** (400, 60px desktop / 40px mobile, 1.2): large statements on immersive sections; rare.
- **Headline** (400, 35px desktop / 28px mobile, 1.43, uppercase, 0.01em): page titles (h1). Hero titles use 44px desktop / 28px mobile, uppercase, white.
- **Title** (400, 28px desktop / 24px mobile, 1.43): section headings (h2) and teaser-style titles.
- **Subtitle** (400, 24px desktop / 22px mobile, 1.42): sub-section headings (h3), news titles.
- **Body** (400, 18px desktop / 16px mobile, 1.556): reading text, capped at a 790px measure.
- **Label** (500, 11px, 1px letter-spacing, uppercase): buttons, navigation, footer links, eyebrows (h6).

### Named Rules
**The Three Voices Rule.** Serif speaks, sans explains, mono directs. Never set body copy in the serif or headlines in the mono.

**The Quiet Weight Rule.** Headings stay at weight 400. Emphasis comes from size and case, never bold.

## Layout

A centred single-column system. Content sits in a 1200px container with 32px gutters on desktop (30px on mobile); reading text narrows to 790px (`narrow` section style). Sections are separated by 75px on desktop and 48px on mobile; coloured sections (`light`, `dark`, `black`, `cobrand`, `cobrand-accent`) swap that margin for equal padding so their ground runs edge to edge.

Photography is full-bleed: heroes span the viewport (1440 × 506 on desktop for an image hero), teasers fill the 1200px column, and the brands carousel runs edge to edge with neighbouring slides peeking in.

Breakpoints are mobile-first at 600px, 900px and 1200px. The header is a 50px bar on mobile and 120px (68px brand row + 52px navigation row) from 900px.

### Named Rules
**The Centre Holds Rule.** Headings, short copy and calls to action are centred. Left alignment is for long reading text and lists inside columns.

## Elevation & Depth

The system is flat. There are no shadows. Depth comes from photography, full-bleed imagery behind white type, darkening overlays on images (35–55% black), and tonal section grounds (white, linen, navy, black).

### Named Rules
**The Flat Flagship Rule.** Nothing floats. If an element needs separation, use a 1px rule or a section ground, never a shadow.

## Shapes

Square corners throughout (0px radius): buttons, images, cards, inputs and dialogs. Round shapes are reserved for functional controls only: carousel arrows (45px white circles) and carousel dots. Lines are 1px and quiet; the short 112px rule under a primary button and the 5em underline on secondary links are the system's signature marks.

## Components

### Buttons
Composed, uppercase and quiet; buttons announce rather than shout.
- **Shape:** square (0px radius).
- **Primary:** RL Navy fill, white DM Mono label (11px, 500, 1px tracking), 20px × 26px padding, minimum width 263px, with a 112px navy rule centred 15px beneath it. Authored as a bold link.
- **Secondary:** text-only uppercase link in the body font (12px, 2px tracking) with a 5em underline that grows to full width on hover. Authored as an italic link.
- **Outline:** 1px navy border, navy label, 18px × 26px padding; fills navy with white text on hover. Authored as a bold italic link; used for downloads.
- **Hover / Focus:** primary fades to 85% opacity; focus shows a 2px blue outline offset by 2px.
- **On dark grounds:** primary inverts to white fill with navy text; secondary and outline turn white.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** photography or section grounds; no card chrome.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Divider Grey rows in lists; no card borders.

### Navigation
- **Desktop:** a 120px fixed white header: static "NYSE RL" label left, the Ralph Lauren Corporation wordmark centred, search right; below it a 52px row of nine uppercase DM Mono links (11px) spread across the width between 1px Rule Grey borders. Dropdowns are plain white lists (250px+, 50px rows).
- **Mobile:** a 50px bar with hamburger, centred wordmark and search. The menu slides in full screen with serif items and chevron-triggered sub-panels with a Back control.
- **Cobrand lockup:** an optional partner logo sits right of the wordmark behind a 1px divider (see COBRAND-RULES.md).

### Footer
Centred: "Follow us on" with the LinkedIn mark, the Ralph Lauren wordmark, an optional "In partnership with" partner line, a row of primary links and a row of legal links in DM Mono uppercase separated by 1px rules, then a copyright bar (10px uppercase Caption Grey).

### Signature blocks
- **Hero:** full-bleed image (or muted looping video, or image only) with a centred white uppercase serif title.
- **Teaser:** a 1200px image link with a white serif title over it, an optional deck below and a primary button.
- **Quote:** a centred serif quotation with a text attribution or a signature image.
- **Brands carousel:** looping portrait slides with peeking neighbours, round white arrows and a mono label under each image.
- **News list:** dated rows with optional thumbnails, serif titles and outline Download buttons.
- **Columns:** image and text side by side, text centred vertically.

## Do's and Don'ts

### Do:
- **Do** set all body text and primary buttons in RL Navy (#031e3a) on white or Linen.
- **Do** keep headings at weight 400 and let size and uppercase create hierarchy.
- **Do** use full-bleed photography with a darkening overlay when white type sits on it.
- **Do** centre headings, short copy and calls to action.
- **Do** keep reading text within the 790px measure.
- **Do** separate content with section grounds or 1px rules.

### Don't:
- **Don't** round corners on buttons, images or containers.
- **Don't** add shadows, gradients or glass effects.
- **Don't** use Ledger Blue for anything other than inline links.
- **Don't** bold headings or set body copy in the serif.
- **Don't** introduce new typefaces; the three families are the system.
- **Don't** recolour the primary button for a partner; partner colour lives in accents only (COBRAND-RULES.md).
