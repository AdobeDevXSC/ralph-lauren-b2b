/**
 * Teaser block
 *
 * Authoring: an image and a content cell (heading, optional deck paragraphs,
 * CTA link(s)), in one row of two cells or two rows of one cell.
 *
 * Default: the heading is overlaid on the image, the deck sits below the
 * image and the CTA below the deck. The whole image links to the CTA.
 * Options:
 * - light: navy text overlaid on a light image (all content overlaid).
 * - links: uppercase title and secondary links overlaid on the image.
 */

const OVERLAY_ALL = ['light', 'links'];

function isButtonParagraph(el) {
  return el.matches('p') && el.querySelector('a') && el.textContent.trim() === el.querySelector('a').textContent.trim();
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const overlayAll = OVERLAY_ALL.some((option) => block.classList.contains(option));
  const isLinks = block.classList.contains('links');

  const picture = block.querySelector('picture');
  const elements = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      [...cell.children].forEach((el) => {
        if (picture && el.contains(picture)) {
          // keep any text authored next to the image
          if (el.textContent.trim()) {
            picture.remove();
            elements.push(el);
          }
        } else {
          elements.push(el);
        }
      });
    });
  });

  const media = document.createElement('div');
  media.className = 'teaser-media';
  const overlay = document.createElement('div');
  overlay.className = 'teaser-overlay';
  const body = document.createElement('div');
  body.className = 'teaser-body';

  const heading = elements.find((el) => /^H[1-6]$/.test(el.tagName));
  const ctas = elements.filter(isButtonParagraph);

  elements.forEach((el) => {
    if (el === heading || overlayAll) overlay.append(el);
    else body.append(el);
  });

  // links option: plain links become secondary buttons
  if (isLinks) {
    ctas.forEach((p) => {
      const a = p.querySelector('a');
      if (!a.classList.contains('button')) {
        p.classList.add('button-wrapper');
        a.classList.add('button', 'secondary');
      }
    });
    const group = document.createElement('div');
    group.className = 'teaser-links';
    ctas.forEach((p) => group.append(p));
    if (ctas.length) overlay.append(group);
  }

  if (picture) {
    // the image is a pointer-only shortcut to the CTA; keyboard and screen
    // readers use the CTA link itself
    const cta = !overlayAll && ctas.length ? ctas[0].querySelector('a') : null;
    if (cta) {
      const link = document.createElement('a');
      link.href = cta.href;
      link.className = 'teaser-image-link';
      link.tabIndex = -1;
      link.setAttribute('aria-hidden', 'true');
      link.append(picture);
      media.append(link);
    } else {
      media.append(picture);
    }
  }

  media.append(overlay);
  block.replaceChildren(media);
  if (body.children.length) block.append(body);
  if (!overlay.children.length) overlay.remove();
}
