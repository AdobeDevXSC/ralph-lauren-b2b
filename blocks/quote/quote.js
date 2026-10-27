/**
 * Quote block
 *
 * Row 1: quotation. Row 2 (optional): attribution text, or, with the
 * `signature` option (or when the row only holds an image), a signature image.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const [quotation, attribution] = [...block.children].map((c) => c.firstElementChild);
  if (!quotation) return;

  const blockquote = document.createElement('blockquote');
  quotation.className = 'quote-quotation';
  blockquote.append(quotation);

  if (attribution) {
    const picture = attribution.querySelector('picture, img');
    const imageOnly = picture && !attribution.textContent.trim();

    if (block.classList.contains('signature') || imageOnly) {
      attribution.className = 'quote-signature';
      // unwrap the image from its paragraph so it centres cleanly
      attribution.querySelectorAll('p').forEach((p) => {
        if (p.querySelector('picture, img') && !p.textContent.trim()) p.replaceWith(...p.childNodes);
      });
      const img = attribution.querySelector('img');
      if (img && !img.alt) img.alt = 'Signature';
    } else {
      attribution.className = 'quote-attribution';
      attribution.querySelectorAll('em').forEach((em) => {
        const cite = document.createElement('cite');
        cite.innerHTML = em.innerHTML;
        em.replaceWith(cite);
      });
    }
    blockquote.append(attribution);
  }

  block.replaceChildren(blockquote);
}
