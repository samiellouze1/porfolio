class ReviewCard extends HTMLElement {
  connectedCallback() {
    const image           = this.getAttribute('image')             || '';
    const author          = this.getAttribute('author')            || 'Anonymous';
    const platform        = this.getAttribute('platform')          || '';
    const stars           = parseInt(this.getAttribute('stars') || '5', 10);
    const review          = this.getAttribute('review')            || '';
    const href            = this.getAttribute('href')              || '#';
    const projectTitle    = this.getAttribute('project-title')     || 'Project';
    const projectDesc     = this.getAttribute('project-desc')      || '';

    const starsFilled = '★'.repeat(Math.min(Math.max(stars, 0), 5));
    const starsEmpty  = '★'.repeat(5 - starsFilled.length);

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
        review-card .rc-panel { display: none; }
        review-card .rc-panel.active { display: block; }
      </style>

      <div class="shadow flex flex-col">

        <!-- Image -->
        <a href="${href}">
          <div
            style="background-image: url(${image})"
            class="group relative h-60 bg-cover bg-center bg-no-repeat sm:h-84 lg:h-64 xl:h-60"
          >
            <span
              class="absolute inset-0 block bg-gradient-to-b from-blog-gradient-from to-blog-gradient-to opacity-10 transition-opacity group-hover:opacity-50"
            ></span>
            <span
              class="absolute bottom-0 right-0 mb-4 mr-4 block rounded-full border-2 border-grey-10 px-3 py-1 text-center font-body text-sm font-bold uppercase text-grey-10 group-hover:border-white group-hover:text-white transition-colors duration-200"
            >${platform}</span>
          </div>
        </a>

        <!-- Tabs -->
        <div class="bg-white flex-1 flex flex-col">

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

          <!-- Tab buttons -->
          <div class="flex border-b border-gray-200 px-5">
            <button class="rc-tab-btn" data-tab="project">Project</button>
            <button class="rc-tab-btn active" data-tab="review">Review</button>
          </div>

        </div>
      </div>
    `;

    // Tab switching logic
    this.querySelectorAll('.rc-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        this.querySelectorAll('.rc-tab-btn').forEach(b => b.classList.remove('active'));
        this.querySelectorAll('.rc-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        this.querySelector(`[data-panel="${target}"]`).classList.add('active');
      });
    });
  }
}

customElements.define('review-card', ReviewCard);