## 2024-05-18 - Auth Toggle A11y
**Learning:** Custom UI tabs built with `div` tags completely break screen reader navigation and keyboard interactions.
**Action:** When creating custom tab controls (like login/signup toggles), always convert `div` elements to native `<button type="button">`, strip default browser styling via CSS, add correct ARIA roles (`tablist`, `tab`, `tabpanel`), and implement roving tabindex logic to ensure seamless keyboard and screen reader support.
