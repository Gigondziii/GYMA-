## 2023-10-23 - Accessible Tab Implementations
**Learning:** Custom UI tabs often use `<div>` elements, which lack native keyboard support and semantic meaning. Screen readers fail to announce their relationships without ARIA roles.
**Action:** When implementing custom tabs, always convert `<div>` to `<button type="button">`, strip default styles, add `role="tablist"`/`role="tab"`/`role="tabpanel"`, use `aria-controls` and `aria-labelledby`, and implement a roving tabindex with arrow key navigation to ensure full accessibility.
