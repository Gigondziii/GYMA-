## 2024-10-31 - Keyboard Accessible Tab Toggles
**Learning:** Custom UI tabs built with `<div>` elements completely exclude keyboard and screen reader users. Simply adding `onclick` handlers is insufficient for accessibility.
**Action:** Always use native `<button>` elements for custom toggles, explicitly strip browser styling to retain visual design, and implement proper ARIA roles (`tablist`, `tab`, `tabpanel`) alongside roving `tabindex` and arrow key navigation logic.
