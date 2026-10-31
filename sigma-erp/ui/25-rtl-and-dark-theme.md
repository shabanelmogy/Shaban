## 25. RTL and dark theme

> **Status: Canonical**

`TranslationService.checkAndRemoveElement()` owns direction. After authentication,
the selected catalog language's `isRightToLeft` metadata sets `dir` on `<html>`
and `<body>` and loads/removes `assets/css/style.rtl.css`. Before authentication,
the shipped catalog identifies Arabic as RTL. This supports added RTL languages
without feature-local language tests. Features must not add their own direction
flag. Language selection, stale request cancellation and session dictionary
replacement belong to the same TranslationService owner; source dictionaries
remain pre-login/recovery values. Runtime/theme acceptance remains owner work.

The RTL asset is generated through assets/sass/style.rtl.scss,
which uses the same native Sigma style.scss theme, with
scripts/build-rtl.mjs (npm run rtl). Its explicit Sass/rtlcss
dependencies replace the old Webpack loader pipeline. Write only the known
assets/css/style.rtl.css file; never delete the output directory after emitting.
Preserve applicable license comments and deterministic output, and use npm run rtl:check to
detect drift. The generated asset has a scoped LF rule in .gitattributes so
Windows autocrlf does not create false byte-for-byte drift after checkout.
The language service keeps its existing dynamic link and direction
contract. Regenerate after theme/layout imports change; inspect retained CSS
semantics and exercise the shell with the RTL stylesheet actually loaded.
After complete vendor retirement (owner2026-10-22), the native logical-end utility
uses inset-inline-end. The old physical end-0 selector and sigma-rtl-compat patch
are removed together; do not restore competing left/right declarations. Exercise
the actual linked RTL asset together with global styles in both load orders and
directions. Theme mode remains on data-bs-theme; theme image and transition
attributes and the change event are now Sigma-owned (UI24).

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

