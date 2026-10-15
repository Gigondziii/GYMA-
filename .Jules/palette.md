
## 2024-05-18 - Inaccessible Custom Toggles in Authentication Flow
**Learning:** Found a recurring pattern where interactive custom UI elements (like form toggles) are built using standard `<div>` elements styled to look like buttons, entirely missing native `<button>` semantics, ARIA roles, and keyboard navigation support.
**Action:** When auditing custom components (tabs, toggles, segmented controls) in this app, explicitly check for native interactive elements. If converting `<div>`s to `<button>`s, always strip default styling and implement full ARIA tablist/tab roles with a roving tabindex for keyboard support.
