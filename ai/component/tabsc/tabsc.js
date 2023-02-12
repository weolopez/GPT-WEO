
import { component } from '/ai/component/component.js'
import { mystyle } from '/ai/component/popupinfo/style.js'
import { html } from '/ai/component/popupinfo/html.js'

export class tabsc extends component {
    static observedAttributes = ["selected-index", "direction"];
    #selectedIndex = 0;
    #direction = "row";
    constructor() {
        super();
        this.bind(this);
    }
    bind(element) {
        element.render = element.render.bind(element);
        element.attachEvents = element.attachEvents.bind(element);
        element.cacheDom = element.cacheDom.bind(element);
        element.onTabClick = element.onTabClick.bind(element);
        element.selectTabByIndex = element.selectTabByIndex.bind(element);
        element.onContentSlotChange = element.onContentSlotChange.bind(element);
        element.onTabSlotChange = element.onTabSlotChange.bind(element);
    }
    connectedCallback() {
        this.render();
        this.cacheDom();
        this.attachEvents();
        this.dom.tabs[this.#selectedIndex]?.classList.add("selected");
        this.dom.contents[this.#selectedIndex]?.classList.add("selected");
    }

    
    render() {
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `
                <style>
                    :host { display: flex; flex-direction: column; }
                    :host([direction="column"]) { flex-direction: row; }
                    :host([direction="column"]) .tabs { flex-direction: column; }
                    .tabs { display: flex; flex-direction: row; flex-wrap: nowrap; gap: var(--tab-gap, 0px); }
                    
                    .tabs ::slotted(*) { padding: 5px; border: 1px solid #ccc; user-select: none; cursor: pointer; }
                    .tabs ::slotted(.selected) { background: #efefef; }
                    .tab-contents ::slotted(*) { display: none; }
                    .tab-contents ::slotted(.selected) { display: block; padding: 5px; }
                </style>
                <div class="tabs">
                    <slot id="tab-slot" name="tab"></slot>
                </div>
                <div class="tab-contents">
                    <slot id="content-slot" name="content"></slot>
                </div>
            `;
    }
    cacheDom() {
        this.dom = {
            tabSlot: this.shadow.querySelector("#tab-slot"),
            contentSlot: this.shadow.querySelector("#content-slot")
        };
        this.dom.tabs = this.dom.tabSlot.assignedElements();
        this.dom.contents = this.dom.contentSlot.assignedElements();
    }
    attachEvents() {
        this.dom.tabSlot.addEventListener("click", this.onTabClick);
        this.dom.tabSlot.addEventListener("slotchange", this.onTabSlotChange);
        this.dom.contentSlot.addEventListener("slotchange", this.onContentSlotChange);
    }
    onTabSlotChange(){
        this.dom.tabs = this.dom.tabSlot.assignedElements();
    }
    onContentSlotChange(){
        this.dom.contents = this.dom.contentSlot.assignedElements();
    }
    onTabClick(e) {
        const target = e.target;
        if (target.slot === "tab") {
            const tabIndex = this.dom.tabs.indexOf(target);
            this.selectTabByIndex(tabIndex);
        }
    }
    selectTabByIndex(index) {
        const tab = this.dom.tabs[index];
        const content = this.dom.contents[index];
        if (!tab || !content) return;
        this.dom.contents.forEach(p => p.classList.remove("selected"));
        this.dom.tabs.forEach(p => p.classList.remove("selected"));
        content.classList.add("selected");
        tab.classList.add("selected");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if(name === "selected-index"){
                this.selectedIndex = newValue;
            } else {
                this[name] = newValue;
            }
        }
    }
    set selectedIndex(value) {
        this.#selectedIndex = value;
    }
    get selectedIndex() {
        return this.#selectedIndex;
    }
    set direction(value){
        this.#direction = value;
        this.setAttribute("direction", value);
    }
    get direction(){
        return this.#direction;
    }
    toggle(){
        if (this.direction === "row") {
			this.direction = "column";
		} else if (this.direction === "column") {
			this.direction = "row";
		}
    }
}

//Page UI

document.addEventListener("DOMContentLoaded", () => {
			const panel = document.querySelector("tabs-c");
			const addButton = document.querySelector("#add-tab");
			let charCode = 68;

			addButton.addEventListener("click", () => {
				const letter = String.fromCharCode(charCode);
				const h1 = document.createElement("h1");
				h1.textContent = `Tab ${letter}`;
				h1.slot = "tab";
				const content = document.createElement("div");
				content.textContent = `Hello Tab ${letter}`;
				content.slot = "content";
				panel.appendChild(h1);
				panel.appendChild(content);
				charCode++;
			});
		});


        customElements.define("tabs-c", tabsc);