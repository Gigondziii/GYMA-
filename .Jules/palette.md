## 2024-11-20 - Custom Tab Toggles in Authentication Form
**Learning:** The authentication form used `<div>` elements with `onclick` handlers for its "Log In" / "Sign Up" toggle switch. This completely hides the interactive element from keyboard users and screen readers, as a `<div>` is neither focusable nor recognized as an interactive role by default.
**Action:** When implementing custom toggle switches or tabbed interfaces, always use native `<button>` elements with `role="tab"`, strip out default styling, and explicitly toggle `aria-selected` to indicate state.
