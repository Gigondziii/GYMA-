## 2026-06-01 - Native Buttons and ARIA for Custom Tabs
**Learning:** Using `<div>` elements with `onclick` handlers for custom tab navigations (like login/signup toggles) breaks keyboard navigation and screen reader support.
**Action:** Always use native semantic `<button>` elements with `role="tab"` and update `aria-selected` dynamically. Strip default browser button styles explicitly and provide a clear `:focus-visible` state.
