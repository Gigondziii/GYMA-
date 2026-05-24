## 2024-05-24 - Interactive Form Tabs Must Use Buttons
**Learning:** In the authentication form (`login.html`), using `<div>` elements with `onclick` handlers for the custom "Log In" / "Sign Up" toggle tab prevented keyboard users from accessing the toggle and lacked semantic meaning for screen readers.
**Action:** When implementing custom tab toggles, always use native `<button>` elements with appropriate ARIA roles (`role='tablist'`, `role='tab'`, `aria-selected`, `aria-controls`) and strip default browser styling to preserve accessibility without compromising the visual design.
