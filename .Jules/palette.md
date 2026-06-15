## 2025-02-23 - Interactive UI Div Elements
**Learning:** Found custom tab controls in the authentication form (login vs signup) built using `<div>` tags with `onclick` handlers, lacking proper keyboard accessibility, focus states, and semantic ARIA roles.
**Action:** Replace `<div>` interactive controls with native `<button type="button">` elements to ensure keyboard accessibility. Apply `role="tablist"` and `role="tab"`, strip default browser styling, and add explicit `:focus-visible` states using the existing `#00ff41` theme color. Ensure dynamic `aria-selected` toggling in JavaScript.
