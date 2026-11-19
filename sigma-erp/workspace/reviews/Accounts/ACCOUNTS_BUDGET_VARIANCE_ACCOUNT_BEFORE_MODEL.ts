// ─── Response DTOs ─────────────────────────────────────────────────────────────

export interface BudgetVarianceLine {
  accountId: number;
  accountCode: string | null;
  accountName: string | null;
  month: string;
  monthNumber: number;
  year: number;
  actual: number;
  budget: number;
  variance: number;
}

export interface BudgetVarianceDTO {
  lines: BudgetVarianceLine[];
}

// ─── Filter ────────────────────────────────────────────────────────────────────

export interface BudgetVarianceFilter {
  fiscalYearId?: number;
  accountType?: number;
}
