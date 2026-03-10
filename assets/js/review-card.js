class ReviewCard extends HTMLElement {
  connectedCallback() {
    const imagesAttr      = this.getAttribute('images')            || '';
    const imageFallback   = this.getAttribute('image')             || '';
    const author          = this.getAttribute('author')            || 'Anonymous';
    const platform        = this.getAttribute('platform')          || '';
    const stars           = parseInt(this.getAttribute('stars') || '5', 10);
    const review          = this.getAttribute('review')            || '';
    const href            = this.getAttribute('href')              || '#';
    const projectTitle    = this.getAttribute('project-title')     || 'Project';
    const projectDesc     = this.getAttribute('project-desc')      || '';

    // Parse up to 4 images; fall back to single `image` attribute
    const images = imagesAttr
      ? imagesAttr.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4)
      : imageFallback ? [imageFallback] : [];

    const starsFilled = '★'.repeat(Math.min(Math.max(stars, 0), 5));
    const starsEmpty  = '★'.repeat(5 - starsFilled.length);

    // Build slide dots only if more than 1 image
    const dotsHTML = images.length > 1
      ? `<div class="rc-dots">
          ${images.map((_, i) => `<span class="rc-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`).join('')}
        </div>`
      : '';

    this.innerHTML = `
      <style>
        review-card .rc-tab-btn {
          flex: 1;
          padding: 10px 0;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          cursor: pointer;
          color: #9ca3af;
          transition: color 0.2s, border-color 0.2s;
        }
        review-card .rc-tab-btn.active {
          color: #111827;
          border-bottom-color: #111827;
        }
        review-card .rc-panels-wrapper {
          position: relative;
          overflow: hidden;
        }
        review-card .rc-panel {
          width: 100%;
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          transition: opacity 0.15s ease;
        }
        review-card .rc-panel.active {
          visibility: visible;
          opacity: 1;
          position: relative;
        }

        /* Slideshow */
        review-card .rc-slideshow {
          position: relative;
          overflow: hidden;
        }
        review-card .rc-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        review-card .rc-slide.active {
          opacity: 1;
        }

        /* Dots */
        review-card .rc-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        review-card .rc-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: background 0.2s;
        }
        review-card .rc-dot.active {
          background: rgba(255,255,255,1);
        }
      </style>

      <div class="shadow flex flex-col h-full">

        <!-- Slideshow -->
        <a href="${href}">
          <div class="rc-slideshow group relative h-60 sm:h-84 lg:h-64 xl:h-60 flex-shrink-0">
            ${images.map((src, i) => `
              <div
                class="rc-slide${i === 0 ? ' active' : ''}"
                style="background-image: url(${src})"
              ></div>
            `).join('')}
            <span
              class="absolute inset-0 block bg-gradient-to-b from-blog-gradient-from to-blog-gradient-to opacity-10 transition-opacity group-hover:opacity-50 z-[1]"
            ></span>
            <span
              class="absolute bottom-0 right-0 mb-4 mr-4 block rounded-full border-2 border-grey-10 px-4 py-2 text-center font-body text-sm font-bold uppercase text-grey-10 group-hover:border-white group-hover:text-white transition-colors duration-200 z-[2]"
            >${platform}</span>
            ${dotsHTML}
          </div>
        </a>

        <!-- Content area -->
        <div class="bg-white flex-1 flex flex-col">

          <!-- Panels wrapper -->
          <div class="rc-panels-wrapper flex-1">

            <!-- Review panel -->
            <div class="rc-panel active px-5 py-6 xl:py-8" data-panel="review">
              <div class="flex items-center gap-2 justify-between">
                <span class="block font-body text-lg font-semibold text-black">${author}</span>
                <span class="text-lg leading-none">
                  <span style="color:#f59e0b">${starsFilled}</span><span style="color:#d1d5db">${starsEmpty}</span>
                </span>
              </div>
              <span class="block pt-2 font-body text-grey-20">"${review}"</span>
            </div>

            <!-- Project panel -->
            <div class="rc-panel px-5 py-6 xl:py-8" data-panel="project">
              <span class="block font-body text-lg font-semibold text-black">${projectTitle}</span>
              <span class="block pt-2 font-body text-grey-20">${projectDesc}</span>
            </div>

          </div>

          <!-- Tab buttons -->
          <div class="flex border-b border-gray-200 px-5 flex-shrink-0">
            <button class="rc-tab-btn" data-tab="project">Project</button>
            <button class="rc-tab-btn active" data-tab="review">Review</button>
          </div>

        </div>
      </div>
    `;

    // ── Slideshow logic ──────────────────────────────────────────
    const slides = [...this.querySelectorAll('.rc-slide')];
    const dots   = [...this.querySelectorAll('.rc-dot')];

    if (slides.length > 1) {
      let current = 0;

      const goTo = (index) => {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
      };

      // Auto-advance every 5 seconds
      let timer = setInterval(() => goTo(current + 1), 5000);

      // Click dots to jump to a slide and reset timer
      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          clearInterval(timer);
          goTo(parseInt(dot.dataset.index));
          timer = setInterval(() => goTo(current + 1), 5000);
        });
      });
    }

    // ── Panel height measurement ─────────────────────────────────
    const wrapper = this.querySelector('.rc-panels-wrapper');
    const panels  = [...this.querySelectorAll('.rc-panel')];

    panels.forEach(p => {
      p.classList.add('active');
      p.style.position   = 'relative';
      p.style.visibility = 'visible';
      p.style.opacity    = '1';
    });

    requestAnimationFrame(() => {
      const maxHeight = Math.max(...panels.map(p => p.scrollHeight));
      wrapper.style.height = maxHeight + 'px';

      panels.forEach((p, i) => {
        p.style.position   = '';
        p.style.visibility = '';
        p.style.opacity    = '';
        if (i !== 0) p.classList.remove('active');
      });

      // Tab switching
      this.querySelectorAll('.rc-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          this.querySelectorAll('.rc-tab-btn').forEach(b => b.classList.remove('active'));
          this.querySelectorAll('.rc-panel').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          this.querySelector(`[data-panel="${target}"]`).classList.add('active');
        });
      });
    });
  }
}

customElements.define('review-card', ReviewCard);