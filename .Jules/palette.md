## 2024-11-04 - Authentication Toggle Tabs Accessibility
**Learning:** Custom `<div>` elements used as tab toggles are inaccessible to screen readers and keyboard users.
**Action:** Always replace custom div toggles with native `<button>` elements possessing `role="tab"`, use `role="tablist"` for the container, implement a roving tabindex (0/-1), update `aria-selected` dynamically, and bind `keydown` listeners for Arrow Left/Right keyboard navigation to ensure robust accessibility compliance.
