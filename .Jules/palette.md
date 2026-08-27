
## 2024-05-15 - Accessible custom form toggles
**Learning:** When using visually styled custom toggles (like log in/sign up switches) instead of native tabs, they must act identically to native elements. Replacing `<div>` with `<button type="button">`, stripping default browser styles, implementing roving tabindex, and ensuring Arrow-key navigation is crucial for making them accessible to screen readers and keyboard users without breaking the design.
**Action:** When implementing custom toggle/tab interfaces, always start with native `<button>` elements, use ARIA `role="tab"` and `role="tabpanel"`, and manage keyboard navigation with roving tabindex rather than making `<div>`s interactive.
