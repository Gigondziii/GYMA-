## 2026-06-03 - Native Buttons for Custom Tabs
**Learning:** When creating custom tab components (like a login/signup toggle), using `<div>` with `onclick` prevents keyboard navigation and screen reader support. Native `<button type="button">` elements combined with proper ARIA roles (`tablist`, `tab`, `tabpanel`) and attributes (`aria-selected`, `aria-controls`) are necessary for accessibility.
**Action:** Always use native interactive elements (`<button>`, `<a>`) for custom controls, strip default styling if needed, and ensure explicit `:focus-visible` states are provided.
