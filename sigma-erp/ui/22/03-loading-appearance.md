<!-- Part of UI block 22: see ../22-loading-empty-error-toast.md. Same status and authority as the block. -->

### Shared loading appearance

One appearance, owned by the single critical stylesheet in the `src/index.html`
head (`sigma-loading-indicator`, `sigma-loading-status`, `sigma-loading-card`,
`sigma-loading-overlay`), so startup can use it before Angular without a CSS/JS
request. StateMessage stays the translated semantic loading/error/empty owner;
LayoutComponent owns the single content overlay. All consumers inherit it
without opt-in; features never copy loading markup, keyframes, ring borders or
palettes.

- **State ring:** decorative primary-colored ring above its translated label,
  14px gap, 14px medium-weight text, 36px ring (3px border, 900ms rotation); the
  inner decorative ring is shared. Empty/error states keep their icon/row layout.
- **Shell overlay:** 20px inset padding, surface at 65% opacity, 3px backdrop
  blur; a card of at most 240px, 16px radius, Sigma border/surface/shadow, 28px
  24px padding; the shell sets the ring to 44px through
  `--sigma-state-loading-size`; padding uses `--sigma-state-loading-padding`;
  `--sigma-loading-color` serves contrast (solid buttons use currentColor).
- **Inline modifier:** the same ring at 1em/2px border with a 2px inner inset —
  never a second glyph/animation.
- **Short regions:** the absolute/fixed overlay is a named size container with
  zero-minimum grid tracks. At region height ≤160px use a horizontal 28px
  ring/text row, 8px 12px padding, zero minimum status height and no inner card
  scrollbar; at ≤56px a 20px ring and 4px 8px padding. Long compact labels
  ellipsize while keeping full accessible text and translated title.
  EditorDialog's save overlay uses 8px inset padding.
- **Local dialog progress:** ordinary local loading StateMessages inside PrimeNG
  dialogs use a horizontal 28px ring/label, 8px gap, 8px 12px padding, 12px text
  with 1.4 line-height and zero minimum height; hosts carrying
  `sigma-loading-card` keep the region-sized policy. Long local labels wrap with
  full accessible text/title; do not add containment or fixed height to
  intrinsically sized dialog content to shrink loading.
- **Startup:** static startup uses the same classes with a readable label and a
  fixed startup placement modifier; Angular's body-root bootstrap owns
  replacement; no splash service/timer (UI29 explains the inline placement).
- **Shared controls:** PrimaryActionButton's local loading, DataTable's
  loadingicon template, header branch/background-refresh indicators,
  Login/Registration pending controls and FileField's upload control render the
  same ring (currentColor). PrimaryActionButton's legacy `loadingIcon` input is
  accepted but selects no competing visual. Ordinary Refresh/Retry/action icons
  are unchanged. PendingMotion's decorative data placeholders/counts are separate
  from request loading (UI24). The `sigma-spinner` skin, `modern-spinner`,
  `pulseText` and `charge-settings-spin` are retired.

Consume UI24 theme tokens and UI25 logical sizing. Decorative rings are
aria-hidden; the real status/aria-busy belong to the consuming request/control.
Stop rotation for reduced motion; forced colors use system colors; bound long
labels/card overflow within the region; hide the global overlay in print. Never
solve geometry with a feature spinner, fixed modal height or hidden form content.
