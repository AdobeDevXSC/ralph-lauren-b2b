// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 900px)');

/**
 * Fetches the nav fragment. Metadata-independent dual fetch:
 * /content first (local aem up), then the site root (DA/EDS production).
 * @returns {Promise<{html: string, base: string}|null>} fragment markup and its URL
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  return { html: await resp.text(), base: resp.url };
}

/**
 * Resolves relative image paths in the fragment against the fragment URL,
 * so images keep working on pages at any depth.
 * @param {Element} root fragment root
 * @param {string} base fragment URL
 */
function resolveImages(root, base) {
  root.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^(https?:|data:|\/)/.test(src)) {
      img.src = new URL(src, base).pathname;
    }
  });
}

/**
 * Opens links that leave the brand's site (host differs from the home link) in a new tab.
 * @param {Element} root container
 * @param {string} homeHost host of the brand home link
 */
function markExternalLinks(root, homeHost) {
  root.querySelectorAll('a[href]').forEach((a) => {
    try {
      const { host } = new URL(a.href);
      if (homeHost && host && host !== homeHost) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
    } catch {
      // ignore malformed URLs
    }
  });
}

/**
 * Builds the static ticker label from the paragraphs of a section.
 * First paragraph = exchange, then symbol.
 * @param {Element} section nav fragment section
 * @returns {Element}
 */
function buildTicker(section) {
  const ticker = document.createElement('div');
  ticker.className = 'nav-ticker';
  const parts = ['exchange', 'symbol'];
  [...section.querySelectorAll('p')].forEach((p, i) => {
    const span = document.createElement('span');
    span.className = `nav-ticker-${parts[i] || 'extra'}`;
    span.textContent = p.textContent.trim();
    ticker.append(span);
  });
  return ticker;
}

/**
 * Builds the brand (logo) container. The first logo is Ralph Lauren; an optional
 * second logo (paragraph) in the same section is the cobrand partner, rendered as
 * a lockup: Ralph Lauren | partner.
 * @param {Element} section nav fragment section
 * @returns {Element}
 */
function buildBrand(section) {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const logos = [...section.querySelectorAll(':scope > p')]
    .map((p) => p.querySelector('a') || p.querySelector('picture, img'))
    .filter(Boolean);
  if (!logos.length) {
    brand.append(...section.childNodes);
    return brand;
  }
  const [rlLogo, partnerLogo] = logos;
  rlLogo.classList.add('nav-brand-rl');
  brand.append(rlLogo);
  if (partnerLogo) {
    brand.classList.add('nav-brand-cobrand');
    const divider = document.createElement('span');
    divider.className = 'nav-brand-divider';
    divider.setAttribute('aria-hidden', 'true');
    partnerLogo.classList.add('nav-brand-partner');
    brand.append(divider, partnerLogo);
  }
  return brand;
}

/**
 * Keeps an open dropdown inside the viewport (default offset is set in CSS).
 * @param {Element} item nav item
 */
function positionDropdown(item) {
  const sub = item.querySelector(':scope > .nav-sublist');
  if (!sub || !isDesktop.matches) return;
  sub.style.left = '';
  const rect = sub.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const current = parseFloat(getComputedStyle(sub).left) || 0;
  if (rect.left < 0) {
    sub.style.left = `${current - rect.left}px`;
  } else if (rect.right > vw) {
    sub.style.left = `${current - (rect.right - vw)}px`;
  }
}

/**
 * Opens or closes a dropdown, reflecting the state on the trigger link.
 * @param {Element} item nav item with a dropdown
 * @param {boolean} open desired state
 */
function setDropdown(item, open) {
  item.classList.toggle('is-open', open);
  item.querySelectorAll(':scope > a, :scope > .nav-sub-toggle').forEach((el) => {
    el.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (open) positionDropdown(item);
}

/**
 * Closes every open dropdown / sub-panel.
 * @param {Element} nav nav element
 */
function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-drop').forEach((li) => setDropdown(li, false));
}

/**
 * Creates the close (X) button used in the mobile panel headers.
 * @returns {HTMLButtonElement}
 */
function createCloseButton() {
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-close';
  close.setAttribute('aria-label', 'Close navigation');
  return close;
}

/**
 * Builds the primary navigation list: hover dropdowns on desktop,
 * chevron-triggered slide-in sub-panels on mobile.
 * @param {Element} section nav fragment section containing a nested list
 * @param {{backLabel: string}} labels mobile-only labels read from the fragment
 * @returns {Element}
 */
function buildSections(section, labels) {
  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  const inner = document.createElement('div');
  inner.className = 'nav-sections-inner';
  const list = section.querySelector('ul');
  if (list) {
    list.className = 'nav-list';
    [...list.children].forEach((li) => {
      li.className = 'nav-item';
      const topLink = li.querySelector(':scope > a');
      if (topLink) topLink.className = 'nav-link';
      li.querySelectorAll(':scope > ul a').forEach((a) => { a.className = 'nav-sublink'; });
      const subList = li.querySelector(':scope > ul');
      if (!subList) return;
      li.classList.add('nav-drop');
      const trigger = li.querySelector(':scope > a');
      const label = trigger ? trigger.textContent.trim() : '';

      const wrap = document.createElement('div');
      wrap.className = 'nav-sublist';
      subList.replaceWith(wrap);

      // mobile-only sub-panel header: back + close, then the parent link row
      const head = document.createElement('div');
      head.className = 'nav-head';
      const back = document.createElement('button');
      back.type = 'button';
      back.className = 'nav-back';
      back.textContent = labels.backLabel;
      head.append(back, createCloseButton());
      wrap.append(head);
      if (trigger) {
        const parent = trigger.cloneNode(true);
        parent.className = 'nav-sublist-parent';
        wrap.append(parent);
      }
      wrap.append(subList);

      // mobile chevron toggle (split link: text navigates, chevron opens sub-panel)
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-sub-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', `${label} menu`);
      wrap.before(toggle);

      if (trigger) {
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
      }
      toggle.addEventListener('click', () => setDropdown(li, !li.classList.contains('is-open')));
      back.addEventListener('click', () => {
        setDropdown(li, false);
        toggle.focus();
      });
      li.addEventListener('mouseenter', () => { if (isDesktop.matches) setDropdown(li, true); });
      li.addEventListener('mouseleave', () => { if (isDesktop.matches) setDropdown(li, false); });
      li.addEventListener('focusin', () => { if (isDesktop.matches) setDropdown(li, true); });
      li.addEventListener('focusout', (e) => {
        if (isDesktop.matches && !li.contains(e.relatedTarget)) setDropdown(li, false);
      });
    });
    inner.append(list);
  }
  sections.append(inner);
  return sections;
}

/**
 * Opens or closes the search flyout.
 * @param {Element} nav nav element
 * @param {boolean} [force] desired state
 */
function toggleSearch(nav, force) {
  const toggle = nav.querySelector('.nav-search-toggle');
  const flyout = nav.querySelector('.nav-search');
  if (!toggle || !flyout) return;
  const open = force !== undefined ? force : toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  flyout.hidden = !open;
  if (open) flyout.querySelector('input').focus();
}

/**
 * Builds the search icon toggle and the inline search flyout (form controls live in JS).
 * @param {Element} section nav fragment section: search link (+ icon) and placeholder text
 * @param {Element} nav nav element
 * @returns {{tools: Element, flyout: Element}}
 */
function buildSearch(section, nav) {
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  const link = section.querySelector('a');
  const icon = section.querySelector('img');
  const placeholderP = [...section.querySelectorAll('p')].find((p) => !p.querySelector('a, img'));
  const placeholder = placeholderP ? placeholderP.textContent.trim() : '';
  const label = icon ? icon.alt : placeholder;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-search-toggle';
  toggle.setAttribute('aria-label', label);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'nav-search');
  if (icon) toggle.append(icon);
  tools.append(toggle);

  const flyout = document.createElement('div');
  flyout.className = 'nav-search';
  flyout.id = 'nav-search';
  flyout.hidden = true;
  const form = document.createElement('form');
  form.role = 'search';
  form.method = 'get';
  form.action = link ? link.href : '';
  const field = document.createElement('div');
  field.className = 'nav-search-field';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'nav-search-submit';
  submit.setAttribute('aria-label', label);
  if (icon) {
    const submitIcon = icon.cloneNode();
    submitIcon.alt = '';
    submit.append(submitIcon);
  }
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = placeholder;
  input.autocomplete = 'off';
  input.setAttribute('aria-label', label);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-search-close';
  close.setAttribute('aria-label', 'Close');
  close.addEventListener('click', () => {
    toggleSearch(nav, false);
    toggle.focus();
  });
  field.append(submit, input, close);
  form.append(field);
  flyout.append(form);

  toggle.addEventListener('click', () => toggleSearch(nav));
  return { tools, flyout };
}

/**
 * Toggles the mobile menu.
 * @param {Element} nav nav element
 * @param {boolean} [force] desired state
 */
function toggleMenu(nav, force) {
  const open = force !== undefined ? force : nav.getAttribute('aria-expanded') !== 'true';
  const button = nav.querySelector('.nav-hamburger button');
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflowY = (open && !isDesktop.matches) ? 'hidden' : '';
  if (button) button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (!open) closeAllDropdowns(nav);
}

/**
 * Reads the mobile-only labels section (Home link + Back label).
 * @param {Element} section nav fragment section
 * @returns {{homeLink: Element|null, backLabel: string}}
 */
function readMobileLabels(section) {
  if (!section) return { homeLink: null, backLabel: '' };
  const homeLink = section.querySelector('a');
  const backP = [...section.querySelectorAll('p')].find((p) => !p.querySelector('a'));
  return { homeLink, backLabel: backP ? backP.textContent.trim() : '' };
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  if (!fragment) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = fragment.html;
  resolveImages(tmp, fragment.base);
  const [tickerSection, brandSection, navSection, searchSection, mobileSection] = [...tmp.children];
  const labels = readMobileLabels(mobileSection);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-label', 'Main navigation');

  const top = document.createElement('div');
  top.className = 'nav-top';

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.querySelector('button').addEventListener('click', () => toggleMenu(nav));
  top.append(hamburger);

  const ticker = tickerSection ? buildTicker(tickerSection) : null;
  if (ticker) top.append(ticker);
  const brand = brandSection ? buildBrand(brandSection) : null;
  if (brand) top.append(brand);
  let flyout = null;
  if (searchSection) {
    const search = buildSearch(searchSection, nav);
    top.append(search.tools);
    flyout = search.flyout;
  }
  nav.append(top);

  if (navSection) {
    const sections = buildSections(navSection, labels);
    // mobile-only panel header (Home link + close) and bottom ticker bar
    const head = document.createElement('div');
    head.className = 'nav-head nav-head-main';
    if (labels.homeLink) {
      labels.homeLink.className = 'nav-home';
      head.append(labels.homeLink);
    }
    head.append(createCloseButton());
    sections.prepend(head);
    if (ticker) {
      const bar = document.createElement('div');
      bar.className = 'nav-mobile-ticker';
      bar.append(ticker.cloneNode(true));
      sections.append(bar);
    }
    nav.append(sections);
  }
  if (flyout) nav.append(flyout);

  nav.querySelectorAll('.nav-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleMenu(nav, false);
      const ham = nav.querySelector('.nav-hamburger button');
      if (ham) ham.focus();
    });
  });

  const homeLink = brand && brand.querySelector('a.nav-brand-rl, a');
  if (homeLink) markExternalLinks(nav, new URL(homeLink.href).host);

  // Escape closes search, dropdowns / sub-panels and the mobile menu; outside click closes search
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    toggleSearch(nav, false);
    closeAllDropdowns(nav);
    if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') toggleMenu(nav, false);
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) toggleSearch(nav, false);
  });

  // reset state when crossing the desktop breakpoint (resize without reload)
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, false);
    toggleSearch(nav, false);
    nav.querySelectorAll('.nav-sublist').forEach((sub) => { sub.style.left = ''; });
    closeAllDropdowns(nav);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
