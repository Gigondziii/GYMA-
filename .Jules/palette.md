## 2024-05-24 - Interactive Form Tabs Lack Native Accessibility

**Learning:** Custom tab components built with `<div>` elements and basic `onclick` handlers are a common pattern in standalone HTML pages but inherently break keyboard navigation and screen reader support, forcing reliance purely on mouse interaction.
**Action:** When creating custom tab toggles (like Log In/Sign Up switches), always replace `<div>` with native `<button type="button">` elements styled to remove default browser appearance (`background: none; border: none; outline: none;`). Ensure proper `role="tablist"`, `role="tab"`, roving `tabindex`, and arrow-key event listeners are implemented for full keyboard accessibility, along with explicit `:focus-visible` outlines using the design system's primary accent color.
