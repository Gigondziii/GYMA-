## 2024-05-14 - Replace div toggles with semantic buttons
**Learning:** Found an accessibility issue pattern in the app where interactive toggles (like login/signup tabs) were implemented using `<div>` with `onclick` handlers, missing keyboard navigability and focus styling.
**Action:** Always use semantic native interactive elements (e.g., `<button type="button">`) for any clickable UI components to ensure keyboard accessibility, focus management, and screen reader compatibility right out of the box.
