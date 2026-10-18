
## 2024-10-18 - Accessible Tab Toggles
**Learning:** Custom UI tabs built with `div` elements are entirely invisible to screen readers and keyboard users.
**Action:** Always convert custom `div` tabs into native `<button>` elements, implementing the full WAI-ARIA tab pattern (`role="tablist"`, `role="tab"`, `role="tabpanel"`) alongside a roving tabindex and arrow-key event listener to ensure complete keyboard and screen reader accessibility.
