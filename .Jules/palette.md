
## 2026-06-17 - Semantic HTML for Tab Toggles
**Learning:** When creating custom tab toggles (like Login vs Signup), using `<div>` elements with `onclick` handlers prevents keyboard accessibility. Using native `<button type="button">` elements with `role="tab"` and stripping default button styles provides better screen reader context while preserving custom aesthetics. It is also important to explicitly define `:focus-visible` to ensure clear keyboard navigation visibility.
**Action:** Always use native semantic elements like `<button>` for interactions, define ARIA roles (`tablist`, `tab`, `tabpanel`, `aria-selected`), and explicitly set `:focus-visible` outlines when overriding default browser styling.
