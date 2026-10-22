
## 2024-10-22 - Roving Tabindex Implementation
**Learning:** When implementing custom roving tabindex controls (like custom tab toggles replacing default form links), it's crucial to explicitly call `.focus()` on the newly activated button within the event handler to ensure the visual state properly synchronizes with keyboard focus, especially when swapping `tabindex` attributes.
**Action:** Always ensure any roving tabindex implementation explicitly manages focus boundaries and leverages modulo arithmetic to wrap boundaries easily.
