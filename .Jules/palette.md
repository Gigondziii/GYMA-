## 2024-05-24 - Custom Tab Accessibility
**Learning:** Custom UI tabs built with generic `<div>` elements often break keyboard navigation and lack screen reader context, frustrating users who rely on assistive technology or keyboard shortcuts.
**Action:** Replaced `<div>` with native `<button>` tags, stripped default browser styling, and implemented standard WAI-ARIA tab patterns (tablist, tab, tabpanel) along with a roving tabindex and arrow-key navigation for a seamless, accessible experience.
