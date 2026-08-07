# Application Color System & Dark Mode Style Guide

This document outlines the standard color system and SCSS patterns used throughout the SiGma Angular Application. Use this reference when implementing or fixing light/dark mode (`[data-bs-theme='dark']`) across features and modules.

---

## 1. Overview & Selector Pattern

The application sets the Metronic Bootstrap 5 theme attribute `data-bs-theme="light"` or
`data-bs-theme="dark"` on the document `<html>` element. Component styles must not
assume that the attribute is on `<body>`.

In Angular component stylesheets (`*.component.scss`), wrap all dark mode overrides using the `:host-context` pseudo-class:

```scss
:host-context([data-bs-theme='dark']) {
  /* Dark mode styles here */
}
```

For child component / PrimeNG component overrides inside component SCSS:

```scss
:host-context([data-bs-theme='dark']) {
  ::ng-deep {
    /* PrimeNG or global child element overrides */
  }
}
```

Use component-scoped `::ng-deep` only for elements rendered inside the component.
PrimeNG overlays configured with `appendTo="body"` (dropdown panels, calendars,
dialogs, menus, and similar surfaces) must be themed from the global stylesheet
because they are rendered outside the component host.

---

## 2. Color Palette Reference

| Element Type | Light Mode | Dark Mode (`data-bs-theme='dark'`) | Notes / Purpose |
| :--- | :--- | :--- | :--- |
| **Page Canvas / Background** | `#f1f3f7` / `#f4f6f8` | `#111820` / `#16222d` | Main page body background |
| **Card / Surface Background** | `#ffffff` | `#19232d` / `#1d2a37` | Content cards, tab panels |
| **Sub-panel / Toolbar Surface** | `#fbfcfd` / `#f4f6f8` | `#151e27` / `#182631` | Search bars, filter rows, section headers |
| **Primary Borders** | `#e8edf2` / `#dce4eb` | `#2f4050` / `#344557` | Outer card borders, panel dividers |
| **Secondary Row Borders** | `#edf1f4` / `#e4eaef` | `#263544` / `#2d4050` | Table row borders, list item dividers |
| **Primary Text / Titles (H1)**| `#3f5871` / `#172332` | `#e4edf5` | Page titles, section headings |
| **Secondary Text / H2** | `#0f7375` | `#59d5dd` / `#78c9ed` | Subheaders, section labels; approved for normal text on the standard surface |
| **Muted Text / Subtitles** | `#5f7185` | `#9dafbf` / `#8194a5` | Meta info, placeholders, hints; do not use a lighter legacy value for normal text |
| **Body / Input Label Text** | `#48627d` / `#34495e` | `#cbd7e3` / `#e5edf4` | General text, form labels |
| **Primary Action (Save Blue)**| `#1478b5` (hover `#10699e`)| `#1773ae` (hover `#125f91`) | Main action buttons with white text |
| **Secondary Action (Teal)**| `#0f7375` (hover `#0b6062`)| `#126f75` (hover `#0d5f64`) | Secondary action buttons with white text |
| **Accent Active Tab Indicator**| `#0f7375` | `#31c4cf` | Active tab bottom bar; non-text contrast must remain at least 3:1 against its surface |
| **Input / Dropdown Background**| `#ffffff` | `#182631` | Form inputs, select dropdowns |
| **Input / Dropdown Border** | `#b9c7d2` (bottom `#2bc6d1`)| `#405364` (bottom `#25a4ad`)| Input outlines |
| **Input / Dropdown Focus Ring**| `rgb(49 196 207 / 10%)` | `rgb(49 196 207 / 20%)` | Focus halo border |
| **Blocking Validation / Field Error Text** | `#b4232d` | `#ff9aa2` | Required, invalid, or server-validation messages; must not rely on color alone |
| **Validation Summary Surface** | text `#a8343e`, border `#f1b8bd`, surface `#fff5f5` | text `#ffc4ca`, border `#70464e`, surface `#39262c` | Step-form summary shown when Save/Next is blocked |
| **Validation Count / Error Chip** | text `#9f303a`, border `#e29aa1`, surface `#ffe3e5` | text `#ffc4ca`, border `#70464e`, surface `#56343b` | Invalid-field count and clickable invalid-field items |
| **Temporary Invalid-Field Highlight** | `#e9a23b` | `#e9a23b` | Short focus/navigation highlight only; never use as error text |
| **Validation Error Icon** | `#df5662` | `#ef9da5` | Icon paired with the validation message |
| **Dropdown Trigger / Icon** | `#596d82` | `#9dafbf` | Caret icons, input icons |
| **Table Header Background** | `#f8fafc` | `#223443` / `#243441` | Table column headers |
| **Table Row Hover** | `#f1f5f9` | `#243746` | Data row hover background |
| **Scrollbar Thumb** | `#aab8c5` | `#3a4e62` | Custom scrollbar handle |
| **Scrollbar Track** | `#f4f6f8` | `#16222d` | Custom scrollbar channel |

Deprecated light-theme values:

| Value | Former use | Status |
|---|---|---|
| `#17a8aa` | Secondary normal text | Do not use on white; insufficient normal-text contrast |
| `#8294a8` | Muted normal text | Do not use on white; insufficient normal-text contrast |
| `#2f9ddd` | Button background with white text | Do not use for normal-size white button text |

These values may exist in legacy screenshots or code, but they are not approved
tokens for new work. Do not copy a deprecated value from an older feature.

---

## 3. Step-Form Validation Standard

Step-form validation that prevents Save or Next is an error state, not a
non-blocking warning. Use the red validation palette above for:

- the validation summary below the stepper;
- invalid-field count and clickable invalid-field items;
- field-level and row-level messages;
- invalid controls and server-validation feedback.

Use the amber highlight only while navigating to the invalid control. The
highlight is temporary and must be accompanied by a text message, an icon, or
an invalid control state.

Recommended component tokens:

```scss
.editor-page {
  --editor-error-text: #b4232d;
  --editor-error-border: #f1b8bd;
  --editor-error-surface: #fff5f5;
  --editor-error-chip-text: #9f303a;
  --editor-error-chip-border: #e29aa1;
  --editor-error-chip-surface: #ffe3e5;
  --editor-validation-highlight: #e9a23b;
}

:host-context([data-bs-theme='dark']) .editor-page {
  --editor-error-text: #ff9aa2;
  --editor-error-border: #70464e;
  --editor-error-surface: #39262c;
  --editor-error-chip-text: #ffc4ca;
  --editor-error-chip-border: #70464e;
  --editor-error-chip-surface: #56343b;
}
```

Example validation summary:

```scss
.editor-validation {
  border: 1px solid var(--editor-error-border);
  color: var(--editor-error-text);
  background: var(--editor-error-surface);
}

.editor-validation-count,
.editor-validation-field {
  border: 1px solid var(--editor-error-chip-border);
  color: var(--editor-error-chip-text);
  background: var(--editor-error-chip-surface);
}

::ng-deep .is-validation-target {
  border-color: var(--editor-validation-highlight) !important;
  outline: 3px solid rgb(233 162 59 / 18%) !important;
  box-shadow: 0 0 0 1px var(--editor-validation-highlight) !important;
}
```

The invalid state must also be communicated through `aria-invalid`, an
associated message, and keyboard focus/navigation. Color alone is not a
validation mechanism.

---

## 4. Semantic States and Interaction Rules

Use semantic state names rather than raw color names such as `red`, `green`, or
`orange`. A state must have a text color, surface, border, and interaction
behavior in both themes.

| State | Light Text / Surface / Border | Dark Text / Surface / Border | Use |
| :--- | :--- | :--- | :--- |
| **Success** | `#157347` / `#eaf8f1` / `#9ed8bd` | `#48d39b` / `#1b3a31` / `#397d65` | Completed or successfully saved |
| **Information** | `#1769aa` / `#eef8ff` / `#9ed3f0` | `#5ab0ff` / `#1c3446` / `#3c718f` | Informational status or help |
| **Warning** | `#67430f` / `#fff8e8` / `#efc171` | `#f2b84b` / `#382d1b` / `#8b6728` | Non-blocking caution |
| **Error** | `#b4232d` / `#fff5f5` / `#f1b8bd` | `#ff9aa2` / `#39262c` / `#70464e` | Invalid, failed, or destructive state |
| **Disabled** | `#738493` / `#eef3f6` / `#d0dbe3` | `#9baebb` / `#23333f` / `#405364` | Unavailable or read-only control |

Blocking validation must use **Error**, not **Warning**. Use **Warning** only
when the user can continue without correcting the condition.

Hover, focus, selected, and disabled states are separate states:

- `:hover` may change the surface, but must not be the only indication of
  selection.
- `:focus-visible` must retain a visible outline or ring and must not be
  removed with `outline: 0` unless an equally visible replacement is provided.
- Selected rows, tabs, and paginator pages need a persistent selected treatment
  distinct from hover. The shared `table-list` grid uses `.p-highlight`.
- Disabled controls must remain readable; do not depend on opacity alone.

The application uses `color-scheme: dark` for dark `table-list` surfaces. Keep
this declaration scoped to the dark themed surface so native controls do not
inherit an unintended theme.

---

## 5. Token Ownership and Style Boundaries

`src/styles.scss` is the global source of truth for styles that cross Angular
component boundaries:

- shared `table-list` grids and their PrimeNG table/paginator states;
- PrimeNG overlays appended to `body`;
- shared dropdown/select, calendar/datepicker, dialog, menu, and toast
  surfaces;
- global RTL positioning for portals and overlays.

Feature component SCSS owns the feature shell and may define feature aliases
such as `--staff-*` or `--individual-*`. New feature styles should reference
semantic application tokens instead of introducing another raw hexadecimal
value for the same role. A feature override must provide both light and dark
values and must not rely on component scope for a body-appended overlay.

The slash-separated values in the palette table document existing legacy
variants. They are not permission to add another alternative. For new code,
choose one canonical token per semantic role; when modernizing an existing
feature, replace repeated raw values with that feature's token aliases.

The actual grid selector is `table-list` with PrimeNG descendants such as
`.p-datatable`, `.p-paginator`, `.p-dropdown-panel`, and `.p-datepicker`.
Do not use `.data-table` as the project standard unless a legacy component
really contains that class.

---

## 6. Accessibility and Theme Verification

For every new or changed color pair:

- normal text must meet a contrast ratio of at least **4.5:1**;
- large text must meet at least **3:1**;
- focus indicators and other non-text state indicators should meet at least
  **3:1** against the adjacent color;
- error, success, selected, and warning states must include text, an icon,
  pattern, border, or another non-color cue.

Review each component in this matrix:

1. light, dark, and `system` theme modes;
2. empty, loading, success, warning, error, disabled, focused, and selected
   states;
3. inline validation, step-form summary, row validation, and server/API error
   feedback;
4. dropdown, calendar, dialog, menu, toast, and datepicker overlays;
5. keyboard navigation, visible focus, RTL layout, responsive widths, and
   `prefers-reduced-motion`.

The `system` mode resolves through `prefers-color-scheme`; the resolved value
must still be reflected by `data-bs-theme` on `<html>`. Reduced-motion rules
must disable or shorten validation highlights, spinners, and transitions without
removing the state itself.

---

## 7. Reusable SCSS Dark Mode Template

Copy and adapt this template when adding dark mode support to any component SCSS file:

```scss
:host-context([data-bs-theme='dark']) {
  /* 1. Page & Layout Containers */
  .page-container {
    color: #cbd7e3;
    background: #111820;
  }

  .page-header h1 {
    color: #e4edf5;
  }

  .page-header span {
    color: #9dafbf;
  }

  /* 2. Cards & Panels */
  .card-panel {
    border-color: #2f4050;
    background: #19232d;
    box-shadow: 0 4px 16px rgb(0 0 0 / 25%);
  }

  .filter-row,
  .toolbar-row {
    border-bottom-color: #2d4050;
    background: #151e27;
  }

  /* 3. Navigation Tabs */
  .nav-tabs {
    border-bottom-color: #2d4050;
    scrollbar-color: #3a4e62 #16222d;
  }

  .nav-tab {
    color: #9dafbf;

    &:hover,
    &:focus-visible,
    &--active {
      color: #e4edf5;
    }

    &--active::after {
      background: #31c4cf;
    }
  }

  /* 4. Search & Inputs */
  .search-box {
    border-color: #405364;
    background: #182631;

    &:focus-within,
    &--active {
      border-color: #31bfc9;
      box-shadow: 0 0 0 3px rgb(49 196 207 / 18%);
    }

    input {
      color: #e5edf4;

      &::placeholder {
        color: #8194a5;
      }
    }
  }

  /* 5. Scrollbars */
  .scrollable-area {
    scrollbar-color: #3a4e62 #16222d;

    &::-webkit-scrollbar-track {
      background: #16222d;
    }

    &::-webkit-scrollbar-thumb {
      background: #3a4e62;
    }
  }

  /* 6. Tables & PrimeNG Overrides */
  ::ng-deep {
    table-list .p-datatable {
      color: #cbd7e3;

      th {
        border-bottom-color: #2d4050;
        color: #59d5dd;
        background: #223443;
      }

      td {
        border-bottom-color: #263544;
      }

      tr:hover {
        background: #243746;
      }
    }

    /* PrimeNG dropdowns rendered inside the component */
    .p-dropdown {
      border-color: #405364;
      border-bottom-color: #25a4ad;
      color: #e5edf4;
      background: #182631;

      &:not(.p-disabled):hover,
      &:not(.p-disabled).p-focus {
        border-color: #31bfc9;
        box-shadow: 0 0 0 1px rgb(49 196 207 / 20%);
      }

      .p-dropdown-label {
        color: #e5edf4;

        &.p-placeholder {
          color: #8194a5;
        }
      }

      .p-dropdown-trigger {
        color: #9dafbf;
      }
    }
  }
}
```

---

## 8. Key Reference Files in Codebase

When needing a live reference, look at these standard implementations:
1. `src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.scss`
2. `src/app/modules/Customers/Individual/IndividualPartner/components/list/list.component.scss`
3. `src/app/modules/Accounts/Link Accounts/LinkAccounts/components/details/details.component.scss`
4. `src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.scss`
5. `src/styles.scss` for shared grids, PrimeNG overlays, toasts, calendars, and
   global dark-mode rules

The Companies step form reuses the Individual step-form validation palette:
red communicates blocking validation errors, while the amber
`#e9a23b` treatment is reserved for temporary navigation/focus highlighting.
