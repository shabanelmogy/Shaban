import { Observable } from 'rxjs';

import {
  DataTableColumn,
  DataTableHierarchy,
} from 'src/app/modules/shared/components/data-table/data-table.component';
import { SummaryCard } from 'src/app/modules/shared/components/summary-cards/summary-card.model';
import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';
import { Result } from 'src/app/modules/shared/models/result';
import { Results } from 'src/app/modules/shared/models/results';

export type AccountReportFilterValue = Date | Date[] | string | number | boolean | null | undefined;
export type AccountReportFilterRaw = Readonly<Record<string, AccountReportFilterValue>>;
export type AccountReportFilterKind =
  | 'date-range'
  | 'date'
  | 'month'
  | 'select'
  | 'number'
  | 'text'
  | 'checkbox';

export interface AccountReportFilterOption {
  value: string | number;
  label?: string;
  labelKey?: string;
}

export interface AccountReportFilterDefinition {
  key: string;
  labelKey: string;
  kind: AccountReportFilterKind;
  initialValue: AccountReportFilterValue;
  required?: boolean;
  min?: number;
  max?: number;
  wide?: boolean;
  options?: ReadonlyArray<AccountReportFilterOption>;
  loadOptions?: () => Observable<Results<DropDownSelect>>;
  requiredLookup?: boolean;
}

export interface AccountReportBuildResult<TFilter extends object> {
  filter?: TFilter;
  errorKey?: string;
  focusKey?: string;
}

export interface AccountReportSection<TRow extends object> {
  id: string;
  titleKey?: string;
  icon?: string;
  rows: ReadonlyArray<TRow>;
  columns: ReadonlyArray<DataTableColumn<TRow>>;
  hierarchy?: DataTableHierarchy<TRow>;
  dataKey?: string;
  minWidth?: string;
  rowTone?: (row: TRow) => 'section' | 'subtotal' | 'total' | null;
}

export interface AccountReportConfig<
  TResponse extends object,
  TFilter extends object,
  TRow extends object,
> {
  id: string;
  titleKey: string;
  icon: string;
  exportFileName: string;
  stableFilterLayout?: boolean;
  sectionLayout?: 'panels' | 'document';
  summaryDensity?: 'comfortable' | 'compact' | 'dense' | 'slim';
  summaryMaxHeight?: number;
  filters: ReadonlyArray<AccountReportFilterDefinition>;
  load: (filter: TFilter) => Observable<Result<TResponse>>;
  buildFilter: (raw: AccountReportFilterRaw) => AccountReportBuildResult<TFilter>;
  sections: (
    response: TResponse,
    appliedFilters: AccountReportFilterRaw,
  ) => ReadonlyArray<AccountReportSection<TRow>>;
  summaryCards?: (response: TResponse) => ReadonlyArray<SummaryCard>;
  responseContext?: (response: TResponse) => string;
  normalizeResponse?: (response: TResponse) => TResponse;
  exportRows?: (
    response: TResponse,
    sections: ReadonlyArray<AccountReportSection<TRow>>,
    translate: (key: string) => string,
  ) => Array<Record<string, string | number>>;
  loadErrorKey?: string;
  searchPromptKey?: string;
  autoSearch?: boolean;
  showBack?: boolean;
}
