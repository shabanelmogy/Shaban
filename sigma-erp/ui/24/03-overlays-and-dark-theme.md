<!-- Part of UI block 24: see ../24-colors-icons-buttons.md. Same status and authority as the block. -->

### Where body-appended overlay styles belong

A `p-dialog`, dropdown panel or calendar with `appendTo="body"` is moved outside
the component's host element. It therefore **cannot** be styled by
component-scoped rules and does **not** inherit `:host` custom properties.
`:host ::ng-deep .my-dialog` will not match it.

Ownership rule:

| Concern | Where it lives |
|---|---|
| Overlay shell: width, radius, header/body/footer chrome | global `src/styles.scss`, scoped by the overlay's unique `styleClass` |
| Overlay dark theme | global `src/styles.scss` under `[data-bs-theme='dark'] .my-dialog` |
| Overlay RTL | global `src/styles.scss` under `[dir='rtl'] .my-dialog` |
| Overlay z-index / stacking | global `src/styles.scss` |
| Content inside the overlay that is still part of your component template | component SCSS, plus the variables redeclared on the overlay root |

`src/styles.scss` already carries the shared body-appended dialog and dropdown
overlay rules. Put new overlay rules beside the matching existing rules rather
than recording volatile selector counts or fighting encapsulation with
`::ng-deep`.
`app-data-table` content remains owned by its shared component and follows
block 6.

Always give the overlay a unique `styleClass` so the global rule cannot leak to
every dialog in the app.


### Dark theme selector inside a component

For an **ordinary component** element, `[data-bs-theme='dark']` written inside
component SCSS will not match, because the attribute sits on `<html>` which is
outside the component's scope. Use `:host-context`:

```scss
:host-context([data-bs-theme='dark']) {
  --vehicle-status-reserved: #f0b35a;   // a feature-owned domain token only (block 25)
}
```

Use the bare `[data-bs-theme='dark'] …` form only in **global** `styles.scss`,
where it is the correct selector for body-appended overlays. Feature-owned
direct table rules use `:host-context([data-bs-theme='dark'])`.

EditorDialog workflow footer actions use its public typed `footerActions` /
`footerActionRequested` contract (UI13). Shared secondary-button geometry,
wrapping, icons, focus, RTL and theme apply; the feature supplies translated
content and state, never copied footer markup or a separate button palette.
Empty actions retain the existing footer.
The shared footer group wraps with min-width0/end alignment and the existing8px
gap. The global app-editor-dialog body-overlay selector mirrors Previous/Next
chevrons in RTL; a feature-host selector cannot target the moved overlay.

**Check:** shared primary component, `sigma-secondary-button` and `sigma-danger-button`
instead of raw Bootstrap or feature-local button classes · colours from the global
`--sigma-*` tokens, no feature palette · glyph white on solid · loading disables double execution · both
themes declared · dialog variables declared on the overlay class ·
`aria-hidden` and `aria-label` correct.

---
