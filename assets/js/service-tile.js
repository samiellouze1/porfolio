class ServiceTile extends HTMLElement {
  connectedCallback() {
    this.classList.add('block', 'w-full');

    const rawTitle = this.getAttribute('title') || '';
    const title = rawTitle
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const rawHref = this.getAttribute('href') || '#';
    const href = rawHref
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    this.innerHTML = `
    <a href="${href}" class="block w-1/2 max-w-md mx-auto">
      <div class="group w-full justify-center rounded px-6 py-1 shadow hover:bg-primary">
          <div class="text-center">
            <h3 class="px-2 py-2 font-semibold uppercase text-primary group-hover:text-white lg:text-xl">
              ${title}
            </h3>
          </div>
        </div>
    </a>
    `;
  }
}

customElements.define('service-tile', ServiceTile);