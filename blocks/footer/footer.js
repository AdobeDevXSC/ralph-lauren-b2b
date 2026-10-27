/**
 * Hashes that mark a fragment link as a consent-manager trigger
 * (e.g. "Your Privacy Choices", "Manage Cookie Settings").
 */
const CONSENT_HASHES = ['#privacy-choices', '#cookie-settings', '#consent'];

/** Hash suffix authors add to a link to open it in a new tab. */
const NEW_TAB_HASH = '#_blank';

/**
 * Fetches the footer fragment. Metadata-independent dual fetch:
 * /content first (local aem up), then the site root (DA/EDS production).
 * @returns {Promise<{html: string, base: string}|null>} fragment markup and its URL
 */
async function fetchFooterFragment() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  return { html: await resp.text(), base: resp.url };
}

/**
 * Resolves relative image paths against the fragment URL so images work at any page depth.
 * @param {Element} root fragment root
 * @param {string} base fragment URL
 */
function resolveImages(root, base) {
  root.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
      img.setAttribute('src', new URL(src, base).pathname);
    }
    img.setAttribute('loading', 'lazy');
  });
}

/**
 * Returns true when the link is a consent-manager trigger.
 * @param {HTMLAnchorElement} a link
 */
function isConsentTrigger(a) {
  const href = a.getAttribute('href') || '';
  return CONSENT_HASHES.some((hash) => href.startsWith(hash));
}

/**
 * Applies link targets: `#_blank` suffix opens in a new tab, PDFs open/download in a new tab.
 * @param {Element} root container
 */
function applyLinkTargets(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href.endsWith(NEW_TAB_HASH)) {
      a.setAttribute('href', href.slice(0, -NEW_TAB_HASH.length));
      a.target = '_blank';
      a.rel = 'noopener';
    }
    if (/\.pdf($|\?)/i.test(a.getAttribute('href'))) {
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('download', '');
    }
  });
}

/**
 * Opens a minimal consent dialog built from footer content (used when no consent
 * manager integration handles the `footer:consent` event).
 * @param {HTMLAnchorElement} trigger the clicked trigger
 * @param {Element} root footer root
 */
function openFallbackConsentDialog(trigger, root) {
  const dialog = document.createElement('dialog');
  dialog.className = 'footer-consent-dialog';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'footer-consent-close';
  close.setAttribute('aria-label', 'Close');
  close.addEventListener('click', () => dialog.close());
  const title = document.createElement('h2');
  title.id = 'footer-consent-title';
  title.textContent = trigger.textContent.trim();
  const body = document.createElement('p');
  const policy = [...root.querySelectorAll('.footer-main a[href]')]
    .find((a) => !isConsentTrigger(a) && /privacy/i.test(a.getAttribute('href')));
  if (policy) body.append(policy.cloneNode(true));
  dialog.setAttribute('aria-labelledby', title.id);
  dialog.append(close, title, body);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  // remove on close so the footer DOM only holds fragment content
  dialog.addEventListener('close', () => {
    dialog.remove();
    trigger.focus();
  });
  root.append(dialog);
  dialog.showModal();
}

/**
 * Wires consent-manager triggers. A consent integration can listen for `footer:consent`
 * on document and call preventDefault() to take over; otherwise a fallback dialog opens.
 * @param {Element} root footer root
 */
function decorateConsentTriggers(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    if (!isConsentTrigger(a)) return;
    a.setAttribute('role', 'button');
    a.classList.add('footer-consent-trigger');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const event = new CustomEvent('footer:consent', {
        cancelable: true,
        detail: { action: a.getAttribute('href').slice(1), trigger: a },
      });
      if (document.dispatchEvent(event)) openFallbackConsentDialog(a, root);
    });
  });
}

/**
 * Classifies a fragment section and decorates its rows.
 * @param {Element} section top-level fragment section
 * @returns {'brand'|'links'|'copyright'} section role
 */
function decorateSection(section) {
  const lists = section.querySelectorAll(':scope > ul');
  if (lists.length) {
    section.className = 'footer-links';
    lists.forEach((ul) => {
      ul.classList.add('footer-link-row');
      const links = [...ul.querySelectorAll('a')];
      if (links.length && links.every(isConsentTrigger)) {
        // region variants of the same control: show the first, keep the rest for CMP logic
        ul.classList.add('footer-consent-row');
        [...ul.children].slice(1).forEach((li) => li.classList.add('footer-hidden-variant'));
      }
    });
    return 'links';
  }
  if (section.querySelector('a, img')) {
    section.className = 'footer-brand';
    section.querySelectorAll(':scope > p').forEach((p) => {
      const a = p.querySelector('a');
      const hasText = a && a.textContent.trim().length > 0;
      p.className = hasText ? 'footer-follow' : 'footer-logo';
      if (hasText) {
        const textNode = [...a.childNodes]
          .find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (textNode) {
          const label = document.createElement('span');
          label.textContent = textNode.textContent.trim();
          textNode.replaceWith(label);
        }
      }
    });
    return 'brand';
  }
  section.className = 'footer-copyright';
  return 'copyright';
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooterFragment();
  block.textContent = '';
  if (!fragment) return;

  const tpl = document.createElement('template');
  tpl.innerHTML = fragment.html;
  const { content } = tpl;
  resolveImages(content, fragment.base);

  const main = document.createElement('div');
  main.className = 'footer-main';
  const bottom = [];

  let linkSections = 0;
  [...content.children].forEach((section) => {
    if (section.tagName !== 'DIV') return;
    const role = decorateSection(section);
    if (role === 'links') {
      // first link group is the primary site nav (desktop-only); later groups are secondary
      section.classList.add(linkSections === 0 ? 'footer-links-primary' : 'footer-links-secondary');
      linkSections += 1;
    }
    if (role === 'copyright') bottom.push(section);
    else main.append(section);
  });

  block.append(main, ...bottom);
  applyLinkTargets(block);
  decorateConsentTriggers(block);
}
