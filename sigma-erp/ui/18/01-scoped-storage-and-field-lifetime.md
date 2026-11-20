<!-- Part of UI block 18: see ../18-documents-and-upload.md. Same status and authority as the block. -->

### Scoped document storage and field lifetime
The reusable Company DocumentsComponent accepts optional `uploadFolder`,
`fileAccessRequirement`, `fileAllowed` and `fileCancelled$`. Its default folder
remains CustomerDocuments for existing consumers. A parent with a reviewed
private server contract supplies that folder rather than replacing this table.
The child passes the access requirement, operation/publication predicate and
publication cancellation into the existing FileField; it does not implement a
second uploader or grant access by selecting a folder. DocumentUploadTracker
still owns sent upload settlement and cleanup. Do not make its publication
predicate depend on its own uploading busy flag.

WorkshopMovement selects WorkshopMovementDocuments and the closed FileLink
resource `workshop-movement-document`, requiring WorkshopMovement.View and
Media.ReadWorkshopMovementDocument. It uses dialog-local read progress and the
mounted document's context predicate/cancellation notifier. Canonical paths
select the same protected resource automatically, never a static URL fallback.
Backend ownership and historical-branch validation are defined in
AUTHORIZATION_140_144_REMEDIATION_CONTRACT_FREEZE; storage lives outside wwwroot.
Previously stored public paths are not accepted by new writes. Their known
WorkshopMovement ownership also denies their static access, including deleted
ownership history, without opening general CustomerDocuments access.
Source specifications and integration checks are distinct from pending
storage/HTTP/browser acceptance; selecting this resource grants no runtime proof.
