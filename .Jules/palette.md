## 2024-05-24 - Semantic HTML for Custom Tabs
**Learning:** The application uses custom tab toggles (login vs signup) built with `<div>` elements and `onclick` handlers, which completely breaks keyboard accessibility and screen reader support for a critical authentication flow.
**Action:** Always use native `<button>` elements with `role="tablist"`, `role="tab"`, `aria-selected`, and `aria-controls` for custom tab implementations, and strip default browser styling to maintain visual design while ensuring keyboard navigability.
