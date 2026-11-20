## 23. Translations

> **Status: Canonical**

### Database language switching
The shared TranslationService separates an explicit catalog/default refresh
from selecting an already loaded active language option in TopBar. Bootstrap,
Retry and language-management completion refresh options; an actual switch
reads a fresh runtime dictionary directly. Re-selecting the applied language
is a no-op only outside loading/error recovery and after its DB snapshot was
applied. Keep only the active DB language, cancel older intents and clear all
tenant/user snapshots on session exit. Index immutable original key paths on
registration rather than walking every shipped dictionary for each switch;
literal dots/ellipsis and unsafe-path validation retain their existing rules.
Do not replace freshness with a cross-language or time-based cache merely to
hide latency. Backend read batching belongs to BE5. Source review verifies
request shape, not a measured improvement; owner timings remain required.

After a text Save, a canonical nonblank, non-review override for the already
applied language may merge that one key into the active dictionary. Capture
the authenticated context before writing and require it still matches, with
no pending runtime switch/error. Use validated original paths and a one-key
merge, preserving other overrides. Never patch from an unsaved draft or an
original-filled dictionary. Empty/Reset/other-language cases resolve fallback
with a fresh runtime read, reusing loaded choices; API-only message edits need
no UI dictionary reload. Retry repeats only the failed application step.

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
| `partnerForm.enums.*`, `partnerForm.attachment` | neutral enum and attachment labels used by Individual, Company and driver drafts |
| `voucherTypeNames.*` | neutral journal-source labels, consumed by shared `voucherTypeText` (block16) |
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

**Interpolated numbers.** A parameter value must read correctly for every
number, including 1, 2, 3–10 and 11 or more. Arabic noun agreement changes with
the number and English adds a plural `s`, so write the number as a value after a
label or unit instead of before a counted noun: `'العمر بالسنوات: {{years}}'`,
`'Age (years): {{years}}'`, not `'{{years}} سنوات'` or `'{{years}} years'`.

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

**Parity check (read-only).** `recipe-system/Check-Translations.ps1` lists the keys missing
from `ar.ts`, the keys missing from `en.ts` (a raw key in English — severe) and case-only
differences. Run it for the blocks a review touched, for example:

```powershell
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Check-Translations.ps1' -Block job,validationMessages
```

The whole-file counts are volatile audit data (2026-10-01: about 1,570 keys missing from
`ar.ts`, 380 from `en.ts`, 5 case-only differences). Fix the blocks you touch; do not bulk-edit
other features. The misspelled `mangeDetails` namespace is legacy: keep it for existing keys,
and put new shared customer labels there only until a renamed block exists.

**Check:** key added to `en.ts` **and** `ar.ts` · `Check-Translations.ps1 -Block <touched blocks>` reports nothing · placed in the matching feature
block · reuses `general.*`/`mangeDetails.*`/`validationMessages.*` where one
exists · no literal English in a template · parameters use `{{name}}` and an
object argument.

**No built keys; one namespace per feature (G8, G11, 2026-10-01).** A translation key is
written in full in the template or the spec list, never concatenated from a control or enum
name, so that the parity check can find it.

A screen reads its own namespace plus the neutral shared ones (`general.*`, `mangeDetails.*`).
It never reads another feature's namespace, as Company does with `individualForm.enums.*`. A
key that two features need moves to a neutral namespace; partner enums go to
`partnerForm.enums.*`, created when the first screen moves.

---
