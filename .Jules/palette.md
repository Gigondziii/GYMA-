## 2026-05-20 - Semantic Accessible Tabs
**Learning:** Implementing custom tabs with generic div tags and onclick handlers breaks keyboard navigation and screen reader support. Native <button> elements with ARIA roles (tablist, tab, aria-selected, aria-controls) natively provide accessibility out of the box while easily mimicking div styles via CSS resets.
**Action:** Always prefer native interactive elements (<button>, <a>) paired with proper ARIA attributes over generic tags with click handlers.
