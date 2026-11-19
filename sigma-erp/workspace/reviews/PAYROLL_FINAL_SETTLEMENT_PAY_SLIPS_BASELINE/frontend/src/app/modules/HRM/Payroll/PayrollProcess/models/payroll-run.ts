export type PayrollType = 'Payroll' | 'LeaveSalary';

export interface PayrollCalculateRequest {
  period: string;
  type: PayrollType;
  staffId?: number;
}

export interface PayrollSaveRequest extends PayrollCalculateRequest {
  expectedVersion: string;
}

export interface PayrollRunRow {
  staffId: number;
  code: string | null;
  name: string;
  basic: number;
  allowances: number;
  gross: number;
  overtime: number;
  additional: number;
  deductions: number;
  netPay: number;
  netPayDifference: number;
  issues: string[];
}

export interface PayrollRun {
  id: number | null;
  period: string;
  type: PayrollType;
  staffId: number | null;
  version: string;
  revisionNumber: number;
  isSaved: boolean;
  isPaid: boolean;
  isApproved: boolean;
  isCurrentRevision: boolean;
  approvedAt: string | null;
  approvedBy: string | null;
  canSave: boolean;
  requiresSettlement: boolean;
  settlementTotal: number;
  policyVersion: string;
  overtimePeriod: string;
  decimalPlaces: number;
  rows: PayrollRunRow[];
  totalBasic: number;
  totalAllowances: number;
  totalGross: number;
  totalOvertime: number;
  totalAdditional: number;
  totalDeductions: number;
  totalNet: number;
}

export interface PayrollStaffOption {
  id: number;
  no: string | null;
  value: string;
}

export interface PayrollRevisionSummary {
  revisionNumber: number;
  savedAt: string | null;
  totalNet: number;
}

export interface PayrollRevisionOption {
  id: number | null;
  value: string;
}

export type PayrollRunOperation = 'Created' | 'Recalculated' | 'Approved';

export interface PayrollRunLog {
  id: number;
  operation: PayrollRunOperation;
  revisionNumber: number;
  previousRevisionNumber: number | null;
  occurredAt: string;
  performedBy: string;
  previousAmount: number | null;
  amount: number;
}
