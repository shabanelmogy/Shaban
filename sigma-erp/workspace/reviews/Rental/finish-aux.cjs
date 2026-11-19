const fs = require('fs');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental';
function read(file) { return fs.readFileSync(`${root}/${file}`, 'utf8').replace(/\r\n/g, '\n'); }
function write(file, text) { fs.writeFileSync(`${root}/${file}`, text); }
function replaceMethod(text, name, replacement) {
  const expression = new RegExp(`^  (?:private |public |async )*${name}\\([^]*?^  \\}`, 'm');
  if (!expression.test(text)) throw new Error(`Missing method ${name}`);
  return text.replace(expression, replacement);
}
let file = 'RentalPlanner/components/list/list.component.ts';
let text = read(file);
text = `import { FilterPanelComponent, FilterActionsDirective } from 'src/app/modules/shared/components/filter-panel/filter-panel.component';
import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { currentMonthRange, dateRangeValidator, parseDateRange, toApiDate } from 'src/app/modules/shared/utils/date-utils';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
` + text;
text = text.replace('  standalone: true,', "  standalone: true,\n  host: { class: 'sigma-route-host' },");
text = text.replace('  imports: [', '  imports: [FilterPanelComponent, FilterActionsDirective, DatePickerDirective, FieldErrorComponent, StateMessageComponent,');
text = text.replace('this.fb.control<Date[] | null>(null)', 'this.fb.control<Date[] | string | null>(currentMonthRange(), dateRangeValidator)');
text = text.replace('this.defaultDateRange()', 'currentMonthRange()');
text = text.replace('    if (this.loadingList()) return;', '    if (this.loadingList() || this.loadingMakes() || this.optionsError()) return;\n    if (this.filterForm.invalid) { this.filterForm.markAllAsTouched(); return; }');
text = text.replace('this.formatApiDate(range[0])', 'toApiDate(range[0])!').replace('this.formatApiDate(range[1])', 'toApiDate(range[1])!');
text = text.replace(/this\.extractErrorMessage\(/g, 'apiErrorMessage(');
text = text.replace('  private loadMakes(): void {', '  loadMakes(): void {');
text = replaceMethod(text, 'selectedRange', `  private selectedRange(): [Date, Date] | null {
    if (this.filterForm.controls.dateRange.invalid) return null;
    const [from, to] = parseDateRange(this.filterForm.controls.dateRange.value);
    if (!from || !to) return null;
    return [new Date(from + 'T00:00:00'), new Date(to + 'T00:00:00')];
  }`);
for (const name of ['defaultDateRange', 'startOfDay', 'formatApiDate', 'extractErrorMessage']) text = replaceMethod(text, name, '');
text = text.replace('  onDateRangeChange(): void {', `  resetFilters(): void {
    if (this.loadingList()) return;
    this.filterForm.reset({ dateRange: currentMonthRange(), carMakeId: null, plateNo: '', zoomHours: 1 });
    this.search();
  }

  onDateRangeChange(): void {`);
write(file, text);
file = 'RentalPlanner/components/list/list.component.html';
text = read(file).replace('class="rental-planner-page"', 'class="sigma-list-page"').replace('class="rental-planner-panel"', 'class="sigma-list-panel"');
text = text.replace('    <app-feature-title', '    <header class="sigma-list-header">\n    <app-feature-title').replace('    />', '    />\n    </header>');
text = text.replace('<form class="rental-planner-filters"', '<form appFilterPanel [stableLayout]="true" [mainColumns]="4" [busy]="loadingList()" (resetRequested)="resetFilters()" class="rental-planner-filters"');
text = text.replace(/class="planner-filter-field planner-[\w-]+"/g, 'class="sigma-filter-field"');
text = text.replace('<p-calendar', '<p-calendar appDatePicker [numberOfMonths]="2"').replace('            [showIcon]="true"\n', '').replace('[readonlyInput]="true"', '[readonlyInput]="false" [keepInvalid]="true"');
text = text.replace('        </div>\n      </div>\n\n      <div class="sigma-filter-field">', '        </div>\n        <app-field-error [control]="filterForm.controls.dateRange" [reserveMessage]="true" />\n      </div>\n\n      <div class="sigma-filter-field">');
text = text.replace(/class="planner-icon-button"/g, 'class="sigma-secondary-button sigma-icon-button"');
text = text.replace('<div class="planner-filter-actions">', '<ng-container appFilterActions>').replace('      </div>\n    </form>', '      </ng-container>\n    </form>');
text = text.replace('[disabled]="!hasDateRange() || loadingMakes()"', '[disabled]="!hasDateRange() || loadingMakes() || !!optionsError()"');
text = text.replace(/<div class="planner-alert is-warning"[^]*?<\/div>/, `<app-state-message kind="error" [message]="optionsError()" />
      <button type="button" class="sigma-secondary-button" [disabled]="loadingMakes()" (click)="loadMakes()">{{ 'general.retry' | translate }}</button>`);
text = text.replace(/<div class="planner-alert is-error"[^]*?<\/div>/, '<app-state-message kind="error" [message]="errorMessage()" />');
text = text.replace('    <div class="planner-grid-shell"', `    @if (loadingList()) { <app-state-message kind="loading" message="rentalPlanner.loading" /> }
    <div class="planner-grid-shell"`);
text = text.replace(/<div class="planner-empty-state"[^]*?<\/div>/, '<app-state-message kind="empty" message="rentalPlanner.empty" icon="bi bi-calendar-x" />');
write(file, text);
file = 'RentalPlanner/components/list/list.component.scss';
text = read(file);
text = text.slice(text.indexOf('.planner-range-caption {'), text.indexOf('.planner-empty-state {'));
text = text.replace('min-height: 280px;', 'min-height: 0;');
const tokens = {border:'--sigma-border', 'border-strong':'--sigma-border', muted:'--sigma-muted', surface:'--sigma-surface', 'surface-alt':'--sigma-surface-soft', header:'--sigma-surface-soft', text:'--sigma-text'};
for (const [name, token] of Object.entries(tokens)) text = text.replaceAll(`var(--planner-${name})`, `var(${token})`);
text = text.replaceAll('#dc3545', 'var(--bs-danger)').replaceAll('#f0b400', 'var(--bs-warning)').replaceAll('#20b9c5', 'var(--bs-info)').replaceAll('#fff', 'var(--bs-white)');
text = `.planner-date-control, .planner-zoom-control, .planner-range-actions { display: flex; min-width: 0; gap: 3px; }
.planner-date-control > p-calendar, .planner-zoom-control > p-dropdown { flex: 1 1 0; min-width: 0; }
/* Frozen grouped matrix exception: shared shell/filters surround one internal table scroll owner. */\n` + text;
write(file, text);
file = 'DriverTimeSheet/components/list/list.component.html';
text = read(file);
text = text.replace('class="driver-time-sheet-page"', 'class="sigma-editor-page driver-time-sheet-workspace"').replace('class="driver-time-sheet-shell"', 'class="sigma-editor-panel"').replace('class="driver-time-sheet-content"', 'class="sigma-editor-form"').replace('class="driver-time-sheet-form"', 'class="sigma-editor-form"');
text = text.replace(/<div class="driver-time-sheet-state"[^]*?<\/div>/, '<app-state-message kind="loading" message="driverTimeSheet.loading" />');
text = text.replace(/<div class="driver-time-sheet-state is-error"[^]*?<\/div>/, `<app-state-message kind="error" [message]="loadError()" />
        <button type="button" class="sigma-secondary-button" (click)="retryRows()">{{ 'general.retry' | translate }}</button>`);
text = text.replace(/<div class="driver-time-sheet-alert"[^]*?<\/div>/, '<app-state-message kind="error" [message]="saveError()" />');
text = text.replace('<div class="driver-time-sheet-filter">', `<form appFilterPanel [stableLayout]="true" [mainColumns]="1" [formGroup]="form" [busy]="saving() || discardPending()" (resetRequested)="resetFilters()">
          <div class="sigma-filter-field">`);
text = text.replace(/@if \(form.controls.agreementId.touched[^]*?<\/small>\s*}/, '<app-field-error [control]="form.controls.agreementId" [reserveMessage]="true" />');
text = text.replace('          </div>\n\n          <app-form-section', `          </div>
          </form>
          @if (optionsError()) {
            <app-state-message kind="error" [message]="optionsError()" />
            <button type="button" class="sigma-secondary-button" (click)="loadOptions()">{{ 'general.retry' | translate }}</button>
          }

          <app-form-section`);
// Avoid nested HTML forms: the owning collection uses the existing FormGroup directive on a div.
text = text.replace('<form class="sigma-editor-form" [formGroup]="form" novalidate>', '<div class="sigma-editor-form" [formGroup]="form">').replace('        </form>', '        </div>');
text = text.replace(/<div class="driver-time-sheet-table-state"[^]*?<\/div>/, '<app-state-message kind="loading" message="driverTimeSheet.loadingRows" />');
text = text.replace('class="driver-time-sheet-edit-driver"', 'class="sigma-secondary-button sigma-icon-button"');
text = text.replace('                        <input\n', '                        <input appNumericFocus\n');
text = text.replace(/@if \(row.controls.workingHours.touched[^]*?<\/small>\s*}/, '<app-field-error [control]="row.controls.workingHours" [messages]="{ min: \'driverTimeSheet.errors.hours\' }" />');
text = text.replace(/<td class="numeric">{{ ([^}]+) }}<\/td>/g, '<td><span class="app-editable-collection-table__value app-editable-collection-table__value--highlight">{{ $1 }}</span></td>');
text = text.replace(/<div class="driver-time-sheet-totals"[^]*?<\/div>/, '<app-summary-cards [cards]="summaryCards()" [ariaLabel]="\'driverTimeSheet.total\' | translate" density="slim" layout="row" [minCardWidth]="140" [maxHeight]="80" />');
text = text.replace('class="driver-time-sheet-note"', 'class="sigma-alert sigma-alert--info"').replace('class="driver-time-sheet-footer"', 'class="sigma-editor-footer"');
text = text.replace('                              styleClass="driver-time-sheet-dropdown"\n                              panelStyleClass="driver-time-sheet-dropdown-panel"\n', '');
write(file, text);
write('DriverTimeSheet/components/list/list.component.scss', `/* Only collection placement and record-label layout; shared owners supply shell and controls. */
.driver-time-sheet-section, .driver-time-sheet-table-area {
  display: flex; flex: 1 1 0; flex-direction: column; min-height: 0; overflow: hidden;
}
.driver-time-sheet-driver-wrapper { display: flex; align-items: center; gap: 7px; min-width: 0; }
.driver-time-sheet-driver-wrapper p-dropdown { flex: 1 1 0; min-width: 0; }
.driver-time-sheet-driver-name { flex: 1 1 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`);
