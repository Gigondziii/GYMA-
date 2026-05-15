## 2024-05-15 - Interactive Element Semantics
**Learning:** Replaced visual div-based custom toggles on the authentication page with native semantic `button` elements, combined with ARIA `role="tab"` properties. This provides necessary focus navigation and interaction feedback out of the box that `div`s lack, without requiring custom JS to handle keyboard enter/space events.
**Action:** Use native interactive elements like `button` and explicitly handle stateful accessibility attributes (e.g., `aria-selected`) via JavaScript to ensure keyboard and screen-reader friendliness.
