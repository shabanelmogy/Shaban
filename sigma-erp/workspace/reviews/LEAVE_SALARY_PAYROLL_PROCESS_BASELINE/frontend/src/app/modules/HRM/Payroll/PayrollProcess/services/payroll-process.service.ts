import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Result } from 'src/app/modules/shared/models/result';
import { BaseService } from 'src/app/modules/shared/service/base-service.service';
import { environment } from 'src/environments/environment';

import {
  PayrollCalculateRequest,
  PayrollRevisionSummary,
  PayrollRun,
  PayrollRunLog,
  PayrollSaveRequest,
} from '../models/payroll-run';

@Injectable({ providedIn: 'root' })
export class PayrollProcessService extends BaseService {
  private readonly inlineOptions = { headers: { 'X-Skip-Error-Interceptor': 'true' } };

  constructor() {
    super('PayrollRuns', environment.baseUrl);
  }

  calculate(request: PayrollCalculateRequest): Observable<Result<PayrollRun>> {
    return this.http.post<Result<PayrollRun>>(`${this.baseUrl}PayrollRuns/calculate`, request, {
      headers: {
        'X-Skip-Error-Interceptor': 'true',
        'X-Skip-Success-Toast': 'true',
      },
    });
  }

  save(request: PayrollSaveRequest): Observable<Result<PayrollRun>> {
    return this.http.post<Result<PayrollRun>>(`${this.baseUrl}PayrollRuns`, request, this.inlineOptions);
  }

  getRun(id: number): Observable<Result<PayrollRun>> {
    return this.http.get<Result<PayrollRun>>(`${this.baseUrl}PayrollRuns/${id}`, this.inlineOptions);
  }

  getRevisions(id: number): Observable<Result<PayrollRevisionSummary[]>> {
    return this.http.get<Result<PayrollRevisionSummary[]>>(
      `${this.baseUrl}PayrollRuns/${id}/revisions`, this.inlineOptions,
    );
  }

  getRevision(id: number, revisionNumber: number): Observable<Result<PayrollRun>> {
    return this.http.get<Result<PayrollRun>>(
      `${this.baseUrl}PayrollRuns/${id}/revisions/${revisionNumber}`, this.inlineOptions,
    );
  }

  getLogs(id: number): Observable<Result<PayrollRunLog[]>> {
    return this.http.get<Result<PayrollRunLog[]>>(`${this.baseUrl}PayrollRuns/${id}/logs`, this.inlineOptions);
  }
}
