import cssText from "./button.scss?inline";

class CustomButton extends HTMLElement {
  static sheet;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.applyStyles();
    this.render();
  }

  applyStyles() {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText.toString());
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  static get observedAttributes() {
    return ["variant", "disabled"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const variant = this.getAttribute("variant") || "primary";
    const disabled = this.hasAttribute("disabled");

    // Clean the previous content but keep styles
    this.shadowRoot.innerHTML = `
      <button class="${variant}" ${disabled ? "disabled" : ""}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ce-button", CustomButton);
