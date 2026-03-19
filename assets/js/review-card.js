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
      ? imagesAttr.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5)
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
          height: 400px; /* default content height on wide screens */
        }
        @media (max-width: 1024px) {
          review-card .rc-panels-wrapper {
            height: 200px; /* slightly shorter on half-width or smaller screens */
          }
        }
        review-card .rc-panel {
          width: 100%;
          height: 100%;
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          transition: opacity 0.15s ease;
          overflow-y: auto; /* scroll inside panel when content is long */
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
              class="absolute bottom-0 right-0 mb-4 mr-4 block rounded-full border-2 px-4 py-2 text-center text-grey-20 border-grey-20 font-body text-sm font-bold uppercase 
              group-hover:text-white group-hover:border-white
              transition-all duration-300 z-[2]"
            >
            ${platform}
            </span>
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

    // ── Panel switching (fixed height with scrollbar) ────────────
    const panels  = [...this.querySelectorAll('.rc-panel')];
    const tabButtons = [...this.querySelectorAll('.rc-tab-btn')];

    const setActivePanel = (target) => {
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      const btn = tabButtons.find(b => b.dataset.tab === target);
      const panel = this.querySelector(`[data-panel="${target}"]`);
      if (btn) btn.classList.add('active');
      if (panel) panel.classList.add('active');
    };

    // Ensure only the review panel is active by default
    setActivePanel('review');

    let userInteractedWithTabs = false;
    let autoSwitched           = false;
    let autoSwitchTimeoutId    = null;

    // Tab switching
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        userInteractedWithTabs = true;
        const target = btn.dataset.tab;
        setActivePanel(target);
      });
    });

    // Start (or restart) the auto-switch countdown
    const startAutoSwitch = () => {
      if (userInteractedWithTabs) return;
      if (autoSwitchTimeoutId !== null) {
        clearTimeout(autoSwitchTimeoutId);
      }
      autoSwitched = false;
      autoSwitchTimeoutId = setTimeout(() => {
        if (!userInteractedWithTabs) {
          setActivePanel('project');
          autoSwitched = true;
        }
      }, 1500);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Each time the blog section comes into view:
            // - reset to Review
            // - restart the 2s timer
            if (!userInteractedWithTabs) {
              setActivePanel('review');
            }
            startAutoSwitch();
          } else {
            // When leaving the blog section, clear any pending auto-switch
            if (autoSwitchTimeoutId !== null) {
              clearTimeout(autoSwitchTimeoutId);
              autoSwitchTimeoutId = null;
            }
          }
        });
      }, { threshold: 0.6 });

      // Drive the behavior from the blog section becoming visible
      const blogSection = document.querySelector('#blog');
      if (blogSection) {
        observer.observe(blogSection);
      } else {
        // If we can't find the blog section, fall back to observing the card
        observer.observe(this);
      }
    } else {
      // Fallback: start immediately if IntersectionObserver is not available
      startAutoSwitch();
    }
  }
}

customElements.define('review-card', ReviewCard);