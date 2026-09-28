## 3. Header

> **Status: Canonical**

Always `app-feature-title` with the Create button in its slot. Never a second
title in the Metronic toolbar.

`app-feature-title` owns the title inset: 8px from the panel's top, left, and
right edges with 16px separation below, matching the component host margin. A
feature must not compensate by re-padding the title or the panel; where the
title needs a compensating offset, match the responsive panel padding instead.

Import `PrimaryActionButtonComponent` in the standalone feature and use the
shared primary action from block 24. The feature supplies translated content
and behavior; it does not recreate primary-button markup or styling.

Snippets in the main-page blocks use the neutral `feature-*` prefix. Replace
`feature` with the owning feature name (`fleet-*`, `warehouse-*`, and so on);
never copy another feature's prefix.

```html
<section class="feature-page">
  <div class="feature-panel">
    <app-feature-title
      [title]="'companyPartners.title' | translate"
      [subtitle]="'companyPartners.manage' | translate"
      icon="bi bi-buildings"
    >
      <app-primary-action-button
        [label]="'companyPartners.addNew' | translate"
        (pressed)="openCreate()"
      />
    </app-feature-title>
```

The solid title-icon tile is owned by `app-feature-title`. Its glyph must be
explicitly white by targeting the nested `i` element; feature pages must not
recreate or override that styling. The same explicit-white rule applies to the
icon inside the solid Create button.

A screenshot-confirmed Create action is a functional requirement, not optional
decoration. Do not omit it merely because the write contract is initially
missing, and do not ship it as a disabled or nonfunctional placeholder. When
backend work is in scope, finish Phase 1 and freeze the Add contract before
wiring the editor and enabled Save action. When backend work is outside scope,
record the Add contract as Missing and report the feature blocked instead of
silently changing the demonstrated workflow.

**Check:** icon set · title and subtitle translated · Create inside
`app-feature-title` · 8px inset with 16px separation below · white glyph in the
solid title-icon tile · white glyph on the solid Create button.

---

