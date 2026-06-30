## 2026-06-30 - Accessible Tab Toggles
**Learning:** Custom tab toggles built with `<div>` elements require explicit ARIA roles (tablist, tab, tabpanel), states (aria-selected), and semantic `<button type="button">` elements to ensure proper keyboard navigation and screen reader support without triggering accidental form submissions.
**Action:** When implementing custom tab UI components, always use native `<button type="button">` elements for toggles, strip default browser styling, define `:focus-visible` styles for keyboard visibility, and implement full ARIA tabbed interface patterns.
