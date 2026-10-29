/*
 * Cobrand guideline check (brand/rl/COBRAND-RULES.md)
 *
 * Runs inside a rendered page (an Edge Delivery preview page or a Stardust
 * prototype) and reports where the page breaks the Ralph Lauren cobrand rules.
 * Defines window.cobrandCheck(options) and returns { passed, counts, findings }.
 * See tools/cobrand-check/README.md for how to run it.
 */
window.cobrandCheck = (options = {}) => {
  const root = getComputedStyle(document.documentElement);
  // resolve brand tokens to rgb() so they compare with computed styles
  const token = (name, fallback) => {
    const probe = document.createElement('span');
    probe.style.color = root.getPropertyValue(name).trim() || fallback;
    document.body.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };
  const NAVY = token('--rl-navy', '#031e3a');
  const WHITE = token('--rl-white', '#fff');
  const LINK_BLUE = token('--link-color', '#0068d6');
  const firstFamily = (stack) => (stack || '').split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase();
  const allowedFamilies = (options.allowedFamilies || [
    root.getPropertyValue('--heading-font-family') || 'Libre Caslon Text',
    root.getPropertyValue('--body-font-family') || 'Hanken Grotesk',
    root.getPropertyValue('--mono-font-family') || 'DM Mono',
  ]).map(firstFamily).filter(Boolean);
  const scope = options.scope || 'header, main, footer';
  const findings = [];
  const counts = {};
  const add = (rule, el, detail) => {
    counts[rule] = (counts[rule] || 0) + 1;
    if (counts[rule] > 5) return; // keep the report short; counts hold the totals
    const id = el
      ? `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).join('.')}` : ''}`
      : '';
    const text = el ? (el.textContent || el.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 60) : '';
    findings.push({
      rule, element: id, text, detail,
    });
  };

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const parse = (c) => {
    const m = (c || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean);
    return {
      r: +r, g: +g, b: +b, a: +a,
    };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  // effective ground: first opaque background colour up the tree; null when over imagery
  const ground = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage !== 'none' && !/linear-gradient\((rgba?\([^)]*\)), \1\)/.test(cs.backgroundImage)) return null;
      if (node.matches('.hero, .teaser .teaser-overlay, .teaser .teaser-media, .carousel .carousel-slide, [data-over-image]')) return null;
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a >= 0.95) return bg;
      node = node.parentElement;
    }
    return parse(getComputedStyle(document.body).backgroundColor) || {
      r: 255, g: 255, b: 255, a: 1,
    };
  };
  const onInvertedGround = (el) => !!el.closest('.section.dark, .section.black, .section.cobrand-accent, .hero, .teaser-overlay, footer .footer-copyright');
  const els = [...document.querySelectorAll(`:is(${scope}) *`)].filter(visible);
  const hasOwnText = (el) => [...el.childNodes]
    .some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  const textEls = els.filter(hasOwnText);

  // 1. Typefaces: only the three Ralph Lauren families
  const families = new Set();
  textEls.forEach((el) => {
    const fam = firstFamily(getComputedStyle(el).fontFamily);
    families.add(fam);
    if (!allowedFamilies.includes(fam)) add('typeface', el, `uses "${fam}"; allowed: ${allowedFamilies.join(', ')}`);
  });

  // 2. Navy text on light grounds; headings at weight 400
  const textBlocks = 'main :is(p, li, h1, h2, h3, h4, h5, h6, blockquote, dt, dd, td, th)';
  els.filter((el) => el.matches(textBlocks) && !onInvertedGround(el))
    .forEach((el) => {
      const cs = getComputedStyle(el);
      const g = ground(el);
      if (!g) return;
      if (cs.color !== NAVY && !el.closest('.news-list')) {
        add('navy-text', el, `text colour ${cs.color} on a light ground; must be RL Navy ${NAVY}`);
      }
      if (/^H[1-5]$/.test(el.tagName) && +cs.fontWeight > 400) {
        add('heading-weight', el, `font-weight ${cs.fontWeight}; headings stay at 400`);
      }
    });

  // 3. Primary buttons: navy with white text on light grounds
  document.querySelectorAll(`:is(${scope}) a.button.primary, :is(${scope}) button.button.primary`).forEach((el) => {
    if (!visible(el) || onInvertedGround(el)) return;
    const cs = getComputedStyle(el);
    if (cs.backgroundColor !== NAVY || cs.color !== WHITE) add('primary-button', el, `background ${cs.backgroundColor}, text ${cs.color}; must be navy with white text`);
  });

  // 4. Ledger Blue only for inline links in running text (text and fills, not inherited by images)
  textEls.concat(els.filter((el) => getComputedStyle(el).backgroundColor === LINK_BLUE))
    .forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.color !== LINK_BLUE && cs.backgroundColor !== LINK_BLUE) return;
      const inline = el.matches('a:not(.button)') && el.closest('p, li, td, dd')
        && !el.closest('nav, header, footer');
      if (!inline) add('link-blue', el, 'Ledger Blue used outside an inline text link');
    });

  // 5. Shape and depth: square corners (small round controls excepted), no shadows, no gradients
  const controls = 'button, [role="button"], input[type="radio"], input[type="checkbox"]';
  // a gradient between two identical stops is a drawn line (e.g. the secondary-link underline)
  const underline = (cs) => /linear-gradient\((rgba?\([^)]*\)), \1\)/.test(cs.backgroundImage);
  els.forEach((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const control = el.matches(controls) && r.width <= 48 && r.height <= 48;
    if (parseFloat(cs.borderTopLeftRadius) > 0 && !control) {
      add('square-corners', el, `border-radius ${cs.borderRadius}`);
    }
    if (cs.boxShadow !== 'none') add('no-shadow', el, `box-shadow ${cs.boxShadow}`);
    if (/gradient\(/.test(cs.backgroundImage) && !underline(cs)) add('no-gradient', el, 'gradient background');
  });

  // 6. Text contrast (WCAG AA) where the ground is a flat colour
  textEls.forEach((el) => {
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    const g = ground(el);
    if (!fg || !g || fg.a < 0.5) return;
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
    const need = large ? 3 : 4.5;
    const value = ratio(fg, g);
    if (value < need) add('contrast', el, `contrast ${value.toFixed(2)}:1 (needs ${need}:1)`);
  });

  // 7. Partner lockup: Ralph Lauren first, partner not larger
  const lockup = document.querySelector('header .nav-brand-cobrand');
  if (lockup) {
    const rl = lockup.querySelector('.nav-brand-rl');
    const partner = lockup.querySelector('.nav-brand-partner');
    const order = [...lockup.children];
    if (rl && partner && order.indexOf(partner) < order.indexOf(rl)) {
      add('lockup-order', partner, 'partner logo placed before the Ralph Lauren wordmark');
    }
    const rlImg = rl && (rl.matches('img') ? rl : rl.querySelector('img'));
    const pImg = partner && (partner.matches('img') ? partner : partner.querySelector('img'));
    const width = (el) => el.getBoundingClientRect().width;
    if (rlImg && pImg && width(pImg) > width(rlImg)) {
      add('lockup-size', partner, 'partner logo wider than the Ralph Lauren wordmark');
    }
  }

  // 8. At most one partner accent band per page
  const bands = document.querySelectorAll('main .section.cobrand-accent');
  if (bands.length > 1) add('accent-bands', bands[1], `${bands.length} cobrand-accent sections; at most 1 per page`);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return {
    passed: total === 0,
    url: window.location.href,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    families: [...families],
    counts,
    findings,
  };
};
