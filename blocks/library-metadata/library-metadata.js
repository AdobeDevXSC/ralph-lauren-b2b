/**
 * Library metadata only describes a block sample for the Document Authoring
 * Library panel; it is never shown on the page.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  block.setAttribute('aria-hidden', 'true');
}
