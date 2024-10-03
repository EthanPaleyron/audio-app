class NavList extends HTMLElement {
  constructor() {
    super();

    // Initialisez votre composant
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    const li = document.createElement("li");
    li.className = "nav-item";

    const a = document.createElement("a");
    const aAttr = this.getAttribute("href");
    a.href = aAttr;

    const icon = document.createElement("img");
    const iconAttr = this.getAttribute("icon");
    icon.src = iconAttr;

    const slot = document.createElement("slot");

    a.appendChild(icon);
    a.appendChild(slot);

    li.appendChild(a);

    this.shadowRoot.appendChild(li);
  }

  static get observedAttributes() {
    return ["href", "selected", "icon"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const li = this.shadowRoot.querySelector(".nav-item");

    if (name === "selected") {
      if (this.hasAttribute("selected")) {
        li.classList.add("selected");
      } else {
        li.classList.remove("selected");
      }
    }
  }
}

// Enregistrez ou déginir son composant
customElements.define("nav-list", NavList);
