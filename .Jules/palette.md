## 2024-03-24 - Accessible Tab Toggles
**Learning:** Custom UI tabs built with `div` tags lack semantic meaning and keyboard navigability, breaking accessibility for keyboard and screen reader users. Roving tabindex is essential for a11y.
**Action:** Always replace `<div>` custom tabs with native `<button type="button">`, adding `role="tab"`, `aria-selected`, `aria-controls`, and `role="tabpanel"` on their containers. Implement a roving tabindex (0 for active, -1 for inactive) and arrow-key navigation. Strip default button styles to match the original design.
