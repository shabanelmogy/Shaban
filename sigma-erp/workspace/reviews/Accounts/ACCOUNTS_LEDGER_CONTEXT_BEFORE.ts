import { Component, inject } from '@angular/core';

import { LedgerDTO, LedgerFilter, LedgerLine } from '../../models/list';
import { LedgerService } from '../../services/ledger.service';
import { AccountReportPageComponent } from '../../../shared/report-family/account-report-page.component';
import { AccountReportConfig } from '../../../shared/report-family/account-report.models';
import { currentMonthRange, reportRange, reportNumber, reportBoolean, reportText } from '../../../shared/report-family/account-report-values';

import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';
import { Results } from 'src/app/modules/shared/models/results';
import { AccountService } from 'src/app/modules/Accounts/Account/services/account.service';
import { BranchService } from 'src/app/modules/Administration/Branches/services/branch.service';
import { CostCenterGroupService } from 'src/app/modules/shared/service/costCenterGroup.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ledger', standalone: true,
  imports: [AccountReportPageComponent],
  templateUrl: './ledger.component.html', styleUrl: './ledger.component.scss',
  host: { class: 'sigma-route-host sigma-print-flow' },
})
export class LedgerComponent {
  private readonly service = inject(LedgerService);
  private readonly accounts = inject(AccountService);
  private readonly branches = inject(BranchService);
  private readonly costCenters = inject(CostCenterGroupService);
  private readonly route = inject(ActivatedRoute);
  readonly config: AccountReportConfig<LedgerDTO, LedgerFilter, LedgerLine> = {
    id: 'ledger', titleKey: 'ledger.title', icon: 'bi bi-bar-chart', exportFileName: 'Ledger',
    stableFilterLayout: true,
    filters: [
      { key: 'accountId', labelKey: 'ledger.account', kind: 'select', initialValue: this.route.snapshot.queryParamMap.has('accountId') ? Number(this.route.snapshot.queryParamMap.get('accountId')) : null, requiredLookup: true, required: true, loadOptions: () => this.accounts.getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true }) },
      { key: 'dateRange', labelKey: 'accountReports.dateRange', kind: 'date-range', initialValue: currentMonthRange() },
      { key: 'branchId', labelKey: 'ledger.branch', kind: 'select', initialValue: null, requiredLookup: true, loadOptions: () => this.branches.getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true }) },
      { key: 'costCenterGroupId', labelKey: 'ledger.costCenterGroup', kind: 'select', initialValue: null, requiredLookup: true, loadOptions: () => this.costCenters.getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true }) },
      { key: 'chassisOrPlateNo', labelKey: 'ledger.chassisOrPlateNo', kind: 'text', initialValue: '' },
      { key: 'showOriginalCurrency', labelKey: 'ledger.showOriginalCurrency', kind: 'checkbox', initialValue: false }
    ],
    load: filter => this.service.getReport(filter),
    buildFilter: raw => {
      if (!(reportNumber(raw, 'accountId')! > 0)) return { errorKey: 'accountReports.invalidFilters', focusKey: 'accountId' };
      return { filter: { accountId: reportNumber(raw, 'accountId') ?? 0, ...reportRange(raw, 'dateRange'), branchId: reportNumber(raw, 'branchId'), costCenterGroupId: reportNumber(raw, 'costCenterGroupId'), chassisOrPlateNo: reportText(raw, 'chassisOrPlateNo'), showOriginalCurrency: reportBoolean(raw, 'showOriginalCurrency') } };
    },
    sections: response => [
      { id: 'lines', rows: response.lines ?? [], columns: [
          { field: 'date', header: 'ledger.date', type: 'date' },
          { field: 'type', header: 'ledger.type' },
          { field: 'voucherNo', header: 'ledger.voucherNo' },
          { field: 'contact', header: 'ledger.contact' },
          { field: 'vehicle', header: 'ledger.vehicle' },
          { field: 'description', header: 'ledger.description' },
          { field: 'debit', header: 'ledger.debit', type: 'money', headerClass: 'text-end', cellClass: 'text-end' },
          { field: 'credit', header: 'ledger.credit', type: 'money', headerClass: 'text-end', cellClass: 'text-end' },
          { field: 'balance', header: 'ledger.balance', type: 'money', headerClass: 'text-end', cellClass: 'text-end' }
        ] }
    ],
    responseContext: response => [response.accountCode, response.accountName, response.currencyCode].filter(Boolean).join(' — '),
    summaryCards: response => [
      { id: 'beginningBalance', labelKey: 'ledger.beginningBalance', value: response.beginningBalance, format: 'money', icon: 'bi bi-cash-stack', accent: 'primary' },
      { id: 'totalDebit', labelKey: 'ledger.totalDebit', value: response.totalDebit, format: 'money', icon: 'bi bi-cash-stack', accent: 'primary' },
      { id: 'totalCredit', labelKey: 'ledger.totalCredit', value: response.totalCredit, format: 'money', icon: 'bi bi-cash-stack', accent: 'primary' },
      { id: 'netActivity', labelKey: 'ledger.netActivity', value: response.netActivity, format: 'money', icon: 'bi bi-cash-stack', accent: 'primary' },
      { id: 'endingBalance', labelKey: 'ledger.endingBalance', value: response.endingBalance, format: 'money', icon: 'bi bi-cash-stack', accent: 'primary' }
    ],
    showBack: true, autoSearch: this.route.snapshot.queryParamMap.has('accountId')
  };
}
