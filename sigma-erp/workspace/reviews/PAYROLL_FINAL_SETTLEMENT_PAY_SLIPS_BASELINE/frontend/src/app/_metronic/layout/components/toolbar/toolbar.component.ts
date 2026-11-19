import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILayout, LayoutType } from '../../core/configs/config';
import { LayoutService } from '../../core/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  // Public props
  @Input() currentLayoutType: LayoutType | null;
  @Input() appToolbarLayout:
    | 'classic'
    | 'accounting'
    | 'extended'
    | 'reports'
    | 'saas';

  // toolbar
  appToolbarDisplay: boolean;
  appToolbarContainer: 'fixed' | 'fluid';
  appToolbarContainerCSSClass: string = '';
  appToolbarFixedDesktop: boolean;
  appToolbarFixedMobile: boolean;
  appPageTitleDisplay: boolean;

  // page title
  appPageTitleDirection: string = '';
  appPageTitleCSSClass: string = '';
  appPageTitleBreadcrumb: boolean;
  appPageTitleDescription: boolean;

  constructor(private layout: LayoutService, private router: Router) {}

  ngOnInit(): void {
    const subscr = this.layout.layoutConfigSubject
      .asObservable()
      .subscribe((config: ILayout) => {
        this.updateProps(config);
      });
    this.unsubscribe.push(subscr);
  }

  updateProps(config: ILayout) {
    this.appToolbarDisplay = this.layout.getProp(
      'app.toolbar.display',
      config
    ) as boolean;
    if (!this.appToolbarDisplay) {
      return;
    }

    this.appPageTitleDisplay = this.layout.getProp(
      'app.pageTitle.display',
      config
    ) as boolean;
    this.appToolbarContainer = this.layout.getProp(
      'app.toolbar.container',
      config
    ) as 'fluid' | 'fixed';
    this.appToolbarContainerCSSClass =
      this.appToolbarContainer === 'fixed'
        ? 'container-xxl'
        : 'container-fluid';
    const containerClass = this.layout.getProp(
      'app.toolbar.containerClass',
      config
    ) as string;
    if (containerClass) {
      this.appToolbarContainerCSSClass += ` ${containerClass}`;
    }

    this.appToolbarFixedDesktop = this.layout.getProp(
      'app.toolbar.fixed.desktop',
      config
    ) as boolean;
    if (this.appToolbarFixedDesktop) {
      document.body.setAttribute('data-kt-app-toolbar-fixed', 'true');
    }

    this.appToolbarFixedMobile = this.layout.getProp(
      'app.toolbar.fixed.mobile',
      config
    ) as boolean;
    if (this.appToolbarFixedMobile) {
      document.body.setAttribute('data-kt-app-toolbar-fixed-mobile', 'true');
    }

    // toolbar
    this.appPageTitleDirection = this.layout.getProp(
      'app.pageTitle.direction',
      config
    ) as string;
    this.appPageTitleCSSClass = this.layout.getProp(
      'app.pageTitle.class',
      config
    ) as string;
    this.appPageTitleBreadcrumb = this.layout.getProp(
      'app.pageTitle.breadCrumb',
      config
    ) as boolean;
    this.appPageTitleDescription = this.layout.getProp(
      'app.pageTitle.description',
      config
    ) as boolean;

    document.body.setAttribute('data-kt-app-toolbar-enabled', 'true');
    document.body.setAttribute('data-kt-app-header-minimize', 'on');
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  showPageTitle() {
    const viewsWithPageTitles = ['classic', 'reports', 'saas'];
    const routePath = this.router.url.split(/[?#]/, 1)[0].replace(/\/$/, '');
    const isLimousine = /^\/(Location|TripType|TripBooking|LimoQuotation|LimousineInvoice|LimousineTariff|LimousineTariffReport|LimousineUtilizationReport|ChauffeurForcedAllocationsReport|DriversTracker|TripGridCustomization)(\/|$)/.test(routePath);
    const isLinkAccounts = routePath === '/LinkAccounts';
    const isFiscalYearGrid = routePath === '/FiscalYear';
    const isIndividualPartnerGrid = routePath === '/IndividualPartner';
    const isCompanyPartnerGrid = /^\/(CompanyPartner|Company|CompanyDriver|CompanyContactPerson)(\/|$)/.test(routePath);
    const isCustomerAlertsReport = routePath === '/Alerts';
    const isBalancesSummary = routePath === '/BalancesSummary';
    const isFollowUpReport = routePath === '/followUpReport';
    const isDebtCollectionReport = routePath === '/DebtCollection';
    const isFleetAlertsGrid = routePath === '/FleetAlerts';
    const isSupplierGrid = routePath === '/Supplier';
    const isSupplierReport = ['/SupplierStatement', '/SupplierBalancesSummary', '/PayableAgeAnalysis'].includes(routePath);
    const isWorkshop = /^\/(Job|JobEstimation|LubricationJob|WorkOrder|JobCategory|LabourActivities|LabourActivitiesReport|LabourTariff|workshopVehicles)(\/|$)/.test(routePath);
    const isStockDocument = /^\/(ItemReturn|StockTransfer)(\/|$)/.test(routePath);
    const isStockReport = /^\/(StockSummary|DetailedStockReport|PurchaseOrdersDetailReport|PurchaseDetailsReport|ItemIssueReport|ItemsReturnReport|GrnPendingReport|PartsMovingReport)(\/|$)/.test(routePath);
    const isAccounts = /^\/(Account|LinkAccounts|FiscalYear|MonthClose|openingBalances|Journal|Budget|BudgetVariance|TrailBalance|TrialBalance|BalanceSheet|BalanceSheetMonthWise|CashFlowStatement|IncomeComparison|IncomeStatement|IncomeStatement2|IncomeStatementFy|IncomeStatementFy2|IncomeStatementYtd|IncomeStatementYtd2|VehicleIncomeStatement|Ledger)(\/|$)/.test(routePath);
    const isDashboard = routePath === '/dashboard';
    const isLoanReport = /^\/(Loans|LoanEMI|LoanDetails)(\/|$)/.test(routePath);
    const isBankReconciliation = routePath === '/BankReconciliation';
    const isReconciliationReport = routePath === '/reconciliationReport';
    const isCashDeposit = /^\/CashDeposit(\/|$)/.test(routePath);
    const isPDCPayable = routePath === '/PDCPayable';
    const isPDCReceivable = /^\/PDCReceivable(\/|$)/.test(routePath);
    const isDepreciationFyReport = routePath === '/depreciationReportFy';
    const isAsset = /^\/asset(\/|$)/.test(routePath);
    const isDepreciation = routePath === '/depreciation';
    const isDepreciationSummary = routePath === '/depreciationSummary';
    const isDepreciationDetail = routePath === '/depreciationDetail';
    const isRental = /^\/(RentalAgreement|RentalBooking|RentalQuotation|MasterAgreement|RentalTariff|TariffCard|DriverTimeSheet|RentalPlanner)(\/|$)/.test(routePath);
    const isUserGuide = /^\/UserGuide(\/|$)/.test(routePath);
    const isPayroll = /^\/(ProcessPayroll|ProcessLeaveSalary|ProcessedPayrolls)(\/|$)/.test(routePath);
    return (
      this.appPageTitleDisplay &&
      !isLimousine &&
      !isLinkAccounts &&
      !isFiscalYearGrid &&
      !isIndividualPartnerGrid &&
      !isCompanyPartnerGrid &&
      !isCustomerAlertsReport &&
      !isBalancesSummary &&
      !isFollowUpReport &&
      !isDebtCollectionReport &&
      !isFleetAlertsGrid &&
      !isSupplierGrid &&
      !isSupplierReport &&
      !isWorkshop &&
      !isStockDocument &&
      !isStockReport &&
      !isAccounts &&
      !isDashboard &&
      !isLoanReport &&
      !isBankReconciliation &&
      !isReconciliationReport &&
      !isCashDeposit &&
      !isPDCPayable &&
      !isPDCReceivable &&
      !isDepreciationFyReport &&
      !isAsset &&
      !isDepreciation &&
      !isDepreciationSummary &&
      !isDepreciationDetail &&
      !isRental &&
      !isUserGuide &&
      !isPayroll &&
      viewsWithPageTitles.some((t) => t === this.appToolbarLayout)
    );
  }
}
