## 2024-05-18 - Semantic HTML Custom Tab Toggles
**Learning:** Custom tab toggles built using `<div>` tags with `onclick` handlers severely limit keyboard and screen reader accessibility, as users cannot naturally focus or navigate these components.
**Action:** When implementing custom tab toggles, use native `<button>` elements with appropriate ARIA roles (`role='tablist'`, `role='tab'`, `aria-selected`, `aria-controls`) and strip default browser styling to preserve accessible functionality.
