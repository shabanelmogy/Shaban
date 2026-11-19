import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EMPTY, Subject, catchError, defer, finalize, map, switchMap } from 'rxjs';

import { DataTableColumn, DataTableComponent } from 'src/app/modules/shared/components/data-table/data-table.component';
import { EditorDialogComponent } from 'src/app/modules/shared/components/editor-dialog/editor-dialog.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { LoadingService } from 'src/app/modules/shared/service/loading.service';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';

import { PayrollRunLog } from '../../models/payroll-run';
import { PayrollProcessService } from '../../services/payroll-process.service';

@Component({
  selector: 'app-payroll-run-logs',
  standalone: true,
  imports: [TranslateModule, EditorDialogComponent, DataTableComponent, StateMessageComponent],
  templateUrl: './payroll-run-logs.component.html',
})
export class PayrollRunLogsComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() runId: number | null = null;
  @Input() period = '';
  @Output() readonly closed = new EventEmitter<void>();

  private readonly service = inject(PayrollProcessService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loading = inject(LoadingService);
  private readonly requests = new Subject<number | null>();
  private initialized = false;
  readonly loadingLogs = signal(false);
  readonly error = signal('');
  readonly rows = signal<PayrollRunLog[]>([]);
  readonly columns: ReadonlyArray<DataTableColumn<PayrollRunLog>> = [
    { field: 'occurredAt', header: 'payrollProcess.logs.occurredAt', type: 'dateTime', width: '180px' },
    { field: 'operation', header: 'payrollProcess.logs.operation', width: '170px', value: row => this.operationText(row.operation) },
    { field: 'revisionNumber', header: 'payrollProcess.logs.revision', type: 'number', width: '100px' },
    { field: 'previousRevisionNumber', header: 'payrollProcess.logs.previousRevision', type: 'number', width: '130px' },
    { field: 'performedBy', header: 'payrollProcess.logs.performedBy', width: '170px', cellClass: 'sigma-data-table__cell--wrap' },
    { field: 'previousAmount', header: 'payrollProcess.logs.previousAmount', type: 'money', width: '140px' },
    { field: 'amount', header: 'payrollProcess.logs.amount', type: 'money', width: '140px' },
  ];

  ngOnInit(): void {
    this.requests.pipe(
      switchMap(id => defer(() => {
        this.error.set('');
        this.rows.set([]);
        if (!id) return EMPTY;
        this.loadingLogs.set(true);
        this.loading.startLoading();
        return this.service.getLogs(id).pipe(
          map(result => ({ id, result })),
          catchError(error => {
            if (this.visible && this.runId === id) this.error.set(apiErrorMessage(error, 'payrollProcess.logs.loadError'));
            return EMPTY;
          }),
          finalize(() => {
            this.loadingLogs.set(false);
            this.loading.endLoading();
          }),
        );
      })),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(({ id, result }) => {
      if (!this.visible || this.runId !== id) return;
      if (!result.isSuccess || !result.entity) {
        this.error.set(result.message?.trim() || 'payrollProcess.logs.loadError');
        return;
      }
      this.rows.set(result.entity);
    });
    this.initialized = true;
    this.requests.next(this.visible ? this.runId : null);
  }

  ngOnChanges(): void {
    if (this.initialized) this.requests.next(this.visible ? this.runId : null);
  }

  retry(): void {
    if (this.visible && this.runId && !this.loadingLogs()) this.requests.next(this.runId);
  }

  close(): void {
    this.requests.next(null);
    this.closed.emit();
  }

  private operationText(operation: PayrollRunLog['operation']): string {
    const keys: Record<PayrollRunLog['operation'], string> = {
      Created: 'payrollProcess.logs.created',
      Recalculated: 'payrollProcess.logs.recalculated',
      Approved: 'payrollProcess.logs.approved',
    };
    return this.translate.instant(keys[operation]);
  }
}
