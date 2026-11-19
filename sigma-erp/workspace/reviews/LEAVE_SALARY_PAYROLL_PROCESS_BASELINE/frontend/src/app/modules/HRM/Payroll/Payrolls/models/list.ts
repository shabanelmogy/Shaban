import { ListQuery } from 'src/app/modules/shared/utils/list-query';

export type PayrollType = 'Payroll';
export type PayrollListSortField = 'date' | 'amount';

/** Saved current revision only; extra properties support identity and action gates. */
export interface PayrollRunListRow {
  id: number;
  date: string;
  type: PayrollType;
  amount: number;
  isApproved: boolean;
  isPaid: boolean;
  revisionNumber: number;
  version: string;
}

export interface PayrollListFilters {
  dateFrom?: string;
  dateTo?: string;
  type: PayrollType;
  pendingApproval?: true | null;
}

export type PayrollListQuery = ListQuery<PayrollListFilters>;

export interface PayrollApproveRequest {
  expectedVersion: string;
}
