
## 2024-09-14 - Accessible Tab Toggles
**Learning:** Custom UI tabs often implemented using simple `<div>` elements with `onclick` handlers break keyboard accessibility and screen reader support, as they are not natively focusable or semantically meaningful.
**Action:** Always refactor `<div>`-based tabs into `<button type="button">` elements with `role="tab"`, stripped default styling, and a roving tabindex (`tabindex="0"` for active, `-1` for inactive). Add arrow key support (ArrowLeft/ArrowRight) and handle `e.preventDefault()` to prevent scrolling. Ensure they are wrapped in a `role="tablist"` container.
