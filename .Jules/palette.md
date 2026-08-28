## 2024-05-18 - Native Buttons for Custom Tab Toggles
**Learning:** When building custom tab toggles (like in auth forms) using `<div>` elements, they completely break keyboard navigation and screen reader semantics.
**Action:** Always use native `<button type="button">` elements with proper ARIA tab roles (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`), implement a roving tabindex (0 and -1) backed by JS arrow key navigation, and add a clear `:focus-visible` outline. Use CSS to strip the default browser button styling to match the original design.
