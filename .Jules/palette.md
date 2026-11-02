## 2024-11-02 - Custom Tab Authentication Forms Keyboard Accessibility
**Learning:** Roving tabindex for custom tablist elements using binary arrays works robustly with explicit modulo arithmetic for arrow-key boundary wrapping, as it avoids complex conditional nesting and simplifies keyboard navigation logic.
**Action:** Use modulo math `(currentIndex + 1) % array.length` and `(currentIndex - 1 + array.length) % array.length` alongside `.focus()` calls when creating accessible custom tabs to maintain synchronization between DOM focus and logical state.
