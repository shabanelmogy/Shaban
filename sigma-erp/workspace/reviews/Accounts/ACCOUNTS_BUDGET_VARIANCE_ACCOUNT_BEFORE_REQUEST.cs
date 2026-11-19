using SiGma.Helpers.Request;

namespace SiGma.ViewModels.ViewModels.AccountReports;

/// <summary>
/// Request DTO for the Budget Variance report.
///
/// Available filters:
/// - fiscalYearId:  Fiscal year (integer, required)
/// - accountType:   AccountCategory enum integer value
///                  (1=Asset, 2=Liability, 3=Equity, 4=Revenue, 5=Expense, default: 1=Asset)
/// </summary>
public class BudgetVarianceRequestDto : SpecificationRequestDto { }
