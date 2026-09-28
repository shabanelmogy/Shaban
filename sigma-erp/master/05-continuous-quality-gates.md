## 5. Continuous quality gates

These gates apply during every phase and are audited again in Phase 6. They are
not a late cosmetic review.

### Type and contract safety

- No `any` for feature contracts, forms, dialog results, or payloads.
- Models, services, forms, templates, and endpoints agree on nullability and
  enum representation.
- Server-owned values are not trusted from the client.
- Response wrappers are typed and both failure channels are handled.
- A non-2xx response carrying the standard `Result` preserves its safe business
  message instead of being reduced to a generic transport error.

### Error and async behavior

- Handle `isSuccess: false` and the HTTP `error` callback.
- Preserve actionable server messages when safe.
- Do not use silent error handlers.
- Prevent double execution.
- Cancel or ignore stale reads.
- End loading state on success, declared failure, transport failure, and cancel.
- Define recovery and retained user state.
- Give every mutation exactly one success-feedback owner. Standard successful
  mutations use the global mutation interceptor; a composite workflow may own the
  final success only when the request explicitly suppresses the interceptor toast.

### Security and authorization

- Authentication headers come from the correct interceptor-enabled client.
- Trace each authenticated feature service to its real injector and `HttpClient`
  chain. Do not repair a missing token by adding a manual Bearer header or another
  feature-level `provideHttpClient` fork.
- Backend boundaries validate tenant ownership, existence, authorization,
  state transitions, and business invariants.
- UI visibility is presentation only.
- Validate upload type, size, path handling, replacement, and abandoned files.

### Translation and terminology

- Add every new key to English and Arabic in the matching feature block.
- Use exact template casing.
- Preserve business terminology from evidence while implementing it with the
  approved component pattern.
- Localize user-facing validation, loading, empty, and error content.

### Accessibility and focus

- Use labels, semantic controls, and meaningful accessible names.
- Support keyboard operation and visible focus.
- Manage initial focus and return focus for dialogs.
- Use correct tab, dialog, table, and validation semantics.
- Do not encode meaning using color alone.

### RTL, theme, and responsive behavior

- Prefer logical CSS properties unless a physical placement is an explicit
  product requirement.
- Verify both directions and supported themes in source.
- Feature styles own their prefix and structural/semantic tokens; the global
  Sigma primary action tokens are consumed rather than redeclared.
- Body-appended overlays receive appropriately scoped global styling.
- Responsive behavior is defined by the guide/reference, not copied from a
  fixed screenshot viewport.

### Performance and data behavior

- Project only required read fields.
- Avoid N+1 queries and unnecessary detail payloads.
- Use stable ordering with paging.
- Define large child-collection behavior.
- Do not load all pages merely to simulate server paging.

### Compatibility and change discipline

- Check all direct consumers before narrowing a shared contract.
- Keep Transitional behavior only where the pattern book requires current
  architecture compatibility.
- Never copy Legacy patterns.
- Report schema migration and API compatibility effects.

---

