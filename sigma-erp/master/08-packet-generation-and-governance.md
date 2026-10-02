## 8. Packet generation and governance

Generated packets live under `recipe-system/generated/`. Their templates and
source dependencies live in `recipe-system/templates/` and
`recipe-manifest.json`.

### Packet rules

- Generated packets are never edited directly.
- Each packet declares exact canonical source-block dependencies.
- Each packet carries source fingerprints.
- Run `Generate-SigmaRecipes.ps1 -Check` before using a packet.
- Read-only companions in `recipe-system/`: `Check-Translations.ps1` (en/ar key parity, UI
  block 23) and `Check-BookReferences.ps1` (every path and cross-reference the books name exists).
- If check mode reports drift, use canonical sources and report the stale packet.
- Regeneration is followed by semantic review; a matching hash proves
  synchronization, not correctness.
- Manifest `approvedReferences` are reconciled against the canonical per-shape
  reference tables during semantic review. A green fingerprint check does not
  prove that a separately stored reference still has the correct role.
- Packet templates contain process and required outputs, not competing
  architectural authority.

### Packet families

- `PLAN-*` packets guide pre-implementation maintenance/evolution planning when
  current behavior must be understood and target contracts decided before phases.
- `PHASE-*` packets guide bounded review phases.
- `RECIPE-*` packets guide implementation for a known task shape.

A feature may require several phase packets and one implementation recipe. Phase
packets establish and reconcile contracts; task recipes implement an approved
shape.

### Documentation-system evolution procedure

1. Change the applicable canonical source.
2. Update dependencies or templates when semantics change.
3. Regenerate affected packets.
4. Run check mode.
5. Pilot material boundary changes on a simple list/modal feature, a routed
   aggregate editor, and a state-transition feature.
6. Compare missed, duplicate, and cross-phase findings.
7. Promote the change only after the master, canonical books, templates,
   generated packets, and workspace instructions agree.
