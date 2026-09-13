
## 2023-10-27 - Accessible Custom Toggle Switches
**Learning:** Custom UI toggle switches (like "Log In" / "Sign Up") are often built using styled `<div>` elements with `onclick` handlers, rendering them inaccessible to keyboard users and screen readers.
**Action:** When implementing or refactoring custom toggle switches, always use native `<button type="button">` elements with default styling stripped out. Implement a roving `tabindex` (`0` for active, `-1` for inactive), use ARIA tab roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`), and provide arrow key navigation for switching tabs. This ensures proper keyboard navigation and screen reader semantics without breaking the visual design.
