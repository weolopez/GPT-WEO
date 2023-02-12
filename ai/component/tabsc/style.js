export const mystyle =` :host { display: flex; flex-direction: column; }
:host([direction="column"]) { flex-direction: row; }
:host([direction="column"]) .tabs { flex-direction: column; }
.tabs { display: flex; flex-direction: row; flex-wrap: nowrap; gap: var(--tab-gap, 0px); }

.tabs ::slotted(*) { padding: 5px; border: 1px solid #ccc; user-select: none; cursor: pointer; }
.tabs ::slotted(.selected) { background: #efefef; }
.tab-contents ::slotted(*) { display: none; }
.tab-contents ::slotted(.selected) { display: block; padding: 5px; } `