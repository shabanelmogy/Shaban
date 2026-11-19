# HRM overtime integrity — implementation notes

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Contract | `HRM_DATA_INTEGRITY_CONTRACT_FREEZE.md` |

## Implemented boundary

- `StaffOvertimePolicy` now owns the persisted limits for `decimal(22,6)` hours and `decimal(18,2)` money.
- `TryCalculateHoursAmount` rejects negative or out-of-capacity hours, negative/out-of-capacity rates, rates beyond the frozen two-decimal scale, arithmetic overflow, and rounded amounts outside storage capacity.
- The authoritative amount remains `hours * rate`, rounded to two decimals AwayFromZero through `FinancialNumberPolicy.RoundMoney`.
- Hours intentionally have no fractional-input restriction. This preserves Staff imports calculated as `minutes / 60m`, including repeating decimal values. The caller remains responsible for the existing six-decimal persistence normalization; amount calculation uses the original hours value under the frozen formula.
- `TryConvertHoursToMinutes` checks the hours storage bound and `Int32` minute capacity before multiplication/cast. It first restores a whole minute when the converted value is within the maximum half-unit error introduced by six-decimal hours storage (`0.00003` minute, so `0.033333` hours returns `2` minutes), then retains truncation for other fractional-minute values.
- `OvertimeService` consumes the shared calculation method and constants. Daily normal and holiday hours are bounded individually before their safe sum is checked. Existing rate and amount snapshots remain preserved only after the current values pass the shared calculation boundary.
- Process-run source validation now rejects stored hours and amounts outside the same shared capacities before aggregate creation.

## Conformance evidence

| Concern | Canonical owner | Target evidence | Result |
|---|---|---|---|
| Backend-owned calculation | Master; BE 5/15 | `StaffOvertimePolicy.TryCalculateHoursAmount` | Match: client totals are not trusted and the existing formula is retained. |
| Financial rounding and scale | BE 15; `FinancialNumberPolicy` | `RoundMoney`, `HasValidMoneyScale`, ledger storage decimal places | Match: two-decimal AwayFromZero amount and two-decimal rate validation. |
| Validate before mutation | BE 8/14; Phase 01 | `OvertimeService.PrepareDailyAsync` | Match: bounds and calculation complete before entity assignments. |
| Historical stability | Frozen HRM contract | `keepRate` / `keepAmount` path | Match: metadata-only updates do not reprice valid saved snapshots. |
| Localized failure | BE 5 | `BusinessFailure("OvertimeInvalidInput")` | Match: invalid numeric values fail through the existing Result contract. |

## Source-only verification

- Reviewed the scoped repository diff for `StaffOvertimePolicy.cs` and `OvertimeService.cs`.
- Checked the scoped files for merge markers and whitespace errors.
- No API, DTO, entity, EF configuration, route, mapping, or schema shape changed. No migration is required.
- Builds, tests, lint, database commands, browser verification, migrations, snapshots, commits, and pushes were not run as required by the task boundary.

## Owner verification

Verify at runtime that daily save and Staff monthly save reject negative, over-capacity, excessive-rate-scale, multiplication-overflow, and over-capacity amount inputs; accept minute-derived repeating hours; retain fractional-minute truncation when reading hours as minutes; and preserve valid historical rate/amount snapshots on metadata-only edits.

## Root reconciliation review — 2026-10-11

Source-only review found one actionable gap in the integrated Staff reader/sparse writer: `GetStaffOvertimeDataAsync` and the untouched-row validation in `SaveStaffOvertimeCoreAsync` validate the rate through `TryCalculateHoursAmount` only when `OvertimeAmount` is null. A row with a stored amount can therefore return or survive a sparse save with a negative, over-capacity, or excessive-scale `OvertimeRate` (including a fallback resolved rate), even though the shared daily boundary rejects that rate. Validate `TotalOTHours` plus the selected rate through `TryCalculateHoursAmount` for every applicable row while continuing to preserve an existing amount snapshot; use the original stored hours for this validation rather than the reconstructed `minutes / 60m` value. No application source was changed by this reconciliation review.
