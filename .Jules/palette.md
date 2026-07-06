## 2025-02-18 - Semantic Custom Tab Toggles
**Learning:** When replacing native form toggle elements with custom styled components, missing semantic HTML and ARIA roles (like `role="tab"` instead of `<div>`) breaks screen reader accessibility and keyboard navigation functionality.
**Action:** Always use native `<button type="button">` for interactive toggles, strip default styling via CSS rather than using `<div>`, explicitly set `:focus-visible` states, and implement `role="tablist"`, `role="tab"`, `role="tabpanel"`, and `aria-selected` attributes for custom tab switches.
