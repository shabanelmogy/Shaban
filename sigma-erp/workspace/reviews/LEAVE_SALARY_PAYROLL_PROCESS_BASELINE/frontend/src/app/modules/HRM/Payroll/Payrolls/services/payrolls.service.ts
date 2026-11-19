import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Result } from 'src/app/modules/shared/models/result';
import { Results } from 'src/app/modules/shared/models/results';
import { BaseService } from 'src/app/modules/shared/service/base-service.service';
import { fetchAllPages, toListParams } from 'src/app/modules/shared/utils/list-query';
import { environment } from 'src/environments/environment';

import { PayrollRun } from '../../PayrollProcess/models/payroll-run';
import { PayrollApproveRequest, PayrollListQuery, PayrollRunListRow } from '../models/list';

@Injectable({ providedIn: 'root' })
export class PayrollsService extends BaseService {
  private readonly inlineOptions = { headers: { 'X-Skip-Error-Interceptor': 'true' } };

  constructor() {
    super('PayrollRuns', environment.baseUrl);
  }

  getList(query: PayrollListQuery): Observable<Results<PayrollRunListRow>> {
    return this.http.get<Results<PayrollRunListRow>>(`${this.baseUrl}PayrollRuns`, {
      ...this.inlineOptions,
      params: toListParams(query),
    });
  }

  getAllList(query: PayrollListQuery): Observable<PayrollRunListRow[]> {
    return fetchAllPages(
      pageNo => this.getList({ ...query, pageNo, pageSize: 100 }),
      'payrolls.errors.export',
    );
  }

  getRun(id: number): Observable<Result<PayrollRun>> {
    return this.http.get<Result<PayrollRun>>(`${this.baseUrl}PayrollRuns/${id}`, this.inlineOptions);
  }

  approve(id: number, request: PayrollApproveRequest): Observable<Result<PayrollRun>> {
    // Inline failure/retry belongs to the list; the interceptor owns the one success toast.
    return this.http.post<Result<PayrollRun>>(
      `${this.baseUrl}PayrollRuns/${id}/approve`, request, this.inlineOptions,
    );
  }
}
