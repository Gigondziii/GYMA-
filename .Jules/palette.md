
## 2026-05-31 - [Interactive Tabs Accessibility]
**Learning:** Found an accessibility issue pattern specific to custom UI components on the platform where visual "tabs" are implemented using non-semantic `<div>` elements with standard inline `onclick` handlers, bypassing native keyboard navigation and missing necessary ARIA descriptions.
**Action:** Always verify custom component interactivity is wrapped inside semantic elements like `<button>` and enforce standard ARIA structures (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`) with a clear `:focus-visible` state instead of recreating click behavior on block elements.
