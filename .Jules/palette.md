
## 2026-09-07 - Native Buttons for Tab Navigation
**Learning:** When creating custom tab toggles (like the login/signup switcher), using native `<button type="button">` elements combined with `role="tab"` and `role="tablist"` provides robust accessibility while allowing complete stylistic freedom (by stripping default styles). Implementing a roving tabindex alongside arrow key navigation ensures screen reader and keyboard users can seamlessly navigate the tabs without relying on mouse clicks.
**Action:** Always replace `<div>` based interactable tabs with native `<button>` tags stripped of default styling, explicitly assign ARIA tab roles, manage `aria-selected` and `tabindex` states synchronously, and handle keyboard `keydown` events for arrow navigation.
