## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom tab toggles using `<div>` elements are completely inaccessible to screen readers and keyboard navigation. Using native `<button>` elements styled correctly provides a much better baseline.
**Action:** When implementing custom tab toggles, use native `<button>` elements with appropriate ARIA roles (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`) and strip default browser styling (e.g. `background: transparent; border: none; appearance: none`), rather than using `<div>` elements with `onclick` handlers.
