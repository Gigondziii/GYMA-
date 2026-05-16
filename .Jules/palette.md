## 2026-05-16 - Native Buttons for Tab Components
**Learning:** Using `<div>` elements with `onclick` handlers for tab-like components removes native keyboard navigation and focus states. Changing to native `<button>` elements with appropriate ARIA roles (`role="tablist"`, `role="tab"`) immediately provides these accessibility features.
**Action:** Always use native `<button>` elements for custom tab toggles and strip default browser styling via CSS (`background: none; border: none; outline: none;`), rather than starting with non-interactive `<div>` elements.
