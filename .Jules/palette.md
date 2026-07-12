## 2024-07-12 - Form Toggle Accessibility
**Learning:** Custom UI toggles (like login/signup switches) are often built with `<div>` elements for ease of styling, completely breaking keyboard navigation and screen reader semantics.
**Action:** Always refactor these pseudo-buttons into native `<button type="button">` elements with `role="tab"`, `aria-selected`, and a roving `tabindex`. Ensure arrow key navigation handles `e.preventDefault()` to avoid unwanted page scrolling.
