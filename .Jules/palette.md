## 2026-07-17 - Accessible Tabs Implementation
**Learning:** For custom tab toggles mimicking radio behaviors, using native `<button type="button">` elements with explicit `role="tab"` and implementing a roving `tabindex` (0/-1) is crucial for screen reader compatibility and keyboard navigation. Using `e.preventDefault()` on arrow keys prevents page scrolling.
**Action:** Always implement ARIA tablist/tab/tabpanel roles and roving tabindex when creating custom tab UI components instead of using `div` with `onClick`.
