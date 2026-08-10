## 2024-10-24 - Custom Tab Toggles Accessibility
**Learning:** Custom tab toggles implemented as `<div>` elements completely break keyboard navigation and screen reader support, leaving users unable to switch forms.
**Action:** Always replace `<div>` based tab toggles with native `<button type="button">` elements equipped with `role="tab"`, appropriate `aria-selected` attributes, and implement roving `tabindex` with Arrow Key navigation support to adhere to standard ARIA tab patterns.
