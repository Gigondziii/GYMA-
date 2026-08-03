## 2024-05-24 - Accessible Tab Toggles
**Learning:** Custom UI tab toggles using simple `<div>` elements heavily impact keyboard users and screen readers by hiding interactive state controls.
**Action:** Always refactor `<div>` based tab toggles to native `<button type="button">` elements with stripped default browser styles, implement standard ARIA tab roles (`tablist`, `tab`, `tabpanel`), and utilize a roving tabindex supported by arrow-key navigation for full accessibility.
