## 23. Translations

> **Status: Canonical**

Two files are maintained:
`src/app/modules/i18n/vocabs/en.ts` and
`src/app/modules/i18n/vocabs/ar.ts`. The other five (`ch`, `de`, `es`, `fr`,
`jp`) are stubs — do not add feature keys to them.

Nested objects, one block per screen area:

```ts
companyPartners: {          // list screen
  title: 'Companies',
  manage: 'Manage Companies',
  addNew: 'Create New Company',
  confirmDeleteTitle: 'Delete Company',
  …
},
companyForm: {              // create/view/edit screen
  createTitle: 'Create New Company',
  viewTitle: 'View Company',
  editTitle: 'Edit Company',
  discardTitle: 'Discard changes?',
  …
},
```

Shared blocks to reuse instead of inventing keys:

| Block | Holds |
|---|---|
| `general.*` | save, cancel, close, delete, edit, add, next, previous, search, actions, success, code, exportExcel |
| `mangeDetails.*` | field labels shared across customer screens: firstName, mobileNo, email, documentType, cardNumber |
| `validationMessages.*` | required, email, expiryAfterIssueDate |
| `sideMenu.*` | navigation entries |

Naming: `<feature>` for the list, `<feature>Form` for the editor. Suffix
conventions — `Title`, `Hint`, `Description`, `Placeholder`, `Error`, plus
`confirmDelete{Title,Subtitle,Question,Warning}`.

Parameters use double braces and are passed as an object:

```ts
invalidFields: '{{count}} invalid fields',
```
```html
{{ 'companyForm.invalidFields' | translate: { count: invalidFields().length } }}
```

**`en` is the fallback language** (`setDefaultLang('en')` in
`translation.service.ts`). Consequences:

- a key missing from **`en`** renders as the raw key for English and for any
  active language that also lacks the key. An active language with its own value
  can still resolve it, but the fallback is broken — this is the severe case;
- a key missing from **`ar`** falls back to English text, which looks
  untranslated but is not broken.

Add every new key to **both** `en.ts` and `ar.ts` in the same edit. Translation
coverage counts are volatile audit data, not a canonical implementation rule;
recompute them when auditing language coverage instead of copying a historical
count into a feature decision. Any missing `ar` key still falls back to English
and remains translation debt even when the UI does not render a raw key.

**Watch the casing, and watch the block.** The two files drift on both. The
credit-card header asked for `mangeDetails.cVV`; `en.ts` had `cVV` but `ar.ts`
had only `cvv`, so Arabic silently fell back to English. Confirm the enclosing
block before adding a key — `cvv` also exists under `statementOfAccount`, and
dropping a key into the wrong block looks correct in a diff but never resolves.

One oddity to know: some keys are literal English sentences, e.g.
`'Please wait...': 'Please wait...'`. It resolves and is used in dialog loading
states, so leave it alone.

**Check:** key added to `en.ts` **and** `ar.ts` · placed in the matching feature
block · reuses `general.*`/`mangeDetails.*`/`validationMessages.*` where one
exists · no literal English in a template · parameters use `{{name}}` and an
object argument.

---

