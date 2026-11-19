# Translation duplicate-key fix

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Reported TS1117 errors for mangeDetails.label and mangeDetails.isPrimary in en.ts |
| Contract | Keep one definition of each existing key; preserve translation paths and the existing Primary Address wording |

## Change

Removed the later label and isPrimary declarations in the PartnerAddress comment block of
src/app/modules/i18n/vocabs/en.ts. Both keys already existed earlier in the same mangeDetails
object. The earlier values remain Label and Primary Address; Arabic already defines each key
once (الوصف and العنوان الأساسي), so ar.ts needs no edit. The addressLine entry is retained.

This applies existing UI block 23 and skill section 9 duplicate-prevention rules; no new
reusable rule, component, schema, API, mapper, grid, calculation or business action is needed.
Phase 0/1: confirmed the duplicated keys and unchanged contract. Phase 5: corrected the
dictionary declarations. Phase 6: source reconciliation; other phases are not applicable.
Root-only fix: two local key removals do not warrant delegation.

## Verification

- Confirmed each reported key appears once in mangeDetails in both languages; the original
  existing wording is retained. Reviewed the full en.ts diff, preserving earlier changes.
- git diff --check passed for en.ts.
- Check-Translations.ps1 -Block mangeDetails completed. The two corrected keys have parity.
  Existing block-wide debt remains: 763 missing Arabic keys, 57 missing English keys and six
  case-only differences. Those unrelated translations were not changed by this fix.
- Build and runtime are owner-only under AGENTS.md and were not run.
- Generated recipe drift: all eight packets stale; canonical UI block 23 used;
  regeneration and semantic review pending. No generated packet was edited.

Migration: none. Suggested frontend commit: fix(i18n): remove duplicate partner address keys.
