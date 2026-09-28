## 27. Focus and keyboard

> **Status: Canonical**

**Canonical:** the shared confirmation dialog and any `p-dialog`; PrimeNG handles
the trap, you handle the edges.

| Surface | Required behaviour |
|---|---|
| Dialog open | focus moves into the dialog |
| Dialog | Tab cycles inside; it must not reach the page behind |
| Dialog close | focus returns to the control that opened it |
| Escape | closes, and for a dirty editor routes through the discard rule (block 10) |
| Row action menu | Escape and outside click close it; focus returns to the trigger |
| Icon-only button | `aria-label`, always |
| Decorative icon | `aria-hidden="true"`, always |
| Invalid submit | focus the first invalid control, do not only paint it red |
| Step form | `app-step-form` owns ordinary-button navigation and `aria-current`; feature Back/Next remain `type="button"` so Enter cannot skip a step |
| Editor tabs | `app-editor-tabs` owns roving focus, Home/End, and direction-aware arrow keys; feature panels keep matching IDs and labels |

Getting these free is the reason to use `p-dialog` and the shared confirmation
service rather than a hand-rolled backdrop. A plain `<div>` with
`role="dialog"` provides none of them — which is why the hand-rolled Staff
salary-revision modal (`Staff/Staff/components/list/list.component.html`) must
not be used as a model. Block 13 shows the canonical replacement.

Filter forms submit on Enter because they are real `<form>` elements with
`type="submit"` on Search. Keep that; do not intercept Enter.

**Check:** focus enters, traps, returns · Escape defined for every dialog ·
`aria-label` on icon-only controls · first invalid control focused on failed
submit · custom editor tabs use `app-editor-tabs` with matching panel IDs · no
feature-local duplicate tab keyboard handler · no `role="dialog"` hand-rolled
markup in new code.

---

