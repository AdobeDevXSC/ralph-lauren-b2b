/**
 * Hero block
 *
 * Default: background image with a centred title (and optional text).
 * Options:
 * - video: full-bleed muted, looping background video from an authored .mp4 link,
 *   optional poster image, optional overlaid text and a pause/play control.
 * - image-only: full-bleed image without any text.
 */

const VIDEO_LINK = 'a[href*=".mp4"]';

function isVideoLink(a) {
  try {
    return new URL(a.href, window.location.href).pathname.toLowerCase().endsWith('.mp4');
  } catch {
    return false;
  }
}

/**
 * Removes elements that are left empty once their content has been moved.
 * @param {Element} root container to clean
 */
function removeEmpty(root) {
  [...root.querySelectorAll('p, div')].reverse().forEach((el) => {
    if (!el.children.length && !el.textContent.trim()) el.remove();
  });
}

function buildToggle(video) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-video-toggle';
  // outlined pause/play glyphs (source .corp-playpause-button, 33x33 viewBox)
  button.innerHTML = `<svg class="hero-video-icon-pause" viewBox="0 0 33 33" aria-hidden="true" focusable="false"><path d="M8.5,27V6H13v21H8.5z"/><path d="M24.5,6v21H20V6H24.5z"/></svg>
    <svg class="hero-video-icon-play" viewBox="0 0 33 33" aria-hidden="true" focusable="false"><polygon points="9.1,28.1 9.1,4.9 23.9,16.5"/></svg>`;

  const sync = () => {
    const { paused } = video;
    button.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    button.dataset.state = paused ? 'paused' : 'playing';
  };

  button.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  sync();
  return button;
}

function decorateVideo(block, media, content) {
  const link = [...content.querySelectorAll(VIDEO_LINK)].find(isVideoLink);
  if (!link) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const video = document.createElement('video');
  video.className = 'hero-video';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'metadata');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('tabindex', '-1');

  const poster = media.querySelector('picture img');
  if (poster) video.poster = poster.currentSrc || poster.src;

  const source = document.createElement('source');
  source.src = link.href;
  source.type = 'video/mp4';
  video.append(source);

  // the link (and its paragraph, when it holds nothing else) is consumed by the video
  const holder = link.closest('p');
  if (holder && holder.textContent.trim() === link.textContent.trim()) holder.remove();
  else link.remove();
  removeEmpty(content);

  media.append(video);
  media.append(buildToggle(video));

  if (!reduceMotion) {
    video.autoplay = true;
    video.setAttribute('autoplay', '');
    // start playback once the block is close to the viewport
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        video.play().catch(() => {});
      }
    });
    observer.observe(block);
  }

  if (!content.textContent.trim() && !content.querySelector('img')) {
    block.classList.add('hero-no-text');
  }
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const isVideo = block.classList.contains('video');
  const isImageOnly = block.classList.contains('image-only');

  const media = document.createElement('div');
  media.className = 'hero-media';
  const content = document.createElement('div');
  content.className = 'hero-content';

  // first picture is the background (or video poster); everything else is content
  const picture = block.querySelector('picture');
  if (picture) {
    const holder = picture.closest('p');
    media.append(picture);
    if (holder && !holder.children.length && !holder.textContent.trim()) holder.remove();
  }

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => content.append(...cell.childNodes));
  });
  removeEmpty(content);

  block.replaceChildren(media);

  if (isVideo) decorateVideo(block, media, content);

  if (isImageOnly) {
    block.classList.add('hero-no-text');
    const img = media.querySelector('img');
    if (img && !img.alt) img.setAttribute('role', 'presentation');
    return;
  }

  if (content.childNodes.length) {
    const inner = document.createElement('div');
    inner.className = 'hero-content-inner';
    inner.append(...content.childNodes);
    content.append(inner);
    block.append(content);
  }
}
