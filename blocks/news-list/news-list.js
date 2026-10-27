/**
 * News list block (authored)
 *
 * Optional first row with a single heading cell: rendered as the list title.
 * Each other row is one news item. Cells are recognised by content, so the
 * thumbnail and download cells are optional:
 * - a cell holding only an image: thumbnail
 * - a cell holding only a link labelled "Download" or pointing to a .pdf: download
 * - any other cell: title link + date
 */

function isImageCell(cell) {
  return cell.querySelector('picture, img') && !cell.textContent.trim();
}

function isDownloadCell(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1) return false;
  const [link] = links;
  if (cell.textContent.trim() !== link.textContent.trim()) return false;
  return /download/i.test(link.textContent) || /\.pdf($|\?)/i.test(link.getAttribute('href'));
}

function buildCopy(cell) {
  const copy = document.createElement('div');
  copy.className = 'news-list-copy';

  const blocks = [...cell.children];
  if (!blocks.length && cell.textContent.trim()) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    blocks.push(p);
  }

  let titleLink = null;
  let title = blocks.find((el) => /^H[1-6]$/.test(el.tagName));
  if (!title) {
    // first element becomes the title, promoted to a heading for the outline
    const first = blocks[0];
    if (first) {
      title = document.createElement('h3');
      title.append(...first.childNodes);
      first.replaceWith(title);
      blocks[0] = title;
    }
  }

  blocks.forEach((el) => {
    if (el === title) {
      el.classList.add('news-list-title');
      titleLink = el.querySelector('a[href]');
    } else {
      el.classList.add('news-list-date');
    }
    copy.append(el);
  });

  return { copy, title, titleLink };
}

function decorateDownload(cell, titleText) {
  const link = cell.querySelector('a[href]');
  const wrapper = document.createElement('div');
  wrapper.className = 'news-list-download';
  link.classList.add('button', 'accent');
  link.classList.remove('primary', 'secondary');
  if (titleText) link.setAttribute('aria-label', `${link.textContent.trim()}: ${titleText}`);
  link.target = '_blank';
  link.rel = 'noopener';
  wrapper.append(link);
  return wrapper;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const list = document.createElement('ul');
  list.className = 'news-list-items';
  let heading = null;

  rows.forEach((row, idx) => {
    const cells = [...row.children];

    // optional list title row
    if (idx === 0 && cells.length === 1 && cells[0].querySelector('h1, h2, h3, h4, h5, h6')
      && !cells[0].querySelector('picture')) {
      heading = cells[0].querySelector('h1, h2, h3, h4, h5, h6');
      heading.classList.add('news-list-heading');
      return;
    }

    const item = document.createElement('li');
    item.className = 'news-list-item';
    let thumb = null;
    let download = null;
    let copyCell = null;

    cells.forEach((cell) => {
      if (!thumb && isImageCell(cell)) thumb = cell;
      else if (!download && isDownloadCell(cell)) download = cell;
      else if (!copyCell && cell.textContent.trim()) copyCell = cell;
    });
    if (!copyCell) return;

    if (thumb) {
      thumb.className = 'news-list-thumb';
      const img = thumb.querySelector('img');
      if (img) img.alt = '';
      item.append(thumb);
      item.classList.add('news-list-item-has-thumb');
    }

    const { copy, title, titleLink } = buildCopy(copyCell);
    item.append(copy);
    if (titleLink) item.classList.add('news-list-item-linked');

    if (download) {
      item.append(decorateDownload(download, title?.textContent.trim()));
      item.classList.add('news-list-item-has-download');
    }

    list.append(item);
  });

  block.replaceChildren();
  if (heading) {
    // list titles render as the tracked widget heading
    const header = document.createElement('div');
    header.className = 'news-list-header';
    header.append(heading);
    block.append(header);
    list.setAttribute('aria-label', heading.textContent.trim());
  }
  block.append(list);
}
