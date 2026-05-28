## 2024-05-15 - Interactive Toggles Require Semantic Elements
**Learning:** Using `<div>` elements with `onclick` for toggles completely breaks keyboard accessibility, as they lack focus states and cannot be navigated via the Tab key.
**Action:** Always use native `<button>` elements with `role="tab"` and `:focus-visible` styling when building custom tab toggles to ensure keyboard navigation and screen reader support.
