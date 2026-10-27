import { fetchPlaceholders } from '../../scripts/placeholders.js';

const REAL_SLIDES = '.carousel-slide:not(.carousel-slide-clone)';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll(REAL_SLIDES);
  const isBrands = block.classList.contains('brands');

  slides.forEach((aSlide, idx) => {
    aSlide.classList.toggle('carousel-slide-active', idx === slideIndex);
    // brands shows several slides at once, so every slide stays reachable
    if (isBrands) return;
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    const button = indicator.querySelector('button');
    if (idx !== slideIndex) {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    } else {
      button.setAttribute('disabled', true);
      button.setAttribute('aria-current', true);
    }
  });
}

/**
 * scrollLeft that brings a slide into its resting position: centred, or (when
 * CSS snaps slide ends, as brands does on desktop) just left of the centre so
 * the slide and its right-hand neighbour sit side by side.
 */
function centreOffset(slidesWrapper, slide) {
  if (getComputedStyle(slide).scrollSnapAlign.includes('end')) {
    const gap = parseFloat(getComputedStyle(slidesWrapper).columnGap) || 0;
    return slide.offsetLeft + slide.offsetWidth - (slidesWrapper.clientWidth - gap) / 2;
  }
  return slide.offsetLeft - (slidesWrapper.clientWidth - slide.offsetWidth) / 2;
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll(REAL_SLIDES);
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a:not(.carousel-slide-image-link)').forEach((link) => link.removeAttribute('tabindex'));
  const slidesWrapper = block.querySelector('.carousel-slides');

  if (block.classList.contains('brands')) {
    // wrap-around: scroll on to the clone next to the edge, then jump back
    // to the real slide once scrolling settles (see bindBrandsEvents)
    let target = activeSlide;
    if (slideIndex >= slides.length) target = block.querySelector('.carousel-slide-clone[data-clone-side="after"]') || activeSlide;
    if (slideIndex < 0) target = [...block.querySelectorAll('.carousel-slide-clone[data-clone-side="before"]')].pop() || activeSlide;
    slidesWrapper.scrollTo({ top: 0, left: centreOffset(slidesWrapper, target), behavior: 'smooth' });
    updateActiveSlide(activeSlide);
    return;
  }

  slidesWrapper.scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

/**
 * brands: looping track. A copy of the slides is placed before and after the
 * real ones so neighbours always peek on both sides; the copies are inert.
 * @param {Element} block The carousel block
 */
function bindBrandsEvents(block) {
  const slidesWrapper = block.querySelector('.carousel-slides');
  const slides = [...block.querySelectorAll(REAL_SLIDES)];

  const makeClone = (slide, idx, side) => {
    const clone = slide.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('aria-labelledby');
    clone.classList.add('carousel-slide-clone');
    clone.classList.remove('carousel-slide-active');
    clone.dataset.cloneOf = idx;
    clone.dataset.cloneSide = side;
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    return clone;
  };
  slidesWrapper.prepend(...slides.map((slide, idx) => makeClone(slide, idx, 'before')));
  slidesWrapper.append(...slides.map((slide, idx) => makeClone(slide, idx, 'after')));
  const allSlides = [...slidesWrapper.children];

  // the slide whose resting position is closest to the current scroll position
  const findCentred = () => allSlides.reduce((closest, slide) => {
    const distance = Math.abs(centreOffset(slidesWrapper, slide) - slidesWrapper.scrollLeft);
    return distance < closest.distance ? { slide, distance } : closest;
  }, { slide: slides[0], distance: Infinity }).slide;

  const jumpTo = (slide) => {
    slidesWrapper.scrollTo({ top: 0, left: centreOffset(slidesWrapper, slide), behavior: 'instant' });
  };

  let timer;
  slidesWrapper.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const centred = findCentred();
      if (centred.classList.contains('carousel-slide-clone')) {
        const real = slides[parseInt(centred.dataset.cloneOf, 10)];
        jumpTo(real);
        updateActiveSlide(real);
      } else {
        updateActiveSlide(centred);
      }
    }, 120);
  }, { passive: true });

  block.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (!e.target.closest('.carousel-slides, .carousel-navigation-buttons')) return;
    e.preventDefault();
    const step = e.key === 'ArrowLeft' ? -1 : 1;
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + step);
  });

  // start on the first slide, centred; re-centre whenever the track resizes
  // (this also covers the first layout, once the section becomes visible)
  updateActiveSlide(slides[0]);
  let lastWidth = 0;
  new ResizeObserver(() => {
    if (!slidesWrapper.clientWidth || slidesWrapper.clientWidth === lastWidth) return;
    lastWidth = slidesWrapper.clientWidth;
    jumpTo(slides[parseInt(block.dataset.activeSlide, 10) || 0]);
  }).observe(slidesWrapper);
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  if (block.classList.contains('brands')) {
    bindBrandsEvents(block);
    return;
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId, isBrands = false) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  if (isBrands) {
    const picture = slide.querySelector('.carousel-slide-image picture');
    const link = slide.querySelector('.carousel-slide-content a[href]');
    if (picture && link) {
      // pointer-only shortcut; the label link is the accessible link
      const imageLink = document.createElement('a');
      imageLink.href = link.href;
      imageLink.className = 'carousel-slide-image-link';
      imageLink.tabIndex = -1;
      imageLink.setAttribute('aria-hidden', 'true');
      picture.replaceWith(imageLink);
      imageLink.append(picture);
    }
    if (link) {
      link.closest('p')?.classList.add('button-wrapper');
      link.classList.add('button', 'secondary');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', link.textContent.trim());
    }
  }

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy && labeledBy.id) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;
  const isBrands = block.classList.contains('brands');

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId, isBrands);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
