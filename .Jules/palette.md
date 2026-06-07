## 2024-05-24 - Accessible Toggles
**Learning:** Custom UI toggles built with `<div>` elements lack inherent keyboard accessibility, ignoring `Tab` navigation and making them unusable for non-mouse users. Screen readers also struggle without semantic roles.
**Action:** Always replace `<div>` toggles with native `<button type="button">`, attach `role="tablist"` and `role="tab"` ARIA properties, use `aria-controls` for relationships, and explicitly manage `:focus-visible` for keyboard interaction states while dropping mouse outlines.
