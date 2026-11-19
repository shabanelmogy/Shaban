import { Component, inject } from '@angular/core';

import { BudgetVarianceDTO, BudgetVarianceFilter, BudgetVarianceLine } from '../../models/budget-variance';
import { BudgetVarianceService } from '../../services/budget-variance.service';
import { AccountReportPageComponent } from '../../../shared/report-family/account-report-page.component';
import { AccountReportConfig } from '../../../shared/report-family/account-report.models';
import { reportNumber } from '../../../shared/report-family/account-report-values';

import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';
import { Results } from 'src/app/modules/shared/models/results';
import { FiscalYearService } from 'src/app/modules/Accounts/FiscalYears/services/fiscalYear.service';

@Component({
  selector: 'app-budget-variance', standalone: true,
  imports: [AccountReportPageComponent],
  templateUrl: './budget-variance.component.html', styleUrl: './budget-variance.component.scss',
  host: { class: 'sigma-route-host sigma-print-flow' },
})
export class BudgetVarianceComponent {
  private readonly service = inject(BudgetVarianceService);
  private readonly fiscalYears = inject(FiscalYearService);
  readonly config: AccountReportConfig<BudgetVarianceDTO, BudgetVarianceFilter, BudgetVarianceLine> = {
    id: 'budgetVariance', titleKey: 'sideMenu.accountss.budgetVariance', icon: 'bi bi-bar-chart', exportFileName: 'BudgetVariance',
    filters: [
      { key: 'fiscalYearId', labelKey: 'budgetVariance.fiscalYear', kind: 'select', initialValue: null, requiredLookup: true, required: true, loadOptions: () => this.fiscalYears.getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true }) },
      { key: 'accountType', labelKey: 'budgetVariance.accountType', kind: 'select', initialValue: 1, options: [1, 2, 3, 4, 5].map(value => ({ value, labelKey: 'budget.accountTypes.' + value })) }
    ],
    load: filter => this.service.getReport(filter),
    buildFilter: raw => {

      return { filter: { fiscalYearId: reportNumber(raw, 'fiscalYearId'), accountType: reportNumber(raw, 'accountType') } };
    },
    sections: response => [
      { id: 'lines', rows: response.lines ?? [], columns: [
          { field: 'accountCode', header: 'budgetVariance.accountCode' },
          { field: 'accountName', header: 'budgetVariance.accountName' },
          { field: 'month', header: 'budgetVariance.month' },
          { field: 'actual', header: 'budgetVariance.actual', type: 'money', headerClass: 'text-end', cellClass: 'text-end' },
          { field: 'budget', header: 'budgetVariance.budget', type: 'money', headerClass: 'text-end', cellClass: 'text-end' },
          { field: 'variance', header: 'budgetVariance.variance', type: 'money', headerClass: 'text-end', cellClass: 'text-end' }
        ] }
    ]
  };
}
