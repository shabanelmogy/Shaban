# Application Color System & Dark Mode Guidelines

This document outlines the standard color system and SCSS patterns used throughout the SiGma Angular Application. Use this reference when implementing or fixing dark mode (`[data-bs-theme='dark']`) across features and modules.

---

## 1. Overview & Selector Pattern

The application uses Metronic Bootstrap 5 theme attribute `data-bs-theme="dark"` set on `<html>` or `<body>`.

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
| **Secondary Text / H2** | `#17a8aa` | `#59d5dd` / `#78c9ed` | Subheaders, section labels |
| **Muted Text / Subtitles** | `#8294a8` / `#73879a` | `#9dafbf` / `#8194a5` | Meta info, placeholders, hints |
| **Body / Input Label Text** | `#48627d` / `#34495e` | `#cbd7e3` / `#e5edf4` | General text, form labels |
| **Primary Action (Save Blue)**| `#2f9ddd` (hover `#178fce`)| `#1f85c7` (hover `#1773ae`) | Main action buttons |
| **Secondary Action (Teal/Cyan)**| `#2db7c1` (hover `#249fa8`)| `#259aa3` (hover `#1e878f`) | Add buttons, active indicators |
| **Accent Active Tab Indicator**| `#31c4cf` | `#31c4cf` | Active tab bottom bar |
| **Input / Dropdown Background**| `#ffffff` | `#182631` | Form inputs, select dropdowns |
| **Input / Dropdown Border** | `#b9c7d2` (bottom `#2bc6d1`)| `#405364` (bottom `#25a4ad`)| Input outlines |
| **Input / Dropdown Focus Ring**| `rgb(49 196 207 / 10%)` | `rgb(49 196 207 / 20%)` | Focus halo border |
| **Dropdown Trigger / Icon** | `#596d82` | `#9dafbf` | Caret icons, input icons |
| **Table Header Background** | `#f8fafc` | `#223443` / `#243441` | Table column headers |
| **Table Row Hover** | `#f1f5f9` | `#243746` | Data row hover background |
| **Scrollbar Thumb** | `#aab8c5` | `#3a4e62` | Custom scrollbar handle |
| **Scrollbar Track** | `#f4f6f8` | `#16222d` | Custom scrollbar channel |

---

## 3. Reusable SCSS Dark Mode Template

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
    .data-table {
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

    /* PrimeNG Dropdowns */
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

## 4. Key Reference Files in Codebase

When needing a live reference, look at these standard implementations:
1. `src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.scss`
2. `src/app/modules/Customers/Individual/IndividualPartner/components/list/list.component.scss`
3. `src/app/modules/Accounts/Link Accounts/LinkAccounts/components/details/details.component.scss`
