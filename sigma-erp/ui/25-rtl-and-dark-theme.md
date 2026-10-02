## 25. RTL and dark theme

> **Status: Canonical**

`TranslationService.checkAndRemoveElement()` owns direction. Selecting `ar`
sets `dir="rtl"` on `<html>` and `<body>` and injects
`assets/css/style.rtl.css`; any other language removes it. Features must not
add their own direction flag.

Write layout with logical properties so both directions work from one rule:

```scss
margin-inline-start: 8px;
padding-inline: 12px;
inset-inline-end: 10px;
text-align: start;
```

`app-primary-action-button` owns RTL flipping for its directional arrows. Flip
only remaining directional arrows, never semantic icons, numbers or text:

```scss
:host-context([dir='rtl']) {
  .feature-secondary-action .bi-arrow-left {
    transform: rotate(180deg);
  }
}
```

Dark theme keys off `data-bs-theme` on `<html>`. A feature that uses the global `--sigma-*`
tokens (block 24) gets dark mode with **no** rule of its own. Only a feature-owned domain token
needs a dark value, and in component SCSS that needs `:host-context`:

```scss
:host-context([data-bs-theme='dark']) {
  --vehicle-status-reserved: #f0b35a;   // a real domain colour, not a palette copy
}
```
 Body-appended overlays
use the global `[data-bs-theme='dark'] .<overlay-style-class>` form from block
24 instead.

The shared `app-data-table` owns table-level dark-theme defaults under its
`:host-context([data-bs-theme='dark'])` boundary. A feature that overrides a
public `--sigma-data-table-*` color variable must override that same variable
for dark theme. The legacy global `table-list` rules are compatibility only and
are not an implementation reference.

**Check:** no hard-coded `left`/`right` in feature layout · only arrows flipped · global
`--sigma-*` tokens used, dark values only for feature-owned domain tokens · body-appended overlays checked
in both directions and themes · Arabic text not mirrored.

---

