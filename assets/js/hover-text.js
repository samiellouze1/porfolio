class HoverText extends HTMLElement {
  static get observedAttributes() {
    return ["default-color", "hover-color", "extra-classes"];
  }

  connectedCallback() {
    const text = this.textContent.trim();
    const hoverColor = this.getAttribute("hover-color") || "#000000";
    const extraClasses = this.getAttribute("extra-classes") || "";

    // Resolve default color: named tailwind token or raw CSS value
    const rawDefault = this.getAttribute("default-color");
    const defaultColor = rawDefault
      ? this._resolveTailwindColor(rawDefault) || rawDefault
      : this._resolveTailwindColor("grey-20");

    this.innerHTML = "";

    const p = document.createElement("p");
    p.textContent = text;
    p.className = ["pt-4", "font-body", "leading-relaxed", ...extraClasses.split(" ").filter(Boolean)].join(" ");
    p.style.color = defaultColor;
    p.style.transition = "color 200ms ease";
    p.style.cursor = "default";

    p.addEventListener("mouseenter", () => (p.style.color = hoverColor));
    p.addEventListener("mouseleave", () => (p.style.color = defaultColor));

    this._p = p;
    this.appendChild(p);
  }

  attributeChangedCallback() {
    if (!this._p) return;
    const rawDefault = this.getAttribute("default-color");
    const defaultColor = rawDefault
      ? this._resolveTailwindColor(rawDefault) || rawDefault
      : this._resolveTailwindColor("grey-20");
    this._p.style.color = defaultColor;
  }

  // Maps Tailwind-style color tokens used in this project to their hex values
  _resolveTailwindColor(token) {
    const map = {
      "grey-20": "#4b5563",
      "grey-40": "#9ca3af",
      "grey-50": "#f9fafb",
      "grey-70": "#d1d5db",
      "primary": "#5540af",
      "secondary": "#ff6b6b",
      "yellow": "#fbbf24",
      "green": "#10b981",
      "black": "#000000",
      "white": "#ffffff",
    };
    return map[token] || null;
  }
}

customElements.define("hover-text", HoverText);

/* ─── Usage ──────────────────────────────────────────────────────────────────

  // Default (grey-20 → black)
  <hover-text>
    Your text here…
  </hover-text>

  // Custom named token (from project palette)
  <hover-text default-color="grey-40" hover-color="#1d4ed8">
    Lighter grey that turns blue on hover.
  </hover-text>

  // Raw CSS color values
  <hover-text default-color="#9ca3af" hover-color="#5540af">
    Custom hex colors.
  </hover-text>

  // Extra Tailwind classes on top of the defaults (pt-6 font-body leading-relaxed)
  <hover-text extra-classes="text-sm italic">
    Smaller italic text.
  </hover-text>

────────────────────────────────────────────────────────────────────────── */
