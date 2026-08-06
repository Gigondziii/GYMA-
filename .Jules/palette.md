## 2024-10-25 - Custom Tab Toggles Need Native Buttons and ARIA

**Learning:** Upgrading custom `<div>` tab toggles to semantic `<button>` elements improves screen reader access, but requires explicitly stripping browser styles (like `background`, `border`, `outline`) and defining custom `:focus-visible` states to preserve the visual design. Keyboard accessibility (arrow key navigation) must be manually implemented alongside dynamic `aria-selected` and `tabindex` state synchronization to maintain a proper ARIA tablist pattern.

**Action:** When converting custom UI toggles into accessible tabs, use `type="button"`, add `role="tablist"`/`role="tab"` attributes, implement roving `tabindex` paired with a keyboard event listener for arrow navigation, and ensure `:focus-visible` provides clear visual feedback for keyboard users.
