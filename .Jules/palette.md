## 2024-10-25 - Accessible Tab Toggles
**Learning:** Custom tab toggles implemented with `div` elements lack semantic meaning and keyboard accessibility by default, creating barriers for screen readers and keyboard users.
**Action:** Always implement custom tabs using native `button` elements with stripped default styling, adding appropriate ARIA roles (`tablist`, `tab`, `tabpanel`), and implementing a roving tabindex supported by arrow-key navigation for standard tab interactions.
