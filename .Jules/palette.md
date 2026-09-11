## 2026-09-11 - Custom Tablist Accessibility Pattern
**Learning:** Custom UI tabs built with generic `<div>` elements inherently lack keyboard navigation and screen reader support, requiring significant effort to reconstruct native behavior.
**Action:** Always prioritize native `<button type="button">` elements for tab controls, explicit ARIA roles (`tablist`, `tab`, `tabpanel`), and implement a roving tabindex combined with arrow-key event listeners for compliant keyboard navigation.
