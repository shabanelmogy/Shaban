<!-- Part of UI block 17: see ../17-dates.md. Same status and authority as the block. -->

**A dialog opens with its calendar overlay closed.** Bind the shell's
`[focusOnShow]="false"` on `app-editor-dialog`, and on each calendar use
`[showOnFocus]="false"` with `(click)="dateCal.showOverlay()"` (editor snippet
above). The panel then opens only on an intentional click on the input, never
while the dialog is being displayed or when focus lands on the field. Keyboard
users type the date directly, because every calendar is typeable. Do not call
the calendar input's `focus()` from `ngOnInit`, `onEditorShown`, or another
lifecycle hook. If initial focus is required in View mode, focus the shared
dialog close control instead of a calendar.

When a small dialog's first required action is choosing a date, it may open the
calendar overlay after the shared editor shell emits `shown`. Keep this opt-in
and local to that workflow; do not auto-open every calendar in the app:

```ts
@ViewChild('effectiveDateCalendar')
private effectiveDateCalendar?: DatePicker;

openDatePicker(): void {
  queueMicrotask(() => {
    const calendar = this.effectiveDateCalendar;
    if (!calendar) return;
    calendar.inputfieldViewChild?.nativeElement.focus();
    calendar.showOverlay();
  });
}
```

```html
<app-editor-dialog (shown)="openDatePicker()">
  <p-datepicker
    #effectiveDateCalendar
    [showOnFocus]="false"
    appendTo="body"
    ...
  ></p-datepicker>
</app-editor-dialog>
```
