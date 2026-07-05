
## 2024-07-05 - Replacing div toggles with semantic buttons
**Learning:** Custom UI toggles (like login/signup tabs) built with `<div>` and `onclick` lack semantic meaning and block keyboard accessibility entirely. Adding `tabindex="0"` alone is insufficient as it doesn't convey state (`aria-selected`) or structure (`tablist`/`tabpanel`).
**Action:** Always use native `<button type="button">` for UI interaction elements, and explicitly map them to standard ARIA patterns (like tabs) with `role="tablist"`, `role="tab"`, and `role="tabpanel"` to ensure screen readers and keyboard users can effectively navigate multi-form layouts.
