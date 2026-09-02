
## 2024-05-18 - [Custom Tab Controls Accessibility]
**Learning:** Replacing div-based custom toggles with native button elements requires explicitly stripping default browser button styles (like background, border, outline) and redefining `:focus-visible` to maintain visual consistency while ensuring keyboard accessibility.
**Action:** When converting static UI elements to interactive buttons, strictly apply CSS resets (`background: none; border: none; outline: none;`) to the custom classes and implement standard WAI-ARIA tabbed navigation patterns (roving tabindex with Left/Right arrow key events).
