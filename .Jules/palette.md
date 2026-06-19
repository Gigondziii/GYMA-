## 2026-06-19 - Tab Toggle Accessibility
**Learning:** Custom UI toggles (like login/signup switches) are often built with `<div>` elements, stripping keyboard accessibility and screen reader support.
**Action:** Always replace interactive `<div>` elements serving as tab toggles with native `<button type="button">`. Manage tab interactions by adding `role="tablist"` to the container, `role="tab"` & `aria-selected` (dynamically updated) to the buttons, and `role="tabpanel"` & `aria-labelledby` to the corresponding content containers.
