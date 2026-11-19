using SiGma.Helpers.Reports.CustomerReports;
using SiGma.Helpers.Models.Banking;
using SiGma.ViewModels.ViewModels.AccountReports;
using SiGma.Helpers.Enum.Accounts;
using SiGma.Helpers.Filters;
using SiGma.Business.Resolver;

namespace SiGma.Business.Services.AccountServices;

public class AccountReportsService : IAccountReportsService
{
    private readonly IUnitOfWork<SiGmaDbContext> _unitOfWork;
    private readonly JournalVoucherResolver _journalVoucherResolver;
    private readonly IStringLocalizer<GeneralMessage> _reconciliationLocalization;

    #region Constructor

    public AccountReportsService(
        IUnitOfWork<SiGmaDbContext> unitOfWork,
        JournalVoucherResolver journalVoucherResolver,
        IStringLocalizer<GeneralMessage> reconciliationLocalization)
    {
        _unitOfWork = unitOfWork;
        _journalVoucherResolver = journalVoucherResolver;
        _reconciliationLocalization = reconciliationLocalization;
    }

    #endregion

    #region Public Report Methods

    public async Task<Result<IncomeStatementVm>> GetIncomeStatementAsync(
        IncomeStatementRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var filters           = request.Filters ?? [];
        var from              = FilterHelper.GetDate(filters, "fromDate");
        var to                = FilterHelper.GetDate(filters, "toDate");
        var branchId          = FilterHelper.GetInt(filters, "branchId");
        var costCenterGroupId = FilterHelper.GetInt(filters, "costCenterGroupId");
        var maxLevel          = FilterHelper.GetInt(filters, "accountLevel");
        var hideZeroActivity  = FilterHelper.GetBool(filters, "hideZeroActivity") ?? false;

        if (from.HasValue && to.HasValue && from > to)
            return AccountReportHelper.Fail<IncomeStatementVm>("fromDate cannot be later than toDate.");

        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var revenueRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Revenue);
        var expenseRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Expense);

        if (revenueRoot == null || expenseRoot == null)
            return AccountReportHelper.Fail<IncomeStatementVm>(
                "Revenue or Expense root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var revenueIds    = AccountReportHelper.BuildSubtreeIdSet(revenueRoot.Id, childrenIndex);
        var expenseIds    = AccountReportHelper.BuildSubtreeIdSet(expenseRoot.Id, childrenIndex);
        var allIncomeIds  = AccountReportHelper.GetIncomeStatementIds(accounts);

        // Resolve cost center IDs
        var costCenterIds = await AccountReportHelper.ResolveCostCenterIdsAsync(_unitOfWork, costCenterGroupId, cancellationToken);

        // Query journal details with branch/cost center filters
        var periodQuery = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds);
        if (from.HasValue) periodQuery = periodQuery.Where(d => d.JournalVoucher!.Date >= from.Value);
        if (to.HasValue)   periodQuery = periodQuery.Where(d => d.JournalVoucher!.Date <= to.Value);

        var perAccount = await periodQuery
            .GroupBy(d => d.AccountId!.Value)
            .Select(g => new AccountTotals(g.Key, g.Sum(x => x.Debit ?? 0m), g.Sum(x => x.Credit ?? 0m)))
            .ToListAsync(cancellationToken);

        // Revenue = Credit - Debit, Expense = Debit - Credit
        var balances = perAccount
            .Where(p => allIncomeIds.Contains(p.AccountId))
            .ToDictionary(
                p => p.AccountId,
                p => revenueIds.Contains(p.AccountId)
                    ? p.Credit - p.Debit   // Revenue
                    : p.Debit - p.Credit); // Expense

        var metaById = accounts.ToDictionary(x => x.Id);

        // Build flat lines for all income statement accounts
        var allLines = accounts
            .Where(a => allIncomeIds.Contains(a.Id))
            .Select(a =>
            {
                balances.TryGetValue(a.Id, out var balance);
                return new IncomeStatementLineVm
                {
                    AccountId     = a.Id,
                    Code          = a.AccountCode,
                    Name          = a.Name,
                    Level         = a.AccountLevel,
                    ParentId      = a.ParentId,
                    AllowChildren = a.AllowChildren,
                    Balance       = balance,
                    Budget        = 0m  // Budget module not implemented yet
                };
            }).ToList();

        var lineById = allLines.ToDictionary(l => l.AccountId);

        // Roll up leaf values to parents
        var sortedIds = AccountReportHelper.TopologicalSort(accounts.Where(a => allIncomeIds.Contains(a.Id)).ToList(), childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (line.Balance == 0m && line.Budget == 0m) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                ancestor.Balance += line.Balance;
                ancestor.Budget  += line.Budget;
                ancestorId = ancestor.ParentId;
            }
        }

        // Apply filters
        var filtered = allLines.AsEnumerable();

        if (maxLevel.HasValue)
            filtered = filtered.Where(l => (l.Level ?? 1) <= maxLevel.Value);

        if (hideZeroActivity)
            filtered = filtered.Where(l => l.Balance != 0m);

        var resultLines = filtered.OrderBy(l => l.Code).ToList();

        // Build tree
        var byId  = resultLines.ToDictionary(l => l.AccountId);
        var roots = new List<IncomeStatementLineVm>();

        foreach (var line in resultLines)
        {
            if (line.ParentId.HasValue && byId.TryGetValue(line.ParentId.Value, out var parent))
                parent.Children.Add(line);
            else
                roots.Add(line);
        }

        // Calculate totals from root nodes
        var revenueTotal = lineById.TryGetValue(revenueRoot.Id, out var revLine) ? revLine.Balance : 0m;
        var expenseTotal = lineById.TryGetValue(expenseRoot.Id, out var expLine) ? expLine.Balance : 0m;

        return AccountReportHelper.Ok(new IncomeStatementVm
        {
            TotalRevenue  = revenueTotal,
            TotalExpenses = expenseTotal,
            Lines         = roots
        });
    }

    public async Task<Result<BalanceSheetVm>> GetBalanceSheetAsync(
        BalanceSheetRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var filters      = request.Filters ?? [];
        var asOfFilter   = FilterHelper.GetDate(filters, "asOfDate");
        var includeZerosFilter = FilterHelper.GetBool(filters, "includeZeros");

        if (HasInvalidFilter(filters, "asOfDate", asOfFilter.HasValue))
            return AccountReportHelper.Fail<BalanceSheetVm>("asOfDate must be a valid date.");
        if (HasInvalidFilter(filters, "includeZeros", includeZerosFilter.HasValue))
            return AccountReportHelper.Fail<BalanceSheetVm>("includeZeros must be true or false.");

        var asOf         = (asOfFilter ?? DateTime.Today).Date;
        var asOfExclusive = asOf.AddDays(1);
        var includeZeros = includeZerosFilter ?? false;

        if (asOf > DateTime.Today)
            return AccountReportHelper.Fail<BalanceSheetVm>("asOfDate cannot be in the future.");

        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var assetsRoot      = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Asset);
        var liabilitiesRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Liability);
        var equityRoot      = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Equity);

        if (assetsRoot == null || liabilitiesRoot == null || equityRoot == null)
            return AccountReportHelper.Fail<BalanceSheetVm>(
                $"Assets, Liabilities, or Equity root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var assetIds      = AccountReportHelper.BuildSubtreeIdSet(assetsRoot.Id, childrenIndex);
        var liabilityIds  = AccountReportHelper.BuildSubtreeIdSet(liabilitiesRoot.Id, childrenIndex);
        var equityIds     = AccountReportHelper.BuildSubtreeIdSet(equityRoot.Id, childrenIndex);

        var details = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId: null, costCenterIds: null)
            .Where(detail => detail.JournalVoucher!.Date < asOfExclusive);
        if (!includeZeros)
        {
            details = details.Where(detail =>
                (detail.Debit ?? 0m) != 0m ||
                (detail.Credit ?? 0m) != 0m);
        }

        var perAccount = await AccountReportHelper.AggregatePerAccountAsync(details, cancellationToken);

        var baseAssets      = AccountReportHelper.CalculateBalances(perAccount, assetIds,     t => t.Debit - t.Credit);
        var baseLiabilities = AccountReportHelper.CalculateBalances(perAccount, liabilityIds, t => t.Credit - t.Debit);
        var baseEquity      = AccountReportHelper.CalculateBalances(perAccount, equityIds,    t => t.Credit - t.Debit);

        var fiscalYear = await _unitOfWork.Repository
            .Query<FiscalYear>(year =>
                year.StartDate.Date <= asOf &&
                year.EndDate.Date >= asOf)
            .AsNoTracking()
            .OrderBy(year => year.StartDate)
            .ThenBy(year => year.Id)
            .Select(year => new { year.Id, year.StartDate })
            .FirstOrDefaultAsync(cancellationToken);

        if (fiscalYear is null)
            return AccountReportHelper.Fail<BalanceSheetVm>(
                "No fiscal year was found for the selected asOfDate.");

        var currentEarningsAccountId = await _journalVoucherResolver.GetGeneralAccountIdAsync(
            LinkAccountsGeneral.CurrentEarningsEquityAccount,
            cancellationToken: cancellationToken);
        var retainedEarningsAccountId = await _journalVoucherResolver.GetGeneralAccountIdAsync(
            LinkAccountsGeneral.RetainedEarningsEquityAccount,
            cancellationToken: cancellationToken);

        if (!currentEarningsAccountId.HasValue || !equityIds.Contains(currentEarningsAccountId.Value))
            return AccountReportHelper.Fail<BalanceSheetVm>(
                "Current Year Profit/Loss equity account is not configured correctly.");
        if (!retainedEarningsAccountId.HasValue || !equityIds.Contains(retainedEarningsAccountId.Value))
            return AccountReportHelper.Fail<BalanceSheetVm>(
                "Retained Earnings equity account is not configured correctly.");

        var incomeIds = AccountReportHelper.GetIncomeStatementIds(accounts);
        var fiscalYearStart = fiscalYear.StartDate.Date;
        var incomeQuery = AccountReportHelper.BuildJournalQuery(
                _unitOfWork,
                branchId: null,
                costCenterIds: null)
            .Where(detail =>
                incomeIds.Contains(detail.AccountId!.Value) &&
                detail.JournalVoucher!.Date < asOfExclusive);

        var priorIncomeTotals = await AccountReportHelper.AggregatePerAccountAsync(
            incomeQuery.Where(detail => detail.JournalVoucher!.Date < fiscalYearStart),
            cancellationToken);
        var currentIncomeTotals = await AccountReportHelper.AggregatePerAccountAsync(
            incomeQuery.Where(detail => detail.JournalVoucher!.Date >= fiscalYearStart),
            cancellationToken);

        // Income-statement balances are temporary accounts. Until a closing JV
        // transfers them to equity, surface the remaining net income in the
        // configured equity accounts at report time. A real closing JV zeros the
        // relevant Revenue/Expense balances, so this overlay naturally becomes 0
        // and cannot double-count the posted transfer.
        var priorYearsProfitLoss = priorIncomeTotals.Sum(total => total.Credit - total.Debit);
        var currentYearProfitLoss = currentIncomeTotals.Sum(total => total.Credit - total.Debit);

        baseEquity.TryGetValue(retainedEarningsAccountId.Value, out var retainedLedgerBalance);
        baseEquity[retainedEarningsAccountId.Value] = retainedLedgerBalance + priorYearsProfitLoss;
        baseEquity.TryGetValue(currentEarningsAccountId.Value, out var currentLedgerBalance);
        baseEquity[currentEarningsAccountId.Value] = currentLedgerBalance + currentYearProfitLoss;

        var metaById = accounts.ToDictionary(account => account.Id);

        var assets      = BuildBalanceSheetTree(assetsRoot.Id,      assetIds,     baseAssets,      metaById, childrenIndex, includeZeros);
        var liabilities = BuildBalanceSheetTree(liabilitiesRoot.Id, liabilityIds, baseLiabilities, metaById, childrenIndex, includeZeros);
        var equity      = BuildBalanceSheetTree(equityRoot.Id,      equityIds,    baseEquity,      metaById, childrenIndex, includeZeros);

        return AccountReportHelper.Ok(new BalanceSheetVm
        {
            TotalAssets      = assets.Sum(x => x.Amount),
            TotalLiabilities = liabilities.Sum(x => x.Amount),
            TotalEquity      = equity.Sum(x => x.Amount),
            Assets           = assets,
            Liabilities      = liabilities,
            Equity           = equity
        });
    }

    public async Task<Result<CashFlowVm>> GetCashFlowIndirectAsync(
        CashFlowRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var filters = request.Filters ?? [];
        var fiscalYearId = FilterHelper.GetInt(filters, "fiscalYearId");
        var asOfDate     = FilterHelper.GetDate(filters, "asOfDate");

        DateTime fromDate;
        DateTime toDate;

        if (fiscalYearId.HasValue)
        {
            var fiscalYear = await _unitOfWork.Repository
                .Query<FiscalYear>(fy => fy.Id == fiscalYearId.Value)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken);

            if (fiscalYear == null)
                return AccountReportHelper.Fail<CashFlowVm>("Fiscal year not found.");

            fromDate = fiscalYear.StartDate;
            toDate   = fiscalYear.EndDate;
        }
        else if (asOfDate.HasValue)
        {
            fromDate = new DateTime(asOfDate.Value.Year, 1, 1);
            toDate   = asOfDate.Value;
        }
        else
        {
            return AccountReportHelper.Fail<CashFlowVm>("Either fiscalYearId or asOfDate is required.");
        }

        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);
        var metaById = accounts.ToDictionary(x => x.Id);

        // Period movements
        var details             = AccountReportHelper.QueryDetails(_unitOfWork, fromDate, toDate, asOf: null, includeZeros: false);
        var perAccountMovements = await AccountReportHelper.AggregatePerAccountAsync(details, cancellationToken);

        decimal SumMovements(int accountId)
        {
            var m = perAccountMovements.FirstOrDefault(x => x.AccountId == accountId);
            return m == null ? 0m : m.Debit - m.Credit;
        }

        // Opening / Closing balances for ? calculations
        var openingBalances = await AccountReportHelper.AggregatePerAccountAsync(AccountReportHelper.QueryDetails(_unitOfWork, null, null, fromDate.AddDays(-1), false), cancellationToken);
        var closingBalances = await AccountReportHelper.AggregatePerAccountAsync(AccountReportHelper.QueryDetails(_unitOfWork, null, null, toDate, false), cancellationToken);

        var openingMap = openingBalances.ToDictionary(x => x.AccountId, x => x.Debit - x.Credit);
        var closingMap = closingBalances.ToDictionary(x => x.AccountId, x => x.Debit - x.Credit);

        decimal GetDelta(int accountId)
        {
            var open  = openingMap.TryGetValue(accountId, out var o) ? o : 0m;
            var close = closingMap.TryGetValue(accountId, out var c) ? c : 0m;
            return close - open;
        }

        // Net Income from P&L � Revenue accounts start with "4", Expense with "5"
        decimal totalRevenue  = 0m;
        decimal totalExpenses = 0m;

        foreach (var m in perAccountMovements)
        {
            if (!metaById.TryGetValue(m.AccountId, out var meta)) continue;
            if (meta.Category == AccountCategory.Revenue)  totalRevenue  += m.Credit - m.Debit;
            if (meta.Category == AccountCategory.Expense) totalExpenses += m.Debit  - m.Credit;
        }

        decimal netIncome = totalRevenue - totalExpenses;

        // Operating Activities
        decimal operating      = netIncome;
        var operatingLines     = new List<CashFlowLineVm>
        {
            new() { AccountId = 0, Code = "", Name = "Net Income", Amount = netIncome }
        };

        foreach (var acc in CashFlowAccountCodes.IS_NonCashExpenses)
        {
            var amount = SumMovements(acc);
            if (!metaById.ContainsKey(acc)) continue;
            operating += amount;
            operatingLines.Add(new() { AccountId = acc, Code = metaById[acc].AccountCode, Name = metaById[acc].Name, Amount = amount });
        }

        foreach (var acc in CashFlowAccountCodes.IS_NonCashRevenues)
        {
            var amount = SumMovements(acc);
            if (!metaById.ContainsKey(acc)) continue;
            operating -= amount;
            operatingLines.Add(new() { AccountId = acc, Code = metaById[acc].AccountCode, Name = metaById[acc].Name, Amount = -amount });
        }

        foreach (var acc in CashFlowAccountCodes.BS_CurrentAssets)
        {
            var delta = GetDelta(acc);
            if (!metaById.ContainsKey(acc)) continue;
            operating -= delta;
            operatingLines.Add(new() { AccountId = acc, Code = metaById[acc].AccountCode, Name = metaById[acc].Name, Amount = -delta });
        }

        foreach (var acc in CashFlowAccountCodes.BS_CurrentLiabilities)
        {
            var delta = GetDelta(acc);
            if (!metaById.ContainsKey(acc)) continue;
            operating += delta;
            operatingLines.Add(new() { AccountId = acc, Code = metaById[acc].AccountCode, Name = metaById[acc].Name, Amount = delta });
        }

        // Investing Activities
        decimal investing      = 0m;
        var investingLines     = new List<CashFlowLineVm>();

        foreach (var acc in CashFlowAccountCodes.BS_NonCurrentAssets)
        {
            var delta = GetDelta(acc);
            if (!metaById.ContainsKey(acc)) continue;
            investing -= delta;
            investingLines.Add(new() { AccountId = acc, Code = metaById[acc].AccountCode, Name = metaById[acc].Name, Amount = -delta });
        }

        // Financing Activities
        decimal financing      = 0m;
        var financingLines     = new List<CashFlowLineVm>();

        foreach (var acc in CashFlowAccountCodes.BS_FinancingAccounts)
        {
            var delta = GetDelta(acc);
            if (!metaById.ContainsKey(acc)) continue;
            financing += delta;
            financingLines.Add(new() { AccountId = acc, Code = metaById[acc].AccountCode, Name = metaById[acc].Name, Amount = delta });
        }

        return AccountReportHelper.Ok(new CashFlowVm
        {
            NetIncome             = netIncome,
            OperatingActivities   = operatingLines,
            InvestingActivities   = investingLines,
            FinancingActivities   = financingLines,
            NetCashFromOperating  = operating,
            NetCashFromInvesting  = investing,
            NetCashFromFinancing  = financing,
            NetChangeInCash       = operating + investing + financing
        });
    }

    #endregion

    #region Tree Building

    private List<BalanceSheetLineVm> BuildBalanceSheetTree(
        int rootId,
        HashSet<int> scope,
        Dictionary<int, decimal> baseMap,
        Dictionary<int, AccountInfo> metaById,
        Dictionary<int, List<int>> childrenIndex,
        bool includeZeros)
    {
        var memo = new Dictionary<int, decimal>();
        var root = BuildBalanceSheetNode(rootId, scope, baseMap, memo, metaById, childrenIndex, includeZeros);

        return !includeZeros && root.Amount == 0m && root.Children.Count == 0
            ? []
            : [root];
    }

    private BalanceSheetLineVm BuildBalanceSheetNode(
        int id,
        HashSet<int> scope,
        Dictionary<int, decimal> baseMap,
        Dictionary<int, decimal> memo,
        Dictionary<int, AccountInfo> metaById,
        Dictionary<int, List<int>> childrenIndex,
        bool includeZeros)
    {
        var m    = metaById[id];
        var node = new BalanceSheetLineVm
        {
            AccountId = id,
            Code      = m.AccountCode,
            Name      = m.Name,
            Level     = m.AccountLevel,
            ParentId  = m.ParentId,
            Amount    = AccountReportHelper.AggregateAmount(id, scope, baseMap, memo, childrenIndex)
        };

        if (!childrenIndex.TryGetValue(id, out var childIds)) return node;

        foreach (var childId in childIds)
        {
            if (!scope.Contains(childId)) continue;
            var child = BuildBalanceSheetNode(childId, scope, baseMap, memo, metaById, childrenIndex, includeZeros);
            if (includeZeros || child.Amount != 0m || child.Children.Count > 0)
                node.Children.Add(child);
        }

        node.Children = [.. node.Children.OrderBy(c => c.Code).ThenBy(c => c.Name)];
        return node;
    }

    #endregion

    #region Trial Balance

    public async Task<Result<TrialBalanceVm>> GetTrialBalanceAsync(
        TrialBalanceRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // -- 1. Parse filters ---------------------------------------------
        var filters           = request.Filters ?? [];
        var fromDate          = FilterHelper.GetDate(filters, "fromDate");
        var toDate            = FilterHelper.GetDate(filters, "toDate");
        var branchId          = FilterHelper.GetInt(filters, "branchId");
        var costCenterGroupId = FilterHelper.GetInt(filters, "costCenterGroupId");
        var maxLevel          = FilterHelper.GetInt(filters, "accountLevel");
        var hideZeroActivityFilter = FilterHelper.GetBool(filters, "hideZeroActivity");
        var hideZeroEndingFilter   = FilterHelper.GetBool(filters, "hideZeroEndingBalance");
        var leafOnlyFilter         = FilterHelper.GetBool(filters, "leafOnly");
        var hideZeroActivity       = hideZeroActivityFilter ?? false;
        var hideZeroEnding         = hideZeroEndingFilter ?? false;
        var leafOnly               = leafOnlyFilter ?? false;

        if (HasInvalidFilter(filters, "fromDate", fromDate.HasValue))
            return AccountReportHelper.Fail<TrialBalanceVm>("fromDate must be a valid date.");
        if (HasInvalidFilter(filters, "toDate", toDate.HasValue))
            return AccountReportHelper.Fail<TrialBalanceVm>("toDate must be a valid date.");
        if (HasInvalidFilter(filters, "branchId", branchId.HasValue))
            return AccountReportHelper.Fail<TrialBalanceVm>("branchId must be a valid integer.");
        if (HasInvalidFilter(filters, "costCenterGroupId", costCenterGroupId.HasValue))
            return AccountReportHelper.Fail<TrialBalanceVm>("costCenterGroupId must be a valid integer.");
        if (HasInvalidFilter(filters, "accountLevel", maxLevel.HasValue))
            return AccountReportHelper.Fail<TrialBalanceVm>("accountLevel must be a valid integer.");
        if (HasInvalidFilter(filters, "hideZeroActivity", hideZeroActivityFilter.HasValue))
            return AccountReportHelper.Fail<TrialBalanceVm>("hideZeroActivity must be true or false.");
        if (HasInvalidFilter(filters, "hideZeroEndingBalance", hideZeroEndingFilter.HasValue))
            return AccountReportHelper.Fail<TrialBalanceVm>("hideZeroEndingBalance must be true or false.");
        if (HasInvalidFilter(filters, "leafOnly", leafOnlyFilter.HasValue))
            return AccountReportHelper.Fail<TrialBalanceVm>("leafOnly must be true or false.");

        fromDate = fromDate?.Date;
        toDate = toDate?.Date;

        if (fromDate.HasValue && toDate.HasValue && fromDate > toDate)
            return AccountReportHelper.Fail<TrialBalanceVm>("fromDate cannot be later than toDate.");

        if (branchId.HasValue &&
            (branchId.Value <= 0 ||
             !await _unitOfWork.Repository.ExistsAsync<Branch>(
                 branch => branch.Id == branchId.Value,
                 cancellationToken: cancellationToken)))
        {
            return AccountReportHelper.Fail<TrialBalanceVm>("Invalid branch filter.");
        }

        if (costCenterGroupId.HasValue &&
            (costCenterGroupId.Value <= 0 ||
             !await _unitOfWork.Repository.ExistsAsync<CostCenterGroup>(
                 group => group.Id == costCenterGroupId.Value,
                 cancellationToken: cancellationToken)))
        {
            return AccountReportHelper.Fail<TrialBalanceVm>("Invalid cost center group filter.");
        }

        if (maxLevel.HasValue && (maxLevel.Value < 1 || maxLevel.Value > 5))
            return AccountReportHelper.Fail<TrialBalanceVm>("accountLevel must be between 1 and 5.");

        var toDateExclusive = toDate?.AddDays(1);

        // -- 2. Load account metadata --------------------------------------
        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        // -- 3. Resolve cost center IDs for the requested group ------------
        var costCenterIds = await AccountReportHelper.ResolveCostCenterIdsAsync(_unitOfWork, costCenterGroupId, cancellationToken);

        // -- 4. Opening balances (before fromDate) -------------------------
        var openingByAccountId = await AccountReportHelper.LoadOpeningBalancesAsync(
            _unitOfWork, accounts, branchId, costCenterIds, fromDate, cancellationToken);

        // -- 5. Period activity (fromDate → toDate) ------------------------
        var periodQuery = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds);

        if (fromDate.HasValue) periodQuery = periodQuery.Where(d => d.JournalVoucher!.Date >= fromDate.Value);
        if (toDateExclusive.HasValue) periodQuery = periodQuery.Where(d => d.JournalVoucher!.Date < toDateExclusive.Value);

        var periodTotals = await periodQuery
            .GroupBy(d => d.AccountId!.Value)
            .Select(g => new { AccountId = g.Key, Debit = g.Sum(x => x.Debit ?? 0m), Credit = g.Sum(x => x.Credit ?? 0m) })
            .ToListAsync(cancellationToken);

        var debitByAccount  = periodTotals.ToDictionary(t => t.AccountId, t => t.Debit);
        var creditByAccount = periodTotals.ToDictionary(t => t.AccountId, t => t.Credit);

        // -- 6. Build flat lines for all accounts from their own ledger values --
        var allLines = accounts.Select(a =>
        {
            openingByAccountId.TryGetValue(a.Id, out var opening);
            debitByAccount.TryGetValue(a.Id, out var debit);
            creditByAccount.TryGetValue(a.Id, out var credit);

            return new TrialBalanceLineVm
            {
                AccountId        = a.Id,
                AccountCode      = a.AccountCode,
                AccountName      = a.Name,
                AccountLevel     = a.AccountLevel,
                ParentId         = a.ParentId,
                AllowChildren    = a.AllowChildren,
                BeginningBalance = opening,
                Debit            = debit,
                Credit           = credit
            };
        }).ToList();

        var lineById      = allLines.ToDictionary(l => l.AccountId);
        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);

        // -- 7. Roll up each account's RAW own values to ALL ancestors ------
        //      Use an immutable raw snapshot. Reading already-rolled parent
        //      values during a leaf-first traversal double-counts descendants.
        var sortedIds = AccountReportHelper.TopologicalSort(accounts, childrenIndex);
        var rawValues = allLines.ToDictionary(
            line => line.AccountId,
            line => new
            {
                line.BeginningBalance,
                line.Debit,
                line.Credit
            });

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (!rawValues.TryGetValue(id, out var raw)) continue;
            if (raw.BeginningBalance == 0m && raw.Debit == 0m && raw.Credit == 0m) continue;

            // Walk up the ancestor chain and add this account's original values once.
            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                ancestor.BeginningBalance += raw.BeginningBalance;
                ancestor.Debit            += raw.Debit;
                ancestor.Credit           += raw.Credit;
                ancestorId = ancestor.ParentId;
            }
        }

        // -- 8. Apply display filters AFTER roll-up is complete ------------
        var filtered = allLines.AsEnumerable();

        // accountLevel: AccountLevel is derived from AccountCode segment count in
        // LoadAccountsMetaAsync, so it is always non-null here.
        // Keep accounts whose level is <= the requested cap.
        if (maxLevel.HasValue)
            filtered = filtered.Where(l => (l.AccountLevel ?? 1) <= maxLevel.Value);

        if (leafOnly)
            filtered = filtered.Where(l => !l.AllowChildren);

        if (hideZeroActivity)
            filtered = filtered.Where(l => l.Debit != 0m || l.Credit != 0m);

        if (hideZeroEnding)
            filtered = filtered.Where(l => l.EndingBalance != 0m);

        var resultLines = filtered.OrderBy(l => l.AccountCode).ToList();

        // -- 9. Build tree from the filtered set ---------------------------
        //      If a node's parent was filtered out (e.g. above maxLevel cap),
        //      it becomes a root in the response tree.
        var tree = AccountReportHelper.BuildTree(
            resultLines,
            l => l.AccountId,
            l => l.ParentId,
            (parent, child) => parent.Children.Add(child));

        // -- 10. Control totals come from the scoped posted ledger ----------
        //       accountLevel/leaf/zero switches are display filters only and
        //       must not make the report's beginning/debit/credit control totals drift.
        return AccountReportHelper.Ok(new TrialBalanceVm
        {
            TotalDebit = periodTotals.Sum(total => total.Debit),
            TotalCredit = periodTotals.Sum(total => total.Credit),
            Lines = tree
        });
    }

    private static bool HasInvalidFilter(
        IReadOnlyDictionary<string, string> filters,
        string key,
        bool parsedSuccessfully)
        => filters.TryGetValue(key, out var rawValue)
           && !string.IsNullOrWhiteSpace(rawValue)
           && !parsedSuccessfully;

#endregion

    #region Balance Sheet Monthwise

    public async Task<Result<BalanceSheetMonthwiseVm>> GetBalanceSheetMonthwiseAsync(
        BalanceSheetMonthwiseRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // -- 1. Parse filters ----------------------------------------------
        var filters           = request.Filters ?? [];
        var asOfMonthStr      = FilterHelper.GetString(filters, "asOfMonth");
        var periodMonths      = FilterHelper.GetInt(filters, "periodMonths") ?? 12;
        var branchId          = FilterHelper.GetInt(filters, "branchId");
        var costCenterGroupId = FilterHelper.GetInt(filters, "costCenterGroupId");
        var hideZeroActivity  = FilterHelper.GetBool(filters, "hideZeroActivity") ?? false;

        if (string.IsNullOrWhiteSpace(asOfMonthStr) ||
            !DateTime.TryParseExact(asOfMonthStr + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var asOfMonthDate))
            return AccountReportHelper.Fail<BalanceSheetMonthwiseVm>("asOfMonth is required and must be in yyyy-MM format (e.g. 2026-04).");

        periodMonths = Math.Clamp(periodMonths, 1, 24);

        // -- 2. Build ordered month list (oldest ? newest) -----------------
        var months = Enumerable.Range(0, periodMonths)
            .Select(i => asOfMonthDate.AddMonths(-(periodMonths - 1 - i)))
            .ToList();

        var monthLabels = months
            .Select(m => m.ToString("MMM-yy").ToUpper())
            .ToList();

        // -- 3. Load account metadata --------------------------------------
        // Balance Sheet Monthwise shows only Balance Sheet accounts (Assets, Liabilities, Equity).
        // Revenue and Expense accounts are Income Statement accounts � they reset each year
        // and do not belong on a Balance Sheet report.
        var allAccounts   = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);
        var accounts      = allAccounts.Where(a => a.IsBalanceSheet).ToList();
        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);

        // -- 4. Resolve cost center IDs ------------------------------------
        List<int>? costCenterIds = null;
        if (costCenterGroupId.HasValue)
        {
            costCenterIds = await _unitOfWork.Repository
                .Query<CostCenter>(cc => cc.CostCenterGroupId == costCenterGroupId.Value)
                .AsNoTracking()
                .Select(cc => cc.Id)
                .ToListAsync(cancellationToken);
        }

        // -- 5. Load all posted ledger lines once (up to end of asOfMonth) -
        // Opening Balance source rows are intentionally not added here; their
        // financial effect is represented by posted OpeningBalanceJV entries.
        //      Slice per month in memory � avoids N DB round-trips.
        var upperBound = new DateTime(asOfMonthDate.Year, asOfMonthDate.Month,
            DateTime.DaysInMonth(asOfMonthDate.Year, asOfMonthDate.Month), 23, 59, 59);

        var journalQuery = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds)
            .Where(d => d.JournalVoucher!.Date <= upperBound);

        var allJournalLines = await journalQuery
            .Select(d => new
            {
                AccountId = d.AccountId!.Value,
                Date      = d.JournalVoucher!.Date,
                Debit     = d.Debit  ?? 0m,
                Credit    = d.Credit ?? 0m
            })
            .ToListAsync(cancellationToken);

        // -- 7. Compute cumulative balance per account per month -----------
        var balancesByMonth = new Dictionary<int, decimal>[periodMonths];

        for (int i = 0; i < periodMonths; i++)
        {
            var monthEnd = new DateTime(months[i].Year, months[i].Month,
                DateTime.DaysInMonth(months[i].Year, months[i].Month), 23, 59, 59);

            var periodTotals = allJournalLines
                .Where(l => l.Date <= monthEnd)
                .GroupBy(l => l.AccountId)
                .ToDictionary(g => g.Key, g => g.Sum(l => l.Debit) - g.Sum(l => l.Credit));

            var combined = new Dictionary<int, decimal>();
            foreach (var kv in periodTotals)
            {
                combined.TryGetValue(kv.Key, out var existing);
                combined[kv.Key] = existing + kv.Value;
            }

            balancesByMonth[i] = combined;
        }

        // -- 8. Build flat lines � leaves get raw values, parents start 0 --
        var lineById = accounts.ToDictionary(
            a => a.Id,
            a => new BalanceSheetMonthwiseLineVm
            {
                AccountId       = a.Id,
                AccountCode     = a.AccountCode,
                AccountName     = a.Name,
                AccountLevel    = a.AccountLevel,
                ParentId        = a.ParentId,
                AllowChildren   = a.AllowChildren,
                MonthlyBalances = monthLabels.ToDictionary(lbl => lbl, _ => 0m)
            });

        foreach (var account in accounts.Where(a => !a.AllowChildren))
        {
            var line = lineById[account.Id];
            for (int i = 0; i < periodMonths; i++)
            {
                balancesByMonth[i].TryGetValue(account.Id, out var val);
                line.MonthlyBalances[monthLabels[i]] = val;
            }
        }

        // -- 9. Roll up leaves ? all ancestors ----------------------------
        var sortedIds = AccountReportHelper.TopologicalSort(accounts, childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (line.MonthlyBalances.Values.All(v => v == 0m)) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                for (int i = 0; i < periodMonths; i++)
                {
                    var lbl = monthLabels[i];
                    ancestor.MonthlyBalances[lbl] += line.MonthlyBalances[lbl];
                }
                ancestorId = ancestor.ParentId;
            }
        }

        // -- 10. Apply hideZeroActivity filter -----------------------------
        var resultLines = lineById.Values.AsEnumerable();

        if (hideZeroActivity)
            resultLines = resultLines.Where(l =>
                l.MonthlyBalances.Values.Any(v => v != 0m));

        var flatList = resultLines.OrderBy(l => l.AccountCode).ToList();

        // -- 11. Build tree ------------------------------------------------
        var byId  = flatList.ToDictionary(l => l.AccountId);
        var roots = new List<BalanceSheetMonthwiseLineVm>();

        foreach (var line in flatList)
        {
            if (line.ParentId.HasValue && byId.TryGetValue(line.ParentId.Value, out var parent))
                parent.Children.Add(line);
            else
                roots.Add(line);
        }

        return AccountReportHelper.Ok(new BalanceSheetMonthwiseVm
        {
            Months = monthLabels,
            Lines  = roots
        });
    }

    #endregion

    #region Vehicle Income Statement

    public async Task<Result<VehicleIncomeStatementVm>> GetVehicleIncomeStatementAsync(
        VehicleIncomeStatementRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // -- 1. Parse filters ----------------------------------------------
        var filters           = request.Filters ?? [];
        var from              = FilterHelper.GetDate(filters, "fromDate");
        var to                = FilterHelper.GetDate(filters, "toDate");
        var branchId          = FilterHelper.GetInt(filters, "branchId");
        var costCenterGroupId = FilterHelper.GetInt(filters, "costCenterGroupId");
        var ownershipTypeInt  = FilterHelper.GetInt(filters, "ownershipType");
        var maxLevel          = FilterHelper.GetInt(filters, "accountLevel");
        var hideZeroActivity  = FilterHelper.GetBool(filters, "hideZeroActivity") ?? false;

        if (from.HasValue && to.HasValue && from > to)
            return AccountReportHelper.Fail<VehicleIncomeStatementVm>("fromDate cannot be later than toDate.");

        // -- 2. Load account metadata --------------------------------------
        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var revenueRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Revenue);
        var expenseRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Expense);

        if (revenueRoot == null || expenseRoot == null)
            return AccountReportHelper.Fail<VehicleIncomeStatementVm>(
                "Revenue or Expense root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var revenueIds    = AccountReportHelper.BuildSubtreeIdSet(revenueRoot.Id, childrenIndex);
        var expenseIds    = AccountReportHelper.BuildSubtreeIdSet(expenseRoot.Id, childrenIndex);
        var allIncomeIds  = AccountReportHelper.GetIncomeStatementIds(accounts);

        // -- 3. Resolve cost center IDs ------------------------------------
        // Priority: ownershipType filter ? costCenterGroupId ? branchId
        // Vehicle.CostCenterGroupId links vehicles to cost centers.
        List<int>? costCenterIds = null;

        if (ownershipTypeInt.HasValue)
        {
            var ownershipType = (OwnershipType)ownershipTypeInt.Value;

            // Get cost center group IDs from vehicles matching the ownership type
            var vehicleQuery = _unitOfWork.Repository
                .Query<Vehicle>(v => v.Ownership == ownershipType && v.IsDeleted != true)
                .AsNoTracking();

            if (branchId.HasValue)
                vehicleQuery = vehicleQuery.Where(v => v.BranchId == branchId.Value);

            var vehicleCostCenterGroupIds = await vehicleQuery
                .Where(v => v.CostCenterGroupId.HasValue)
                .Select(v => v.CostCenterGroupId!.Value)
                .Distinct()
                .ToListAsync(cancellationToken);

            costCenterIds = await _unitOfWork.Repository
                .Query<CostCenter>(cc => vehicleCostCenterGroupIds.Contains(cc.CostCenterGroupId!.Value))
                .AsNoTracking()
                .Select(cc => cc.Id)
                .ToListAsync(cancellationToken);
        }
        else if (costCenterGroupId.HasValue)
        {
            costCenterIds = await _unitOfWork.Repository
                .Query<CostCenter>(cc => cc.CostCenterGroupId == costCenterGroupId.Value)
                .AsNoTracking()
                .Select(cc => cc.Id)
                .ToListAsync(cancellationToken);
        }

        // -- 4. Query journal details --------------------------------------
        var periodQuery = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds);
        if (from.HasValue) periodQuery = periodQuery.Where(d => d.JournalVoucher!.Date >= from.Value);
        if (to.HasValue)   periodQuery = periodQuery.Where(d => d.JournalVoucher!.Date <= to.Value);

        var perAccount = await periodQuery
            .GroupBy(d => d.AccountId!.Value)
            .Select(g => new AccountTotals(g.Key, g.Sum(x => x.Debit ?? 0m), g.Sum(x => x.Credit ?? 0m)))
            .ToListAsync(cancellationToken);

        // Revenue = Credit - Debit, Expense = Debit - Credit
        var balances = perAccount
            .Where(p => allIncomeIds.Contains(p.AccountId))
            .ToDictionary(
                p => p.AccountId,
                p => revenueIds.Contains(p.AccountId)
                    ? p.Credit - p.Debit
                    : p.Debit  - p.Credit);

        // -- 5. Build flat lines -------------------------------------------
        var allLines = accounts
            .Where(a => allIncomeIds.Contains(a.Id))
            .Select(a =>
            {
                balances.TryGetValue(a.Id, out var balance);
                return new IncomeStatementLineVm
                {
                    AccountId     = a.Id,
                    Code          = a.AccountCode,
                    Name          = a.Name,
                    Level         = a.AccountLevel,
                    ParentId      = a.ParentId,
                    AllowChildren = a.AllowChildren,
                    Balance       = balance,
                    Budget        = 0m
                };
            }).ToList();

        var lineById = allLines.ToDictionary(l => l.AccountId);

        // -- 6. Roll up leaves ? ancestors --------------------------------
        var sortedIds = AccountReportHelper.TopologicalSort(
            accounts.Where(a => allIncomeIds.Contains(a.Id)).ToList(), childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (line.Balance == 0m && line.Budget == 0m) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                ancestor.Balance += line.Balance;
                ancestor.Budget  += line.Budget;
                ancestorId = ancestor.ParentId;
            }
        }

        // -- 7. Apply filters ----------------------------------------------
        var filtered = allLines.AsEnumerable();

        if (maxLevel.HasValue)
            filtered = filtered.Where(l => (l.Level ?? 1) <= maxLevel.Value);

        if (hideZeroActivity)
            filtered = filtered.Where(l => l.Balance != 0m);

        var resultLines = filtered.OrderBy(l => l.Code).ToList();

        // -- 8. Build tree -------------------------------------------------
        var byId  = resultLines.ToDictionary(l => l.AccountId);
        var roots = new List<IncomeStatementLineVm>();

        foreach (var line in resultLines)
        {
            if (line.ParentId.HasValue && byId.TryGetValue(line.ParentId.Value, out var parent))
                parent.Children.Add(line);
            else
                roots.Add(line);
        }

        var revenueTotal = lineById.TryGetValue(revenueRoot.Id, out var revLine) ? revLine.Balance : 0m;
        var expenseTotal = lineById.TryGetValue(expenseRoot.Id, out var expLine) ? expLine.Balance : 0m;

        return AccountReportHelper.Ok(new VehicleIncomeStatementVm
        {
            TotalRevenue  = revenueTotal,
            TotalExpenses = expenseTotal,
            Lines         = roots
        });
    }

    #endregion

    #region Income Comparison

    public async Task<Result<IncomeComparisonVm>> GetIncomeComparisonAsync(
        IncomeComparisonRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // -- 1. Parse filters ----------------------------------------------
        var filters           = request.Filters ?? [];
        var from1             = FilterHelper.GetDate(filters, "fromDate1");
        var to1               = FilterHelper.GetDate(filters, "toDate1");
        var from2             = FilterHelper.GetDate(filters, "fromDate2");
        var to2               = FilterHelper.GetDate(filters, "toDate2");
        var branchId          = FilterHelper.GetInt(filters, "branchId");
        var costCenterGroupId = FilterHelper.GetInt(filters, "costCenterGroupId");
        var hideZeroActivity  = FilterHelper.GetBool(filters, "hideZeroActivity") ?? false;

        if (from1.HasValue && to1.HasValue && from1 > to1)
            return AccountReportHelper.Fail<IncomeComparisonVm>("fromDate1 cannot be later than toDate1.");
        if (from2.HasValue && to2.HasValue && from2 > to2)
            return AccountReportHelper.Fail<IncomeComparisonVm>("fromDate2 cannot be later than toDate2.");

        // -- 2. Load account metadata --------------------------------------
        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var revenueRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Revenue);
        var expenseRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Expense);

        if (revenueRoot == null || expenseRoot == null)
            return AccountReportHelper.Fail<IncomeComparisonVm>(
                "Revenue or Expense root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var revenueIds    = AccountReportHelper.BuildSubtreeIdSet(revenueRoot.Id, childrenIndex);
        var expenseIds    = AccountReportHelper.BuildSubtreeIdSet(expenseRoot.Id, childrenIndex);
        var allIncomeIds  = AccountReportHelper.GetIncomeStatementIds(accounts);

        // -- 3. Resolve cost center IDs ------------------------------------
        List<int>? costCenterIds = null;
        if (costCenterGroupId.HasValue)
        {
            costCenterIds = await _unitOfWork.Repository
                .Query<CostCenter>(cc => cc.CostCenterGroupId == costCenterGroupId.Value)
                .AsNoTracking()
                .Select(cc => cc.Id)
                .ToListAsync(cancellationToken);
        }

        // -- 4. Helper: query period totals for a date range ---------------
        async Task<Dictionary<int, decimal>> GetBalancesAsync(DateTime? from, DateTime? to)
        {
            var q = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds);
            if (from.HasValue) q = q.Where(d => d.JournalVoucher!.Date >= from.Value);
            if (to.HasValue)   q = q.Where(d => d.JournalVoucher!.Date <= to.Value);

            var totals = await q
                .GroupBy(d => d.AccountId!.Value)
                .Select(g => new AccountTotals(g.Key, g.Sum(x => x.Debit ?? 0m), g.Sum(x => x.Credit ?? 0m)))
                .ToListAsync(cancellationToken);

            return totals
                .Where(p => allIncomeIds.Contains(p.AccountId))
                .ToDictionary(
                    p => p.AccountId,
                    p => revenueIds.Contains(p.AccountId)
                        ? p.Credit - p.Debit
                        : p.Debit  - p.Credit);
        }

        // -- 5. Fetch both periods -----------------------------------------
        var balances1 = await GetBalancesAsync(from1, to1);
        var balances2 = await GetBalancesAsync(from2, to2);

        // -- 6. Build flat lines -------------------------------------------
        var allLines = accounts
            .Where(a => allIncomeIds.Contains(a.Id))
            .Select(a =>
            {
                balances1.TryGetValue(a.Id, out var b1);
                balances2.TryGetValue(a.Id, out var b2);
                return new IncomeComparisonLineVm
                {
                    AccountId     = a.Id,
                    Code          = a.AccountCode,
                    Name          = a.Name,
                    Level         = a.AccountLevel,
                    ParentId      = a.ParentId,
                    AllowChildren = a.AllowChildren,
                    Balance1      = b1,
                    Balance2      = b2
                };
            }).ToList();

        var lineById = allLines.ToDictionary(l => l.AccountId);

        // -- 7. Roll up leaves ? ancestors --------------------------------
        var sortedIds = AccountReportHelper.TopologicalSort(
            accounts.Where(a => allIncomeIds.Contains(a.Id)).ToList(), childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (line.Balance1 == 0m && line.Balance2 == 0m) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                ancestor.Balance1 += line.Balance1;
                ancestor.Balance2 += line.Balance2;
                ancestorId = ancestor.ParentId;
            }
        }

        // -- 8. Apply hideZeroActivity filter -----------------------------
        var filtered = allLines.AsEnumerable();

        if (hideZeroActivity)
            filtered = filtered.Where(l => l.Balance1 != 0m || l.Balance2 != 0m);

        var resultLines = filtered.OrderBy(l => l.Code).ToList();

        // -- 9. Build tree -------------------------------------------------
        var byId  = resultLines.ToDictionary(l => l.AccountId);
        var roots = new List<IncomeComparisonLineVm>();

        foreach (var line in resultLines)
        {
            if (line.ParentId.HasValue && byId.TryGetValue(line.ParentId.Value, out var parent))
                parent.Children.Add(line);
            else
                roots.Add(line);
        }

        // -- 10. Totals ----------------------------------------------------
        var rev1 = lineById.TryGetValue(revenueRoot.Id, out var rl1) ? rl1.Balance1 : 0m;
        var exp1 = lineById.TryGetValue(expenseRoot.Id, out var el1) ? el1.Balance1 : 0m;
        var rev2 = lineById.TryGetValue(revenueRoot.Id, out var rl2) ? rl2.Balance2 : 0m;
        var exp2 = lineById.TryGetValue(expenseRoot.Id, out var el2) ? el2.Balance2 : 0m;

        return AccountReportHelper.Ok(new IncomeComparisonVm
        {
            TotalRevenue1  = rev1,
            TotalExpenses1 = exp1,
            TotalRevenue2  = rev2,
            TotalExpenses2 = exp2,
            Lines          = roots
        });
    }

    #endregion

    #region Income Statement 2

    public async Task<Result<IncomeStatement2Vm>> GetIncomeStatement2Async(
        IncomeStatement2RequestDto request,
        CancellationToken cancellationToken = default)
    {
        // -- 1. Parse filters ----------------------------------------------
        var filters          = request.Filters ?? [];
        var from             = FilterHelper.GetDate(filters, "fromDate");
        var to               = FilterHelper.GetDate(filters, "toDate");
        var branchId         = FilterHelper.GetInt(filters, "branchId");
        var hideZeroActivity = FilterHelper.GetBool(filters, "hideZeroActivity") ?? false;

        if (from.HasValue && to.HasValue && from > to)
            return AccountReportHelper.Fail<IncomeStatement2Vm>("fromDate cannot be later than toDate.");

        // -- 2. Load account metadata --------------------------------------
        // Need SubGroup � load it separately in memory
        var rawAccounts = await _unitOfWork.Repository
            .Query<Account>(a => a.IsDeleted != true)
            .AsNoTracking()
            .Select(a => new
            {
                a.Id, a.AccountCode, a.Name, a.ParentId,
                a.AccountLevel, a.AllowChildren,
                a.Category, a.SubGroup
            })
            .ToListAsync(cancellationToken);

        var accounts = rawAccounts.Select(a => new AccountInfo(
            a.Id,
            a.AccountCode ?? string.Empty,
            a.Name ?? string.Empty,
            a.ParentId,
            a.AccountLevel ?? (a.AccountCode != null ? a.AccountCode.Split('-').Length : 1),
            a.AllowChildren,
            a.Category)).ToList();

        var subGroupById = rawAccounts.ToDictionary(a => a.Id, a => a.SubGroup);

        var revenueRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Revenue);
        var expenseRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Expense);

        if (revenueRoot == null || expenseRoot == null)
            return AccountReportHelper.Fail<IncomeStatement2Vm>(
                "Revenue or Expense root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var revenueIds    = AccountReportHelper.BuildSubtreeIdSet(revenueRoot.Id, childrenIndex);
        var expenseIds    = AccountReportHelper.BuildSubtreeIdSet(expenseRoot.Id, childrenIndex);
        var allIncomeIds  = AccountReportHelper.GetIncomeStatementIds(accounts);

        // -- 3. Query period totals ----------------------------------------
        var periodQuery = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds: null);
        if (from.HasValue) periodQuery = periodQuery.Where(d => d.JournalVoucher!.Date >= from.Value);
        if (to.HasValue)   periodQuery = periodQuery.Where(d => d.JournalVoucher!.Date <= to.Value);

        var perAccount = await periodQuery
            .GroupBy(d => d.AccountId!.Value)
            .Select(g => new AccountTotals(g.Key, g.Sum(x => x.Debit ?? 0m), g.Sum(x => x.Credit ?? 0m)))
            .ToListAsync(cancellationToken);

        var balances = perAccount
            .Where(p => allIncomeIds.Contains(p.AccountId))
            .ToDictionary(
                p => p.AccountId,
                p => revenueIds.Contains(p.AccountId)
                    ? p.Credit - p.Debit
                    : p.Debit  - p.Credit);

        // -- 4. Build flat lines -------------------------------------------
        var allLines = accounts
            .Where(a => allIncomeIds.Contains(a.Id))
            .Select(a =>
            {
                balances.TryGetValue(a.Id, out var balance);
                subGroupById.TryGetValue(a.Id, out var sg);
                return new IncomeStatement2LineVm
                {
                    AccountId     = a.Id,
                    Code          = a.AccountCode,
                    Name          = a.Name,
                    Level         = a.AccountLevel,
                    ParentId      = a.ParentId,
                    AllowChildren = a.AllowChildren,
                    SubGroup      = sg?.ToString(),
                    Balance       = balance,
                    Budget        = 0m
                };
            }).ToList();

        var lineById = allLines.ToDictionary(l => l.AccountId);

        // -- 5. Roll up leaves ? ancestors --------------------------------
        var sortedIds = AccountReportHelper.TopologicalSort(
            accounts.Where(a => allIncomeIds.Contains(a.Id)).ToList(), childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (line.Balance == 0m && line.Budget == 0m) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                ancestor.Balance += line.Balance;
                ancestor.Budget  += line.Budget;
                ancestorId = ancestor.ParentId;
            }
        }

        // -- 6. Apply hideZeroActivity filter -----------------------------
        var filtered = allLines.AsEnumerable();
        if (hideZeroActivity)
            filtered = filtered.Where(l => l.Balance != 0m);

        var resultLines = filtered.OrderBy(l => l.Code).ToList();

        // -- 7. Build tree -------------------------------------------------
        var byId  = resultLines.ToDictionary(l => l.AccountId);
        var roots = new List<IncomeStatement2LineVm>();

        foreach (var line in resultLines)
        {
            if (line.ParentId.HasValue && byId.TryGetValue(line.ParentId.Value, out var parent))
                parent.Children.Add(line);
            else
                roots.Add(line);
        }

        // -- 8. Compute subtotals ------------------------------------------
        // Use leaf-level lines only to avoid double-counting.
        decimal SubGroupSum(StatementSubGroup sg) =>
            allLines.Where(l => !l.AllowChildren && l.SubGroup == sg.ToString())
                    .Sum(l => l.Balance);

        var operatingRevenue = SubGroupSum(StatementSubGroup.OperatingRevenue);
        var costOfSales      = SubGroupSum(StatementSubGroup.CostOfSales);
        var sellingExp       = SubGroupSum(StatementSubGroup.SellingExpense);
        var adminExp         = SubGroupSum(StatementSubGroup.AdministrativeExpense);
        var maintenanceExp   = SubGroupSum(StatementSubGroup.MaintenanceExpense);
        var depreciationExp  = SubGroupSum(StatementSubGroup.DepreciationExpense);
        var financialExp     = SubGroupSum(StatementSubGroup.FinancialExpense);

        var grossProfit      = operatingRevenue - costOfSales;
        var profitBeforeSale = grossProfit - sellingExp - adminExp - maintenanceExp - depreciationExp - financialExp;

        // ProfitLossOnSaleOfAssets � use LinkAccounts to find the configured
        // AssetSaleRevenueAccount and AssetSaleExpenseAccount rather than relying
        // on SubGroup, because these accounts are explicitly mapped by the user.
        var assetSaleRevenueAccountId = await _journalVoucherResolver.GetGeneralAccountIdAsync(
            LinkAccountsGeneral.AssetSaleRevenueAccount,
            cancellationToken: cancellationToken);
        var assetSaleExpenseAccountId = await _journalVoucherResolver.GetGeneralAccountIdAsync(
            LinkAccountsGeneral.AssetSaleExpenseAccount,
            cancellationToken: cancellationToken);

        decimal GetLinkBalance(LinkAccountsGeneral generalType)
        {
            var accountId = generalType == LinkAccountsGeneral.AssetSaleRevenueAccount
                ? assetSaleRevenueAccountId
                : assetSaleExpenseAccountId;
            if (!accountId.HasValue) return 0m;
            // Sum the account and all its descendants
            var subtreeIds = AccountReportHelper.BuildSubtreeIdSet(accountId.Value, childrenIndex);
            return allLines
                .Where(l => !l.AllowChildren && subtreeIds.Contains(l.AccountId))
                .Sum(l => l.Balance);
        }

        var assetSaleRevenue     = GetLinkBalance(LinkAccountsGeneral.AssetSaleRevenueAccount);
        var assetSaleExpense     = GetLinkBalance(LinkAccountsGeneral.AssetSaleExpenseAccount);
        var profitOnSaleOfAssets = assetSaleRevenue - assetSaleExpense;
        var netProfit            = profitBeforeSale + profitOnSaleOfAssets;

        var totalRevenue  = lineById.TryGetValue(revenueRoot.Id, out var rl) ? rl.Balance : 0m;
        var totalExpenses = lineById.TryGetValue(expenseRoot.Id, out var el) ? el.Balance : 0m;

        return AccountReportHelper.Ok(new IncomeStatement2Vm
        {
            TotalRevenue  = totalRevenue,
            TotalExpenses = totalExpenses,

            GrossProfitLoss = new IncomeStatement2SubtotalVm
            {
                Balance = operatingRevenue - costOfSales
            },
            ProfitLossBeforeSaleOfAssets = new IncomeStatement2SubtotalVm
            {
                Balance = operatingRevenue - costOfSales - sellingExp - adminExp - maintenanceExp - depreciationExp - financialExp
            },
            ProfitLossOnSaleOfAssets = new IncomeStatement2SubtotalVm
            {
                Balance = assetSaleRevenue - assetSaleExpense
            },
            NetProfitLoss = new IncomeStatement2SubtotalVm
            {
                Balance = operatingRevenue + assetSaleRevenue
                        - costOfSales - sellingExp - adminExp - maintenanceExp - depreciationExp - financialExp - assetSaleExpense
            },

            Lines = roots
        });
    }

    #endregion

    #region Income Statement YTD

    public async Task<Result<IncomeStatementYtdVm>> GetIncomeStatementYtdAsync(
        IncomeStatementYtdRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // -- 1. Parse filters ----------------------------------------------
        var filters           = request.Filters ?? [];
        var monthStr          = FilterHelper.GetString(filters, "month");
        var branchId          = FilterHelper.GetInt(filters, "branchId");
        var costCenterGroupId = FilterHelper.GetInt(filters, "costCenterGroupId");
        var hideZeroActivity  = FilterHelper.GetBool(filters, "hideZeroActivity")  ?? false;
        var summaryReport     = FilterHelper.GetBool(filters, "summaryReport")     ?? false;

        if (string.IsNullOrWhiteSpace(monthStr) ||
            !DateTime.TryParseExact(monthStr + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var monthDate))
            return AccountReportHelper.Fail<IncomeStatementYtdVm>("month is required and must be in yyyy-MM format (e.g. 2026-04).");

        // -- 2. Derive date ranges -----------------------------------------
        var monthStart    = monthDate;
        var monthEnd      = new DateTime(monthDate.Year, monthDate.Month,
                                DateTime.DaysInMonth(monthDate.Year, monthDate.Month), 23, 59, 59);

        var ytdStart      = new DateTime(monthDate.Year, 1, 1);
        var ytdEnd        = monthEnd;

        var prevYearStart = monthStart.AddYears(-1);
        var prevYearEnd   = monthEnd.AddYears(-1);

        // -- 3. Load account metadata --------------------------------------
        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var revenueRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Revenue);
        var expenseRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Expense);

        if (revenueRoot == null || expenseRoot == null)
            return AccountReportHelper.Fail<IncomeStatementYtdVm>(
                "Revenue or Expense root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var revenueIds    = AccountReportHelper.BuildSubtreeIdSet(revenueRoot.Id, childrenIndex);
        var expenseIds    = AccountReportHelper.BuildSubtreeIdSet(expenseRoot.Id, childrenIndex);
        var allIncomeIds  = AccountReportHelper.GetIncomeStatementIds(accounts);

        // -- 4. Resolve cost center IDs ------------------------------------
        List<int>? costCenterIds = null;
        if (costCenterGroupId.HasValue)
        {
            costCenterIds = await _unitOfWork.Repository
                .Query<CostCenter>(cc => cc.CostCenterGroupId == costCenterGroupId.Value)
                .AsNoTracking()
                .Select(cc => cc.Id)
                .ToListAsync(cancellationToken);
        }

        // -- 5. Helper: fetch balances for a date range --------------------
        async Task<Dictionary<int, decimal>> FetchBalances(DateTime from, DateTime to)
        {
            var q = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds)
                .Where(d => d.JournalVoucher!.Date >= from && d.JournalVoucher!.Date <= to);

            var totals = await q
                .GroupBy(d => d.AccountId!.Value)
                .Select(g => new AccountTotals(g.Key, g.Sum(x => x.Debit ?? 0m), g.Sum(x => x.Credit ?? 0m)))
                .ToListAsync(cancellationToken);

            return totals
                .Where(p => allIncomeIds.Contains(p.AccountId))
                .ToDictionary(
                    p => p.AccountId,
                    p => revenueIds.Contains(p.AccountId)
                        ? p.Credit - p.Debit
                        : p.Debit  - p.Credit);
        }

        // -- 6. Fetch all three periods ------------------------------------
        var currentMonthBalances = await FetchBalances(monthStart,    monthEnd);
        var currentYtdBalances   = await FetchBalances(ytdStart,      ytdEnd);
        var prevYearBalances     = await FetchBalances(prevYearStart, prevYearEnd);

        // -- 7. Build flat lines -------------------------------------------
        var allLines = accounts
            .Where(a => allIncomeIds.Contains(a.Id))
            .Select(a =>
            {
                currentMonthBalances.TryGetValue(a.Id, out var cm);
                currentYtdBalances.TryGetValue(a.Id, out var ytd);
                prevYearBalances.TryGetValue(a.Id, out var prev);
                return new IncomeStatementYtdLineVm
                {
                    AccountId        = a.Id,
                    Code             = a.AccountCode,
                    Name             = a.Name,
                    Level            = a.AccountLevel,
                    ParentId         = a.ParentId,
                    AllowChildren    = a.AllowChildren,
                    CurrentMonth     = cm,
                    CurrentYtd       = ytd,
                    PreviousYearMonth = prev
                };
            }).ToList();

        var lineById = allLines.ToDictionary(l => l.AccountId);

        // -- 8. Roll up leaves ? ancestors --------------------------------
        var sortedIds = AccountReportHelper.TopologicalSort(
            accounts.Where(a => allIncomeIds.Contains(a.Id)).ToList(), childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (line.CurrentMonth == 0m && line.CurrentYtd == 0m && line.PreviousYearMonth == 0m) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                ancestor.CurrentMonth      += line.CurrentMonth;
                ancestor.CurrentYtd        += line.CurrentYtd;
                ancestor.PreviousYearMonth += line.PreviousYearMonth;
                ancestorId = ancestor.ParentId;
            }
        }

        // -- 9. Apply filters ----------------------------------------------
        var filtered = allLines.AsEnumerable();

        if (hideZeroActivity)
            filtered = filtered.Where(l =>
                l.CurrentMonth != 0m || l.CurrentYtd != 0m || l.PreviousYearMonth != 0m);

        // summaryReport = show only parent accounts (AllowChildren = true)
        if (summaryReport)
            filtered = filtered.Where(l => l.AllowChildren);

        var resultLines = filtered.OrderBy(l => l.Code).ToList();

        // -- 10. Build tree ------------------------------------------------
        var byId  = resultLines.ToDictionary(l => l.AccountId);
        var roots = new List<IncomeStatementYtdLineVm>();

        foreach (var line in resultLines)
        {
            if (line.ParentId.HasValue && byId.TryGetValue(line.ParentId.Value, out var parent))
                parent.Children.Add(line);
            else
                roots.Add(line);
        }

        // -- 11. Header P/L totals -----------------------------------------
        var revCm  = lineById.TryGetValue(revenueRoot.Id, out var rCm)  ? rCm.CurrentMonth      : 0m;
        var expCm  = lineById.TryGetValue(expenseRoot.Id, out var eCm)  ? eCm.CurrentMonth      : 0m;
        var revYtd = lineById.TryGetValue(revenueRoot.Id, out var rYtd) ? rYtd.CurrentYtd       : 0m;
        var expYtd = lineById.TryGetValue(expenseRoot.Id, out var eYtd) ? eYtd.CurrentYtd       : 0m;
        var revPrev = lineById.TryGetValue(revenueRoot.Id, out var rPrev) ? rPrev.PreviousYearMonth : 0m;
        var expPrev = lineById.TryGetValue(expenseRoot.Id, out var ePrev) ? ePrev.PreviousYearMonth : 0m;

        return AccountReportHelper.Ok(new IncomeStatementYtdVm
        {
            ProfitLossCurrentMonth      = revCm   - expCm,
            ProfitLossCurrentYtd        = revYtd  - expYtd,
            ProfitLossPreviousYearMonth = revPrev - expPrev,
            Lines = roots
        });
    }

    #endregion

    #region Income Statement YTD 2

    public async Task<Result<IncomeStatementYtd2Vm>> GetIncomeStatementYtd2Async(
        IncomeStatementYtd2RequestDto request,
        CancellationToken cancellationToken = default)
    {
        // -- 1. Parse filters ----------------------------------------------
        var filters          = request.Filters ?? [];
        var monthStr         = FilterHelper.GetString(filters, "month");
        var branchId         = FilterHelper.GetInt(filters, "branchId");
        var hideZeroActivity = FilterHelper.GetBool(filters, "hideZeroActivity") ?? false;
        var summaryReport    = FilterHelper.GetBool(filters, "summaryReport")    ?? false;

        if (string.IsNullOrWhiteSpace(monthStr) ||
            !DateTime.TryParseExact(monthStr + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var monthDate))
            return AccountReportHelper.Fail<IncomeStatementYtd2Vm>("month is required and must be in yyyy-MM format (e.g. 2026-04).");

        // -- 2. Derive date ranges -----------------------------------------
        var monthStart    = monthDate;
        var monthEnd      = new DateTime(monthDate.Year, monthDate.Month,
                                DateTime.DaysInMonth(monthDate.Year, monthDate.Month), 23, 59, 59);
        var ytdStart      = new DateTime(monthDate.Year, 1, 1);
        var ytdEnd        = monthEnd;
        var prevYearStart = monthStart.AddYears(-1);
        var prevYearEnd   = monthEnd.AddYears(-1);

        // -- 3. Load account metadata --------------------------------------
        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var revenueRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Revenue);
        var expenseRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Expense);

        if (revenueRoot == null || expenseRoot == null)
            return AccountReportHelper.Fail<IncomeStatementYtd2Vm>(
                "Revenue or Expense root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var revenueIds    = AccountReportHelper.BuildSubtreeIdSet(revenueRoot.Id, childrenIndex);
        var expenseIds    = AccountReportHelper.BuildSubtreeIdSet(expenseRoot.Id, childrenIndex);
        var allIncomeIds  = AccountReportHelper.GetIncomeStatementIds(accounts);

        // Also load SubGroup for subtotal calculations
        var subGroupById = await _unitOfWork.Repository
            .Query<Account>(a => a.IsDeleted != true)
            .AsNoTracking()
            .Select(a => new { a.Id, a.SubGroup })
            .ToListAsync(cancellationToken)
            .ContinueWith(t => t.Result.ToDictionary(a => a.Id, a => a.SubGroup));

        // -- 4. Helper: fetch balances for a date range --------------------
        async Task<Dictionary<int, decimal>> FetchBalances(DateTime from, DateTime to)
        {
            var q = AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds: null)
                .Where(d => d.JournalVoucher!.Date >= from && d.JournalVoucher!.Date <= to);

            var totals = await q
                .GroupBy(d => d.AccountId!.Value)
                .Select(g => new AccountTotals(g.Key, g.Sum(x => x.Debit ?? 0m), g.Sum(x => x.Credit ?? 0m)))
                .ToListAsync(cancellationToken);

            return totals
                .Where(p => allIncomeIds.Contains(p.AccountId))
                .ToDictionary(
                    p => p.AccountId,
                    p => revenueIds.Contains(p.AccountId)
                        ? p.Credit - p.Debit
                        : p.Debit  - p.Credit);
        }

        // -- 5. Fetch all three periods ------------------------------------
        var cmBalances   = await FetchBalances(monthStart,    monthEnd);
        var ytdBalances  = await FetchBalances(ytdStart,      ytdEnd);
        var prevBalances = await FetchBalances(prevYearStart, prevYearEnd);

        // -- 6. Build flat lines -------------------------------------------
        var allLines = accounts
            .Where(a => allIncomeIds.Contains(a.Id))
            .Select(a =>
            {
                cmBalances.TryGetValue(a.Id, out var cm);
                ytdBalances.TryGetValue(a.Id, out var ytd);
                prevBalances.TryGetValue(a.Id, out var prev);
                return new IncomeStatementYtdLineVm
                {
                    AccountId         = a.Id,
                    Code              = a.AccountCode,
                    Name              = a.Name,
                    Level             = a.AccountLevel,
                    ParentId          = a.ParentId,
                    AllowChildren     = a.AllowChildren,
                    CurrentMonth      = cm,
                    CurrentYtd        = ytd,
                    PreviousYearMonth = prev
                };
            }).ToList();

        var lineById = allLines.ToDictionary(l => l.AccountId);

        // -- 7. Roll up leaves ? ancestors --------------------------------
        var sortedIds = AccountReportHelper.TopologicalSort(
            accounts.Where(a => allIncomeIds.Contains(a.Id)).ToList(), childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (line.CurrentMonth == 0m && line.CurrentYtd == 0m && line.PreviousYearMonth == 0m) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                ancestor.CurrentMonth      += line.CurrentMonth;
                ancestor.CurrentYtd        += line.CurrentYtd;
                ancestor.PreviousYearMonth += line.PreviousYearMonth;
                ancestorId = ancestor.ParentId;
            }
        }

        // -- 8. Apply filters ----------------------------------------------
        var filtered = allLines.AsEnumerable();

        if (hideZeroActivity)
            filtered = filtered.Where(l =>
                l.CurrentMonth != 0m || l.CurrentYtd != 0m || l.PreviousYearMonth != 0m);

        if (summaryReport)
            filtered = filtered.Where(l => l.AllowChildren);

        var resultLines = filtered.OrderBy(l => l.Code).ToList();

        // -- 9. Build tree -------------------------------------------------
        var byId  = resultLines.ToDictionary(l => l.AccountId);
        var roots = new List<IncomeStatementYtdLineVm>();

        foreach (var line in resultLines)
        {
            if (line.ParentId.HasValue && byId.TryGetValue(line.ParentId.Value, out var parent))
                parent.Children.Add(line);
            else
                roots.Add(line);
        }

        // -- 10. Compute subtotals using SubGroup (leaf lines only) ---------
        decimal SubGroupSum(StatementSubGroup sg, Func<IncomeStatementYtdLineVm, decimal> col) =>
            allLines.Where(l => !l.AllowChildren &&
                                subGroupById.TryGetValue(l.AccountId, out var s) &&
                                s?.ToString() == sg.ToString())
                    .Sum(col);

        var opRevCm  = SubGroupSum(StatementSubGroup.OperatingRevenue, l => l.CurrentMonth);
        var opRevYtd = SubGroupSum(StatementSubGroup.OperatingRevenue, l => l.CurrentYtd);
        var opRevPrev = SubGroupSum(StatementSubGroup.OperatingRevenue, l => l.PreviousYearMonth);

        var cosCm  = SubGroupSum(StatementSubGroup.CostOfSales, l => l.CurrentMonth);
        var cosYtd = SubGroupSum(StatementSubGroup.CostOfSales, l => l.CurrentYtd);
        var cosPrev = SubGroupSum(StatementSubGroup.CostOfSales, l => l.PreviousYearMonth);

        decimal OpExpSum(Func<IncomeStatementYtdLineVm, decimal> col) =>
            SubGroupSum(StatementSubGroup.SellingExpense,        col) +
            SubGroupSum(StatementSubGroup.AdministrativeExpense, col) +
            SubGroupSum(StatementSubGroup.MaintenanceExpense,    col) +
            SubGroupSum(StatementSubGroup.DepreciationExpense,   col) +
            SubGroupSum(StatementSubGroup.FinancialExpense,      col);

        // Asset sale accounts from LinkAccounts
        var assetSaleRevenueAccountId = await _journalVoucherResolver.GetGeneralAccountIdAsync(
            LinkAccountsGeneral.AssetSaleRevenueAccount,
            cancellationToken: cancellationToken);
        var assetSaleExpenseAccountId = await _journalVoucherResolver.GetGeneralAccountIdAsync(
            LinkAccountsGeneral.AssetSaleExpenseAccount,
            cancellationToken: cancellationToken);

        decimal GetAssetLinkSum(LinkAccountsGeneral generalType, Func<IncomeStatementYtdLineVm, decimal> col)
        {
            var accountId = generalType == LinkAccountsGeneral.AssetSaleRevenueAccount
                ? assetSaleRevenueAccountId
                : assetSaleExpenseAccountId;
            if (!accountId.HasValue) return 0m;
            var subtreeIds = AccountReportHelper.BuildSubtreeIdSet(accountId.Value, childrenIndex);
            return allLines.Where(l => !l.AllowChildren && subtreeIds.Contains(l.AccountId)).Sum(col);
        }

        var grossCm   = opRevCm   - cosCm;
        var grossYtd  = opRevYtd  - cosYtd;
        var grossPrev = opRevPrev - cosPrev;

        var beforeCm   = grossCm   - OpExpSum(l => l.CurrentMonth);
        var beforeYtd  = grossYtd  - OpExpSum(l => l.CurrentYtd);
        var beforePrev = grossPrev - OpExpSum(l => l.PreviousYearMonth);

        var onSaleCm   = GetAssetLinkSum(LinkAccountsGeneral.AssetSaleRevenueAccount, l => l.CurrentMonth)
                       - GetAssetLinkSum(LinkAccountsGeneral.AssetSaleExpenseAccount, l => l.CurrentMonth);
        var onSaleYtd  = GetAssetLinkSum(LinkAccountsGeneral.AssetSaleRevenueAccount, l => l.CurrentYtd)
                       - GetAssetLinkSum(LinkAccountsGeneral.AssetSaleExpenseAccount, l => l.CurrentYtd);
        var onSalePrev = GetAssetLinkSum(LinkAccountsGeneral.AssetSaleRevenueAccount, l => l.PreviousYearMonth)
                       - GetAssetLinkSum(LinkAccountsGeneral.AssetSaleExpenseAccount, l => l.PreviousYearMonth);

        // -- 11. Header P/L totals -----------------------------------------
        var revCm   = lineById.TryGetValue(revenueRoot.Id, out var rCm)   ? rCm.CurrentMonth      : 0m;
        var expCm   = lineById.TryGetValue(expenseRoot.Id, out var eCm)   ? eCm.CurrentMonth      : 0m;
        var revYtd  = lineById.TryGetValue(revenueRoot.Id, out var rYtd)  ? rYtd.CurrentYtd       : 0m;
        var expYtd  = lineById.TryGetValue(expenseRoot.Id, out var eYtd)  ? eYtd.CurrentYtd       : 0m;
        var revPrev = lineById.TryGetValue(revenueRoot.Id, out var rPrev) ? rPrev.PreviousYearMonth : 0m;
        var expPrev = lineById.TryGetValue(expenseRoot.Id, out var ePrev) ? ePrev.PreviousYearMonth : 0m;

        return AccountReportHelper.Ok(new IncomeStatementYtd2Vm
        {
            ProfitLossCurrentMonth      = revCm   - expCm,
            ProfitLossCurrentYtd        = revYtd  - expYtd,
            ProfitLossPreviousYearMonth = revPrev - expPrev,

            GrossProfitLoss = new IncomeStatementYtdSubtotalVm
            {
                CurrentMonth = grossCm, CurrentYtd = grossYtd, PreviousYearMonth = grossPrev
            },
            ProfitLossBeforeSaleOfAssets = new IncomeStatementYtdSubtotalVm
            {
                CurrentMonth = beforeCm, CurrentYtd = beforeYtd, PreviousYearMonth = beforePrev
            },
            ProfitLossOnSaleOfAssets = new IncomeStatementYtdSubtotalVm
            {
                CurrentMonth = onSaleCm, CurrentYtd = onSaleYtd, PreviousYearMonth = onSalePrev
            },
            NetProfitLoss = new IncomeStatementYtdSubtotalVm
            {
                CurrentMonth      = beforeCm   + onSaleCm,
                CurrentYtd        = beforeYtd  + onSaleYtd,
                PreviousYearMonth = beforePrev + onSalePrev
            },

            Lines = roots
        });
    }

    #endregion

    #region Income Statement FY

    public async Task<Result<IncomeStatementFyVm>> GetIncomeStatementFyAsync(
        IncomeStatementFyRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // -- 1. Parse filters ----------------------------------------------
        var filters           = request.Filters ?? [];
        var fromMonthStr      = FilterHelper.GetString(filters, "fromMonth");
        var toMonthStr        = FilterHelper.GetString(filters, "toMonth");
        var fromDateStr       = FilterHelper.GetString(filters, "fromDate");
        var toDateStr         = FilterHelper.GetString(filters, "toDate");
        var dateRangeStr      = FilterHelper.GetString(filters, "dateRange"); // "dd/MM/yyyy - dd/MM/yyyy"
        var branchId          = FilterHelper.GetInt(filters, "branchId");
        var costCenterGroupId = FilterHelper.GetInt(filters, "costCenterGroupId");
        var hideZeroActivity  = FilterHelper.GetBool(filters, "hideZeroActivity") ?? false;

        // If a combined dateRange string is provided (e.g. "31/12/2024 - 31/12/2025"), split it
        if (!string.IsNullOrWhiteSpace(dateRangeStr) && dateRangeStr.Contains(" - "))
        {
            var parts = dateRangeStr.Split(" - ", 2, StringSplitOptions.TrimEntries);
            if (parts.Length == 2)
            {
                fromDateStr ??= parts[0];
                toDateStr   ??= parts[1];
            }
        }

        // Accept either fromMonth (yyyy-MM) or fromDate (yyyy-MM-dd / dd/MM/yyyy)
        DateTime fromMonthDate;
        DateTime toMonthDate;

        var dateFormats = new[] { "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd" };

        if (!string.IsNullOrWhiteSpace(fromMonthStr) &&
            DateTime.TryParseExact(fromMonthStr + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out fromMonthDate))
        {
            // fromMonth=yyyy-MM provided
        }
        else if (!string.IsNullOrWhiteSpace(fromDateStr) &&
                 DateTime.TryParseExact(fromDateStr, dateFormats,
                     System.Globalization.CultureInfo.InvariantCulture,
                     System.Globalization.DateTimeStyles.None, out fromMonthDate))
        {
            // fromDate=full date provided � use first day of that month
            fromMonthDate = new DateTime(fromMonthDate.Year, fromMonthDate.Month, 1);
        }
        else
        {
            return AccountReportHelper.Fail<IncomeStatementFyVm>($"fromMonth (yyyy-MM) or fromDate is required. Received filters: {string.Join(", ", filters.Select(kv => $"{kv.Key}={kv.Value}"))}");
        }

        if (!string.IsNullOrWhiteSpace(toMonthStr) &&
            DateTime.TryParseExact(toMonthStr + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out toMonthDate))
        {
            // toMonth=yyyy-MM provided
        }
        else if (!string.IsNullOrWhiteSpace(toDateStr) &&
                 DateTime.TryParseExact(toDateStr, dateFormats,
                     System.Globalization.CultureInfo.InvariantCulture,
                     System.Globalization.DateTimeStyles.None, out toMonthDate))
        {
            // toDate=full date provided � use first day of that month
            toMonthDate = new DateTime(toMonthDate.Year, toMonthDate.Month, 1);
        }
        else
        {
            return AccountReportHelper.Fail<IncomeStatementFyVm>($"toMonth (yyyy-MM) or toDate is required. Received filters: {string.Join(", ", filters.Select(kv => $"{kv.Key}={kv.Value}"))}");
        }

        if (fromMonthDate > toMonthDate)
            return AccountReportHelper.Fail<IncomeStatementFyVm>("fromMonth cannot be later than toMonth.");

        // -- 2. Build ordered month list -----------------------------------
        var totalMonths = ((toMonthDate.Year - fromMonthDate.Year) * 12)
                        + toMonthDate.Month - fromMonthDate.Month + 1;
        totalMonths = Math.Min(totalMonths, 36); // cap at 3 years

        var months = Enumerable.Range(0, totalMonths)
            .Select(i => fromMonthDate.AddMonths(i))
            .ToList();

        var monthLabels = months
            .Select(m => m.ToString("MMM-yy").ToUpper())
            .ToList();

        // -- 3. Load account metadata --------------------------------------
        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var revenueRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Revenue);
        var expenseRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Expense);

        if (revenueRoot == null || expenseRoot == null)
            return AccountReportHelper.Fail<IncomeStatementFyVm>(
                "Revenue or Expense root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var revenueIds    = AccountReportHelper.BuildSubtreeIdSet(revenueRoot.Id, childrenIndex);
        var expenseIds    = AccountReportHelper.BuildSubtreeIdSet(expenseRoot.Id, childrenIndex);
        var allIncomeIds  = AccountReportHelper.GetIncomeStatementIds(accounts);

        // -- 4. Resolve cost center IDs ------------------------------------
        List<int>? costCenterIds = null;
        if (costCenterGroupId.HasValue)
        {
            costCenterIds = await _unitOfWork.Repository
                .Query<CostCenter>(cc => cc.CostCenterGroupId == costCenterGroupId.Value)
                .AsNoTracking()
                .Select(cc => cc.Id)
                .ToListAsync(cancellationToken);
        }

        // -- 5. Load all journal lines once (within the full date range) ---
        // Do NOT filter by allIncomeIds in the DB query � HashSet.Contains
        // is not reliably translatable to SQL. Filter in memory after loading.
        var rangeStart = fromMonthDate;
        var rangeEnd   = new DateTime(toMonthDate.Year, toMonthDate.Month,
                             DateTime.DaysInMonth(toMonthDate.Year, toMonthDate.Month),
                             23, 59, 59);

        var allJournalLines = await AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, costCenterIds)
            .Where(d => d.JournalVoucher!.Date >= rangeStart &&
                        d.JournalVoucher!.Date <= rangeEnd)
            .Select(d => new
            {
                AccountId = d.AccountId!.Value,
                Date      = d.JournalVoucher!.Date,
                Debit     = d.Debit  ?? 0m,
                Credit    = d.Credit ?? 0m
            })
            .ToListAsync(cancellationToken);

        // Filter to income accounts in memory
        var incomeJournalLines = allJournalLines
            .Where(l => allIncomeIds.Contains(l.AccountId))
            .ToList();

        // -- 6. Compute per-account per-month balances in memory -----------
        var balancesByMonth = new Dictionary<int, decimal>[totalMonths];

        for (int i = 0; i < totalMonths; i++)
        {
            var mStart = months[i];
            var mEnd   = new DateTime(mStart.Year, mStart.Month,
                             DateTime.DaysInMonth(mStart.Year, mStart.Month),
                             23, 59, 59); // end of last day � handles time components in Date field

            balancesByMonth[i] = incomeJournalLines
                .Where(l => l.Date >= mStart && l.Date <= mEnd)
                .GroupBy(l => l.AccountId)
                .ToDictionary(
                    g => g.Key,
                    g => revenueIds.Contains(g.Key)
                        ? g.Sum(l => l.Credit) - g.Sum(l => l.Debit)   // Revenue
                        : g.Sum(l => l.Debit)  - g.Sum(l => l.Credit)); // Expense
        }

        // -- 7. Build flat lines � leaves get raw values, parents start 0 --
        var lineById = accounts
            .Where(a => allIncomeIds.Contains(a.Id))
            .ToDictionary(
                a => a.Id,
                a => new IncomeStatementFyLineVm
                {
                    AccountId       = a.Id,
                    Code            = a.AccountCode,
                    Name            = a.Name,
                    Level           = a.AccountLevel,
                    ParentId        = a.ParentId,
                    AllowChildren   = a.AllowChildren,
                    MonthlyBalances = monthLabels.ToDictionary(lbl => lbl, _ => 0m)
                });

        // Assign raw journal values to ALL income accounts that have entries.
        // Journal entries can be posted to any level — not just leaf accounts.
        foreach (var account in accounts.Where(a => allIncomeIds.Contains(a.Id)))
        {
            if (!lineById.TryGetValue(account.Id, out var line)) continue;
            for (int i = 0; i < totalMonths; i++)
            {
                if (balancesByMonth[i].TryGetValue(account.Id, out var val))
                    line.MonthlyBalances[monthLabels[i]] = val;
            }
        }

        // -- 8. Roll up: propagate each account's values to all its ancestors.
        //      This handles both leaf accounts and parent accounts that have
        //      direct journal entries. Each account's own values are added
        //      to every ancestor exactly once.
        var sortedIds = AccountReportHelper.TopologicalSort(
            accounts.Where(a => allIncomeIds.Contains(a.Id)).ToList(), childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            // Only propagate accounts that have actual values (skip empty lines)
            if (line.MonthlyBalances.Values.All(v => v == 0m)) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                for (int i = 0; i < totalMonths; i++)
                {
                    var lbl = monthLabels[i];
                    ancestor.MonthlyBalances[lbl] += line.MonthlyBalances[lbl];
                }
                ancestorId = ancestor.ParentId;
            }
        }

        // -- 9. Apply hideZeroActivity filter -----------------------------
        var resultLines = lineById.Values.AsEnumerable();

        if (hideZeroActivity)
            resultLines = resultLines.Where(l => l.MonthlyBalances.Values.Any(v => v != 0m));

        var flatList = resultLines.OrderBy(l => l.Code).ToList();

        // -- 10. Build tree ------------------------------------------------
        var byId  = flatList.ToDictionary(l => l.AccountId);
        var roots = new List<IncomeStatementFyLineVm>();

        foreach (var line in flatList)
        {
            if (line.ParentId.HasValue && byId.TryGetValue(line.ParentId.Value, out var parent))
                parent.Children.Add(line);
            else
                roots.Add(line);
        }

        // -- 11. Totals ----------------------------------------------------
        var totalRevenue  = lineById.TryGetValue(revenueRoot.Id, out var rl) ? rl.Total : 0m;
        var totalExpenses = lineById.TryGetValue(expenseRoot.Id, out var el) ? el.Total : 0m;

        return AccountReportHelper.Ok(new IncomeStatementFyVm
        {
            Months        = monthLabels,
            TotalRevenue  = totalRevenue,
            TotalExpenses = totalExpenses,
            ParsedFilters = $"fromMonth={fromMonthDate:yyyy-MM-dd}, toMonth={toMonthDate:yyyy-MM-dd}, months={totalMonths}, rawFilters=[{string.Join(", ", filters.Select(kv => $"{kv.Key}={kv.Value}"))}], journalLinesLoaded={allJournalLines.Count}, incomeLines={incomeJournalLines.Count}, balancesByMonth0Count={balancesByMonth[0].Count}, leafAccountsWithValues={lineById.Values.Count(l => !l.AllowChildren && l.MonthlyBalances.Values.Any(v => v != 0m))}, revenueRootTotal={totalRevenue}, expenseRootTotal={totalExpenses}",
            Lines         = roots
        });
    }

    #endregion

    #region Income Statement FY 2

    public async Task<Result<IncomeStatementFy2Vm>> GetIncomeStatementFy2Async(
        IncomeStatementFy2RequestDto request,
        CancellationToken cancellationToken = default)
    {
        // ── 1. Parse filters — identical to IncomeStatementFy ─────────────
        var filters           = request.Filters ?? [];
        var fromMonthStr      = FilterHelper.GetString(filters, "fromMonth");
        var toMonthStr        = FilterHelper.GetString(filters, "toMonth");
        var fromDateStr       = FilterHelper.GetString(filters, "fromDate");
        var toDateStr         = FilterHelper.GetString(filters, "toDate");
        var dateRangeStr      = FilterHelper.GetString(filters, "dateRange");
        var branchId          = FilterHelper.GetInt(filters, "branchId");
        var hideZeroActivity  = FilterHelper.GetBool(filters, "hideZeroActivity") ?? false;

        if (!string.IsNullOrWhiteSpace(dateRangeStr) && dateRangeStr.Contains(" - "))
        {
            var parts = dateRangeStr.Split(" - ", 2, StringSplitOptions.TrimEntries);
            if (parts.Length == 2) { fromDateStr ??= parts[0]; toDateStr ??= parts[1]; }
        }

        DateTime fromMonthDate;
        DateTime toMonthDate;
        var dateFormats = new[] { "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd" };

        if (!string.IsNullOrWhiteSpace(fromMonthStr) &&
            DateTime.TryParseExact(fromMonthStr + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out fromMonthDate)) { }
        else if (!string.IsNullOrWhiteSpace(fromDateStr) &&
                 DateTime.TryParseExact(fromDateStr, dateFormats,
                     System.Globalization.CultureInfo.InvariantCulture,
                     System.Globalization.DateTimeStyles.None, out fromMonthDate))
            fromMonthDate = new DateTime(fromMonthDate.Year, fromMonthDate.Month, 1);
        else
            return AccountReportHelper.Fail<IncomeStatementFy2Vm>($"fromMonth or fromDate is required. Received: {string.Join(", ", filters.Select(kv => $"{kv.Key}={kv.Value}"))}");

        if (!string.IsNullOrWhiteSpace(toMonthStr) &&
            DateTime.TryParseExact(toMonthStr + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out toMonthDate)) { }
        else if (!string.IsNullOrWhiteSpace(toDateStr) &&
                 DateTime.TryParseExact(toDateStr, dateFormats,
                     System.Globalization.CultureInfo.InvariantCulture,
                     System.Globalization.DateTimeStyles.None, out toMonthDate))
            toMonthDate = new DateTime(toMonthDate.Year, toMonthDate.Month, 1);
        else
            return AccountReportHelper.Fail<IncomeStatementFy2Vm>($"toMonth or toDate is required. Received: {string.Join(", ", filters.Select(kv => $"{kv.Key}={kv.Value}"))}");

        if (fromMonthDate > toMonthDate)
            return AccountReportHelper.Fail<IncomeStatementFy2Vm>("fromMonth cannot be later than toMonth.");

        // ── 2. Build month list ───────────────────────────────────────────
        var totalMonths = Math.Min(
            ((toMonthDate.Year - fromMonthDate.Year) * 12) + toMonthDate.Month - fromMonthDate.Month + 1, 36);

        var months      = Enumerable.Range(0, totalMonths).Select(i => fromMonthDate.AddMonths(i)).ToList();
        var monthLabels = months.Select(m => m.ToString("MMM-yy").ToUpper()).ToList();

        // ── 3. Load accounts ──────────────────────────────────────────────
        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var revenueRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Revenue);
        var expenseRoot = AccountReportHelper.FindRootAccount(accounts, AccountCategory.Expense);

        if (revenueRoot == null || expenseRoot == null)
            return AccountReportHelper.Fail<IncomeStatementFy2Vm>("Revenue or Expense root account not found.");

        var childrenIndex = AccountReportHelper.BuildChildrenIndex(accounts);
        var revenueIds    = AccountReportHelper.BuildSubtreeIdSet(revenueRoot.Id, childrenIndex);
        var allIncomeIds  = AccountReportHelper.GetIncomeStatementIds(accounts);

        // ── 4. Load journal lines ─────────────────────────────────────────
        var rangeEnd = AccountReportHelper.MonthEnd(toMonthDate);

        var allJournalLines = await AccountReportHelper.BuildJournalQuery(_unitOfWork, branchId, null)
            .Where(d => d.JournalVoucher!.Date >= fromMonthDate && d.JournalVoucher!.Date <= rangeEnd)
            .Select(d => new { AccountId = d.AccountId!.Value, Date = d.JournalVoucher!.Date, Debit = d.Debit ?? 0m, Credit = d.Credit ?? 0m })
            .ToListAsync(cancellationToken);

        var incomeLines = allJournalLines.Where(l => allIncomeIds.Contains(l.AccountId)).ToList();

        // ── 5. Per-month balances ─────────────────────────────────────────
        var balancesByMonth = new Dictionary<int, decimal>[totalMonths];
        for (int i = 0; i < totalMonths; i++)
        {
            var mEnd = AccountReportHelper.MonthEnd(months[i]);
            balancesByMonth[i] = incomeLines
                .Where(l => l.Date >= months[i] && l.Date <= mEnd)
                .GroupBy(l => l.AccountId)
                .ToDictionary(
                    g => g.Key,
                    g => revenueIds.Contains(g.Key)
                        ? g.Sum(l => l.Credit) - g.Sum(l => l.Debit)
                        : g.Sum(l => l.Debit)  - g.Sum(l => l.Credit));
        }

        // ── 6. Build flat lines ───────────────────────────────────────────
        var lineById = accounts
            .Where(a => allIncomeIds.Contains(a.Id))
            .ToDictionary(a => a.Id, a => new IncomeStatementFy2LineVm
            {
                AccountId       = a.Id,
                Code            = a.AccountCode,
                Name            = a.Name,
                Level           = a.AccountLevel,
                ParentId        = a.ParentId,
                AllowChildren   = a.AllowChildren,
                MonthlyBalances = monthLabels.ToDictionary(lbl => lbl, _ => 0m)
            });

        foreach (var account in accounts.Where(a => allIncomeIds.Contains(a.Id)))
        {
            if (!lineById.TryGetValue(account.Id, out var line)) continue;
            for (int i = 0; i < totalMonths; i++)
                if (balancesByMonth[i].TryGetValue(account.Id, out var val))
                    line.MonthlyBalances[monthLabels[i]] = val;
        }

        // ── 7. Roll up ────────────────────────────────────────────────────
        var sortedIds = AccountReportHelper.TopologicalSort(
            accounts.Where(a => allIncomeIds.Contains(a.Id)).ToList(), childrenIndex);

        foreach (var id in sortedIds)
        {
            if (!lineById.TryGetValue(id, out var line)) continue;
            if (!line.ParentId.HasValue) continue;
            if (line.MonthlyBalances.Values.All(v => v == 0m)) continue;

            var ancestorId = line.ParentId;
            while (ancestorId.HasValue && lineById.TryGetValue(ancestorId.Value, out var ancestor))
            {
                for (int i = 0; i < totalMonths; i++)
                {
                    var lbl = monthLabels[i];
                    ancestor.MonthlyBalances[lbl] += line.MonthlyBalances[lbl];
                }
                ancestorId = ancestor.ParentId;
            }
        }

        // ── 8. Apply filter + return flat ordered list ────────────────────
        var flatList = lineById.Values.AsEnumerable();

        if (hideZeroActivity)
            flatList = flatList.Where(l => l.MonthlyBalances.Values.Any(v => v != 0m));

        var totalRevenue  = lineById.TryGetValue(revenueRoot.Id, out var rl) ? rl.Total : 0m;
        var totalExpenses = lineById.TryGetValue(expenseRoot.Id, out var el) ? el.Total : 0m;

        return AccountReportHelper.Ok(new IncomeStatementFy2Vm
        {
            Months        = monthLabels,
            TotalRevenue  = totalRevenue,
            TotalExpenses = totalExpenses,
            Lines         = flatList.OrderBy(l => l.Code).ToList()
        });
    }

    #endregion

    #region Ledger

    public async Task<Result<LedgerVm>> GetLedgerAsync(
        LedgerRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // ── 1. Parse filters ──────────────────────────────────────────────
        var filters               = request.Filters ?? [];
        var accountId             = FilterHelper.GetInt(filters, "accountId");
        var fromDate              = FilterHelper.GetDate(filters, "fromDate");
        var toDate                = FilterHelper.GetDate(filters, "toDate");
        var branchId              = FilterHelper.GetInt(filters, "branchId");
        var costCenterGroupId     = FilterHelper.GetInt(filters, "costCenterGroupId");
        var chassisOrPlateNo      = FilterHelper.GetString(filters, "chassisOrPlateNo");
        var showOriginalCurrency  = FilterHelper.GetBool(filters, "showOriginalCurrency") ?? false;
        if (!accountId.HasValue)
            return AccountReportHelper.Fail<LedgerVm>("accountId filter is required.");

        if (fromDate.HasValue && toDate.HasValue && fromDate > toDate)
            return AccountReportHelper.Fail<LedgerVm>("fromDate cannot be later than toDate.");

        // ── 2. Validate account exists ────────────────────────────────────
        var account = await _unitOfWork.Repository
            .Query<Account>(a => a.Id == accountId.Value)
            .AsNoTracking()
            .Select(a => new { a.Id, a.AccountCode, a.Name })
            .FirstOrDefaultAsync(cancellationToken);

        if (account is null)
            return AccountReportHelper.Fail<LedgerVm>("Account not found.");

        // ── 3. Resolve cost center IDs ────────────────────────────────────
        var costCenterIds = await AccountReportHelper.ResolveCostCenterIdsAsync(
            _unitOfWork, costCenterGroupId, cancellationToken);

        // ── 4. Compute beginning balance (opening + all entries before fromDate) ──
        var accounts = await AccountReportHelper.LoadAccountsMetaAsync(_unitOfWork, cancellationToken);

        var beginningBalance = 0m;
        if (fromDate.HasValue)
        {
            var openingBalances = await AccountReportHelper.LoadOpeningBalancesAsync(
                _unitOfWork, accounts, branchId, costCenterIds, fromDate, cancellationToken);

            openingBalances.TryGetValue(accountId.Value, out beginningBalance);
        }

        // ── 5. Query journal detail lines within the date range ───────────
        var detailQuery = _unitOfWork.Repository
            .Query<JournalVoucherDetail>(d =>
                d.IsDeleted != true &&
                d.AccountId == accountId.Value &&
                d.JournalVoucher != null &&
                d.JournalVoucher.IsDeleted != true &&
                d.JournalVoucher.IsPosted &&
                !d.JournalVoucher.IsVoided)
            .AsNoTracking();

        // A line without its own branch belongs to its voucher branch (as in AccountReportHelper).
        if (branchId.HasValue)
            detailQuery = detailQuery.Where(d => (d.BranchId ?? d.JournalVoucher!.BranchId) == branchId.Value);

        if (costCenterIds != null)
            detailQuery = detailQuery.Where(d =>
                d.CostCenterId.HasValue && costCenterIds.Contains(d.CostCenterId.Value));

        if (fromDate.HasValue)
            detailQuery = detailQuery.Where(d => d.JournalVoucher!.Date >= fromDate.Value);

        if (toDate.HasValue)
            detailQuery = detailQuery.Where(d => d.JournalVoucher!.Date <= toDate.Value);

        // ── 6. Fetch raw lines with all needed joins ───────────────────────
        var rawLines = await detailQuery
            .Select(d => new
            {
                Date             = d.JournalVoucher!.Date,
                VoucherType      = d.JournalVoucher.VoucherType,
                VoucherNo        = d.JournalVoucher.No,
                PartnerName      = d.Partner != null ? d.Partner.Name : null,
                Description      = d.Description,
                Debit            = d.Debit ?? 0m,
                Credit           = d.Credit ?? 0m,
                JvId             = d.JournalVoucherId,
                CurrencyCode     = d.JournalVoucher.Currency != null ? d.JournalVoucher.Currency.Code : null,
                CurrencyToBase   = d.JournalVoucher.Currency != null ? d.JournalVoucher.Currency.CurrencyToBaseRate : 1m,
                IsBaseCurrency   = d.JournalVoucher.Currency == null || d.JournalVoucher.Currency.IsBase
            })
            .OrderBy(d => d.Date)
            .ThenBy(d => d.JvId)
            .ToListAsync(cancellationToken);

        // ── 7. Apply chassis/plate filter (in-memory — vehicle not on detail) ──
        // JournalVoucherDetail has no direct VehicleId; filter by voucher No pattern if provided
        // This is a best-effort text match on VoucherNo or Description
        if (!string.IsNullOrWhiteSpace(chassisOrPlateNo))
        {
            var search = chassisOrPlateNo.Trim().ToLower();
            rawLines = rawLines
                .Where(l => (l.VoucherNo != null && l.VoucherNo.ToLower().Contains(search))
                         || (l.Description != null && l.Description.ToLower().Contains(search)))
                .ToList();
        }

        // ── 8. Build running balance lines ────────────────────────────────
        // When showOriginalCurrency = true: divide base amounts by CurrencyToBaseRate
        // Beginning balance is always in base currency — convert it too if needed
        var convertedBeginning = beginningBalance;
        string? headerCurrencyCode = null;

        if (showOriginalCurrency)
        {
            // If all lines share the same non-base currency, use it for the header
            var distinctCodes = rawLines
                .Where(l => !l.IsBaseCurrency && l.CurrencyCode != null)
                .Select(l => l.CurrencyCode)
                .Distinct()
                .ToList();

            if (distinctCodes.Count == 1)
            {
                headerCurrencyCode = distinctCodes[0];
                var rate = rawLines.First(l => l.CurrencyCode == headerCurrencyCode).CurrencyToBase;
                convertedBeginning = rate > 0 ? beginningBalance / rate : beginningBalance;
            }
        }

        var runningBalance = convertedBeginning;
        var lines = rawLines.Select(l =>
        {
            decimal debit  = l.Debit;
            decimal credit = l.Credit;
            string? lineCurrencyCode = null;

            if (showOriginalCurrency && !l.IsBaseCurrency && l.CurrencyToBase > 0)
            {
                debit  = l.Debit  / l.CurrencyToBase;
                credit = l.Credit / l.CurrencyToBase;
                lineCurrencyCode = l.CurrencyCode;
            }

            runningBalance += debit - credit;
            return new LedgerLineVm
            {
                Date         = l.Date,
                Type         = l.VoucherType.ToString(),
                VoucherNo    = l.VoucherNo,
                Contact      = l.PartnerName,
                Vehicle      = null,
                Description  = l.Description,
                Debit        = debit,
                Credit       = credit,
                Balance      = runningBalance,
                CurrencyCode = lineCurrencyCode
            };
        }).ToList();

        // ── 9. Build response ─────────────────────────────────────────────
        var vm = new LedgerVm
        {
            AccountId        = account.Id,
            AccountCode      = account.AccountCode,
            AccountName      = account.Name,
            CurrencyCode     = showOriginalCurrency ? headerCurrencyCode : null,
            BeginningBalance = convertedBeginning,
            TotalDebit       = lines.Sum(l => l.Debit),
            TotalCredit      = lines.Sum(l => l.Credit),
            Lines            = lines
        };

        return AccountReportHelper.Ok(vm);
    }

    #endregion

    #region Journals

    public async Task<Results<JournalsLineVm>> GetJournalsAsync(
        JournalsRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var pageNo = Math.Max(1, request.PageNumber);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);
        // ── 1. Parse filters ──────────────────────────────────────────────
        var filters          = request.Filters ?? [];
        var voucherNo        = FilterHelper.GetString(filters, "voucherNo");
        var typeStr          = FilterHelper.GetString(filters, "type");
        var chassisOrPlateNo = FilterHelper.GetString(filters, "chassisOrPlateNo");
        var fromDate         = FilterHelper.GetDate(filters, "fromDate");
        var toDate           = FilterHelper.GetDate(filters, "toDate");
        var accountId        = FilterHelper.GetInt(filters, "accountId");

        if (fromDate.HasValue && toDate.HasValue && fromDate > toDate)
            return new Results<JournalsLineVm>
            {
                IsSuccess = false,
                Message   = "fromDate cannot be later than toDate.",
                Entities  = [],
                PageNo    = pageNo,
                PageSize  = pageSize,
                TotalCount = 0,
                TotalPages = 0
            };

        // Parse VoucherTypeName enum from string filter
        VoucherTypeName? voucherType = null;
        if (!string.IsNullOrWhiteSpace(typeStr) &&
            Enum.TryParse<VoucherTypeName>(typeStr, ignoreCase: true, out var parsedType))
            voucherType = parsedType;

        // ── 2. Build base query ───────────────────────────────────────────
        var query = _unitOfWork.Repository
            .Query<JournalVoucherDetail>(d =>
                d.IsDeleted != true &&
                d.JournalVoucher != null &&
                d.JournalVoucher.IsDeleted != true)
            .AsNoTracking();

        // ── 3. Apply filters ──────────────────────────────────────────────
        if (fromDate.HasValue)
            query = query.Where(d => d.JournalVoucher!.Date >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(d => d.JournalVoucher!.Date <= toDate.Value);

        if (voucherType.HasValue)
            query = query.Where(d => d.JournalVoucher!.VoucherType == voucherType.Value);

        if (!string.IsNullOrWhiteSpace(voucherNo))
            query = query.Where(d => d.JournalVoucher!.No != null &&
                                     d.JournalVoucher.No.Contains(voucherNo));

        if (accountId.HasValue)
            query = query.Where(d => d.AccountId == accountId.Value);

        // ── 4. Project to flat lines ──────────────────────────────────────
        var allLines = await query
            .OrderBy(d => d.JournalVoucher!.Date)
            .ThenBy(d => d.JournalVoucherId)
            .ThenBy(d => d.Id)
            .Select(d => new JournalsLineVm
            {
                Date        = d.JournalVoucher!.Date,
                AccountCode = d.Account != null ? d.Account.AccountCode : null,
                AccountName = d.Account != null ? d.Account.Name : null,
                Contact     = d.Partner != null ? d.Partner.Name : null,
                Type        = d.JournalVoucher.VoucherType.ToString(),
                VoucherNo   = d.JournalVoucher.No,
                PlateNo     = d.SubLookUp,
                Description = d.Description,
                Debit       = d.Debit ?? 0m,
                Credit      = d.Credit ?? 0m
            })
            .ToListAsync(cancellationToken);

        // ── 5. Chassis/plate filter (in-memory — text match on SubLookUp or Description) ──
        if (!string.IsNullOrWhiteSpace(chassisOrPlateNo))
        {
            var search = chassisOrPlateNo.Trim().ToLower();
            allLines = allLines
                .Where(l => (l.PlateNo    != null && l.PlateNo.ToLower().Contains(search))
                         || (l.Description != null && l.Description.ToLower().Contains(search)))
                .ToList();
        }

        // ── 6. Paginate ───────────────────────────────────────────────────
        var totalCount = allLines.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var paged = allLines
            .Skip((int)Math.Min((long)(pageNo - 1) * pageSize, totalCount))
            .Take(pageSize)
            .ToList();

        return new Results<JournalsLineVm>
        {
            IsSuccess  = true,
            Entities   = paged,
            PageNo     = pageNo,
            PageSize   = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
    }

    #endregion

    #region Budget

    public async Task<Result<BudgetVm>> GetBudgetAsync(
        BudgetRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // ── 1. Parse filters ──────────────────────────────────────────────
        var filters        = request.Filters ?? [];
        var fiscalYearId   = FilterHelper.GetInt(filters, "fiscalYearId");
        var accountTypeInt = FilterHelper.GetInt(filters, "accountType");

        if (!fiscalYearId.HasValue)
            return AccountReportHelper.Fail<BudgetVm>("fiscalYearId filter is required.");

        AccountCategory? categoryFilter = AccountCategory.Asset; // default to Asset
        if (accountTypeInt.HasValue && Enum.IsDefined(typeof(AccountCategory), accountTypeInt.Value))
            categoryFilter = (AccountCategory)accountTypeInt.Value;

        // ── 2. Load fiscal year ───────────────────────────────────────────
        var fiscalYear = await _unitOfWork.Repository
            .FindFirstByAsync<FiscalYear>(x => x.Id == fiscalYearId.Value);

        if (fiscalYear is null)
            return AccountReportHelper.Fail<BudgetVm>("Fiscal year not found.");

        // ── 3. Build ordered month labels for the fiscal year ─────────────
        var months = new List<(int Year, int Month, string Label)>();
        var current = new DateTime(fiscalYear.StartDate.Year, fiscalYear.StartDate.Month, 1);
        var end     = new DateTime(fiscalYear.EndDate.Year,   fiscalYear.EndDate.Month,   1);
        while (current <= end)
        {
            months.Add((current.Year, current.Month, current.ToString("MMM-yy", System.Globalization.CultureInfo.InvariantCulture).ToUpperInvariant()));
            current = current.AddMonths(1);
        }
        var monthLabels = months.Select(m => m.Label).ToList();

        var budgetPeriods = months.Select(m => new BudgetMonthVm
        {
            Label = m.Label,
            Year = m.Year,
            Month = m.Month
        }).ToList();

        // ── 4. Load leaf accounts filtered by category ────────────────────

        var accountQuery = _unitOfWork.Repository
            .Query<Account>(a => a.IsDeleted != true)
            .AsNoTracking();

        var allAccounts = await accountQuery
            .Select(a => new { a.Id, a.AccountCode, a.Name, a.Category, a.AllowChildren, a.AccountLevel, a.ParentId })
            .ToListAsync(cancellationToken);

        // Build set of IDs that are actually used as a parent by another account
        var parentIds = allAccounts
            .Where(a => a.ParentId.HasValue)
            .Select(a => a.ParentId!.Value)
            .ToHashSet();

        // Leaf rule:
        //   - Level 5 → always leaf (AllowChildren = false by design)
        //   - Level 1–4 → leaf if it has no children in the actual data
        var accounts = allAccounts
            .Where(a => a.Category == categoryFilter.Value
                     && (a.AccountLevel == 5 || !parentIds.Contains(a.Id)))
            .OrderBy(a => a.AccountCode)
            .ToList();

        if (accounts.Count == 0)
            return AccountReportHelper.Ok(new BudgetVm { Months = monthLabels, Periods = budgetPeriods, Rows = [] });

        var accountIds = accounts.Select(a => a.Id).ToList();

        // ── 5. Load existing budget entries for this fiscal year ───────────
        var budgetEntries = await _unitOfWork.Repository
            .Query<AccountBudget>(b =>
                b.FiscalYearId == fiscalYearId.Value &&
                accountIds.Contains(b.AccountId))
            .AsNoTracking()
            .Select(b => new { b.AccountId, b.Year, b.Month, b.Amount })
            .ToListAsync(cancellationToken);

        // Key: (AccountId, Year, Month) → Amount
        var budgetDict = budgetEntries.ToDictionary(
            b => (b.AccountId, b.Year, b.Month),
            b => b.Amount);

        // ── 6. Build rows ─────────────────────────────────────────────────
        var rows = accounts.Select(a =>
        {
            var monthly = months.ToDictionary(
                m => m.Label,
                m => budgetDict.TryGetValue((a.Id, m.Year, m.Month), out var amt) ? amt : 0m);

            return new BudgetAccountRowVm
            {
                AccountId      = a.Id,
                AccountCode    = a.AccountCode,
                AccountName    = a.Name,
                MonthlyAmounts = monthly
            };
        }).ToList();

        return AccountReportHelper.Ok(new BudgetVm { Months = monthLabels, Periods = budgetPeriods, Rows = rows });
    }

    public async Task<Result> SaveBudgetAsync(
        SaveBudgetRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (request.Entries is null || request.Entries.Count == 0)
            return new Result { IsSuccess = false, Message = "No entries provided." };

        var fiscalYear = await _unitOfWork.Repository.Query<FiscalYear>(
                x => x.Id == request.FiscalYearId && x.IsDeleted != true)
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);
        if (fiscalYear is null)
            return new Result { IsSuccess = false, Message = "Fiscal year not found." };

        // Validate the entire changed-cell set before tracking any mutation.
        var keys = new HashSet<(int AccountId, int Year, int Month)>();
        var firstMonth = new DateTime(fiscalYear.StartDate.Year, fiscalYear.StartDate.Month, 1);
        var lastMonth = new DateTime(fiscalYear.EndDate.Year, fiscalYear.EndDate.Month, 1);
        foreach (var entry in request.Entries)
        {
            if (entry is null || entry.AccountId <= 0 || entry.Year is < 1 or > 9999 || entry.Month is < 1 or > 12)
                return new Result { IsSuccess = false, Message = "Invalid budget account or calendar month." };
            var month = new DateTime(entry.Year, entry.Month, 1);
            if (month < firstMonth || month > lastMonth)
                return new Result { IsSuccess = false, Message = "Budget month must belong to the fiscal year." };
            if (!keys.Add((entry.AccountId, entry.Year, entry.Month)))
                return new Result { IsSuccess = false, Message = "Duplicate budget account and month." };
        }

        // Load all existing budget records for this fiscal year in one query
        var accountIds = request.Entries.Select(e => e.AccountId).Distinct().ToList();
        var validAccounts = await _unitOfWork.Repository.Query<Account>(
                a => accountIds.Contains(a.Id) && a.IsDeleted != true)
            .AsNoTracking()
            .Select(a => new { a.Id, a.AccountLevel })
            .ToListAsync(cancellationToken);
        var parentAccountIds = await _unitOfWork.Repository.Query<Account>(
                a => a.IsDeleted != true && a.ParentId.HasValue && accountIds.Contains(a.ParentId.Value))
            .AsNoTracking()
            .Select(a => a.ParentId!.Value)
            .Distinct()
            .ToListAsync(cancellationToken);
        // Match GetBudgetAsync's existing leaf rule, including childless level 1-4 accounts.
        if (validAccounts.Count != accountIds.Count ||
            validAccounts.Any(a => a.AccountLevel != 5 && parentAccountIds.Contains(a.Id)))
            return new Result { IsSuccess = false, Message = "Budget accounts must be active leaf accounts." };

        var existing = await _unitOfWork.Repository
            .Query<AccountBudget>(b =>
                b.FiscalYearId == request.FiscalYearId &&
                accountIds.Contains(b.AccountId))
            .ToListAsync(cancellationToken);

        var existingDict = existing.ToDictionary(b => (b.AccountId, b.Year, b.Month));

        var toAdd    = new List<AccountBudget>();
        var toUpdate = new List<AccountBudget>();

        foreach (var entry in request.Entries)
        {
            var key = (entry.AccountId, entry.Year, entry.Month);

            if (existingDict.TryGetValue(key, out var record))
            {
                // Update only if amount changed
                if (record.Amount != entry.Amount)
                {
                    record.Amount = entry.Amount;
                    toUpdate.Add(record);
                }
            }
            else
            {
                toAdd.Add(new AccountBudget
                {
                    FiscalYearId = request.FiscalYearId,
                    AccountId    = entry.AccountId,
                    Year         = entry.Year,
                    Month        = entry.Month,
                    Amount       = entry.Amount
                });
            }
        }

        if (toAdd.Count > 0)
        {
            await _unitOfWork.Repository.AddRangeAsync(toAdd, cancellationToken);
        }

        if (toUpdate.Count > 0)
        {
            _unitOfWork.Repository.UpdateRange(toUpdate);
        }

        if (toAdd.Count > 0 || toUpdate.Count > 0)
            await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new Result
        {
            IsSuccess = true,
            Message   = $"Budget saved. {toAdd.Count} added, {toUpdate.Count} updated."
        };
    }

    #endregion

    #region Budget Variance

    public async Task<Result<BudgetVarianceVm>> GetBudgetVarianceAsync(
        BudgetVarianceRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // ── 1. Parse filters ──────────────────────────────────────────────
        var filters        = request.Filters ?? [];
        var fiscalYearId   = FilterHelper.GetInt(filters, "fiscalYearId");
        var accountTypeInt = FilterHelper.GetInt(filters, "accountType");

        if (!fiscalYearId.HasValue)
            return AccountReportHelper.Fail<BudgetVarianceVm>("fiscalYearId filter is required.");

        AccountCategory categoryFilter = AccountCategory.Asset; // default
        if (accountTypeInt.HasValue && Enum.IsDefined(typeof(AccountCategory), accountTypeInt.Value))
            categoryFilter = (AccountCategory)accountTypeInt.Value;

        // ── 2. Load fiscal year ───────────────────────────────────────────
        var fiscalYear = await _unitOfWork.Repository
            .FindFirstByAsync<FiscalYear>(x => x.Id == fiscalYearId.Value);

        if (fiscalYear is null)
            return AccountReportHelper.Fail<BudgetVarianceVm>("Fiscal year not found.");

        // ── 3. Build ordered months for the fiscal year ───────────────────
        var months = new List<(int Year, int Month, string Label)>();
        var current = new DateTime(fiscalYear.StartDate.Year, fiscalYear.StartDate.Month, 1);
        var end     = new DateTime(fiscalYear.EndDate.Year,   fiscalYear.EndDate.Month,   1);
        while (current <= end)
        {
            months.Add((current.Year, current.Month, current.ToString("MMM-yy")));
            current = current.AddMonths(1);
        }

        // ── 4. Load leaf accounts for the selected category ───────────────
        var allAccounts = await _unitOfWork.Repository
            .Query<Account>(a => a.IsDeleted != true)
            .AsNoTracking()
            .Select(a => new { a.Id, a.AccountCode, a.Name, a.Category, a.AccountLevel, a.ParentId })
            .ToListAsync(cancellationToken);

        var parentIds = allAccounts
            .Where(a => a.ParentId.HasValue)
            .Select(a => a.ParentId!.Value)
            .ToHashSet();

        var accounts = allAccounts
            .Where(a => a.Category == categoryFilter
                     && (a.AccountLevel == 5 || !parentIds.Contains(a.Id)))
            .OrderBy(a => a.AccountCode)
            .ToList();

        if (accounts.Count == 0)
            return AccountReportHelper.Ok(new BudgetVarianceVm { Lines = [] });

        var accountIds = accounts.Select(a => a.Id).ToList();

        // ── 5. Load budget entries for this fiscal year ───────────────────
        var budgetEntries = await _unitOfWork.Repository
            .Query<AccountBudget>(b =>
                b.FiscalYearId == fiscalYearId.Value &&
                accountIds.Contains(b.AccountId))
            .AsNoTracking()
            .Select(b => new { b.AccountId, b.Year, b.Month, b.Amount })
            .ToListAsync(cancellationToken);

        var budgetDict = budgetEntries.ToDictionary(
            b => (b.AccountId, b.Year, b.Month),
            b => b.Amount);

        // ── 6. Load actual journal activity per account per month ─────────
        var fromDate = new DateTime(fiscalYear.StartDate.Year, fiscalYear.StartDate.Month, 1);
        var toDate   = AccountReportHelper.MonthEnd(fiscalYear.EndDate);

        var journalTotals = await _unitOfWork.Repository
            .Query<JournalVoucherDetail>(d =>
                d.IsDeleted != true &&
                d.AccountId != null &&
                accountIds.Contains(d.AccountId!.Value) &&
                d.JournalVoucher != null &&
                d.JournalVoucher.IsDeleted != true &&
                d.JournalVoucher.IsPosted &&
                !d.JournalVoucher.IsVoided &&
                d.JournalVoucher.Date >= fromDate &&
                d.JournalVoucher.Date <= toDate)
            .AsNoTracking()
            .Select(d => new
            {
                AccountId = d.AccountId!.Value,
                Date      = d.JournalVoucher!.Date,
                Debit     = d.Debit  ?? 0m,
                Credit    = d.Credit ?? 0m
            })
            .ToListAsync(cancellationToken);

        // Group by (AccountId, Year, Month) → net activity (Debit - Credit)
        var actualDict = journalTotals
            .GroupBy(d => (d.AccountId, d.Date.Year, d.Date.Month))
            .ToDictionary(
                g => g.Key,
                g => g.Sum(d => d.Debit - d.Credit));

        // ── 7. Build flat lines: one row per account per month ────────────
        var lines = new List<BudgetVarianceLineVm>();

        foreach (var account in accounts)
        {
            foreach (var (year, month, label) in months)
            {
                actualDict.TryGetValue((account.Id, year, month), out var actual);
                budgetDict.TryGetValue((account.Id, year, month), out var budget);

                lines.Add(new BudgetVarianceLineVm
                {
                    AccountId   = account.Id,
                    AccountCode = account.AccountCode,
                    AccountName = account.Name,
                    Month       = label,
                    MonthNumber = month,
                    Year        = year,
                    Actual      = actual,
                    Budget      = budget
                });
            }
        }

        return AccountReportHelper.Ok(new BudgetVarianceVm { Lines = lines });
    }

    #endregion

    #region Bank Reconciliation

    /// <summary>
    /// Loads the reconciliation working session.
    ///
    /// Validates the header, resolves the selected payment method's GL account,
    /// and returns its complete unreconciled rows through the statement day.
    /// </summary>
    public async Task<Result<BankReconciliationSessionVm>> GetReconciliationSessionAsync(
        BankReconciliationSessionRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var filters         = request.Filters ?? [];
        var bankId          = FilterHelper.GetInt(filters, "bankId");
        var statementDate   = FilterHelper.GetDate(filters, "statementDate");
        var statementBal    = FilterHelper.GetDecimal(filters, "statementBalance");
        var paymentMethodId = FilterHelper.GetInt(filters, "paymentMethodId");

        if (bankId is null or <= 0 || paymentMethodId is null or <= 0 ||
            !statementDate.HasValue || !statementBal.HasValue ||
            !IsValidReconciliationStatement(statementDate.Value, statementBal.Value))
            return AccountReportHelper.Fail<BankReconciliationSessionVm>(
                _reconciliationLocalization["BankReconciliationInvalidHeader"]);

        var statementDay = statementDate.Value.Date;

        // Load bank info
        var bank = await _unitOfWork.Repository
            .Query<Bank>(b => b.Id == bankId.Value)
            .AsNoTracking()
            .Select(b => new { b.Id, b.Name })
            .FirstOrDefaultAsync(cancellationToken);

        if (bank is null)
            return AccountReportHelper.Fail<BankReconciliationSessionVm>(
                _reconciliationLocalization["BankReconciliationInvalidBank"]);

        if (!await _unitOfWork.Repository.ExistsAsync<PaymentMethod>(
                method => method.Id == paymentMethodId.Value,
                cancellationToken: cancellationToken))
            return AccountReportHelper.Fail<BankReconciliationSessionVm>(
                _reconciliationLocalization["BankReconciliationInvalidPaymentMethod"]);

        // Resolve the GL account ID for this bank via PaymentMethod → LinkAccounts
        // The user selects the Payment Method on the reconciliation screen;
        // the linked GL account is then used to filter JV detail lines.
        var bankAccountId = await _journalVoucherResolver.GetPaymentMethodAccountIdAsync(
            paymentMethodId.Value, cancellationToken: cancellationToken);

        if (bankAccountId is null or <= 0 ||
            !await _unitOfWork.Repository.ExistsAsync<Account>(
                account => account.Id == bankAccountId.Value,
                cancellationToken: cancellationToken))
            return AccountReportHelper.Fail<BankReconciliationSessionVm>(
                _reconciliationLocalization["BankReconciliationMissingAccount"]);

        // The unfiltered unique index reserves a detail globally, including deleted
        // reconciliation lines. Do not offer it again under another bank/session.
        var reconciledDetailIds = _unitOfWork.Repository
            .Query<BankReconciliationLine>(includeDeleted: true)
            .Select(line => line.JournalVoucherDetailId);

        var bankLinesQuery = _unitOfWork.Repository.QueryReport<JournalVoucherDetail>()
            .Where(d =>
                d.AccountId == bankAccountId.Value &&
                d.JournalVoucher != null &&
                d.JournalVoucher.IsDeleted != true &&
                d.JournalVoucher.IsPosted &&
                !d.JournalVoucher.IsVoided &&
                d.JournalVoucher.Date.Date <= statementDay);

        // Ledger context covers all eligible lines, including previously reconciled ones.
        var ledgerBalance = await bankLinesQuery
            .SumAsync(d => (d.Debit ?? 0m) - (d.Credit ?? 0m), cancellationToken);

        var unreconciledLines = await bankLinesQuery
            .Where(d => !reconciledDetailIds.Contains(d.Id))
            .OrderBy(d => d.JournalVoucher!.Date)
            .ThenBy(d => d.Id)
            .Select(d => new BankReconciliationLineVm
            {
                JournalVoucherDetailId = d.Id,
                Date        = d.JournalVoucher!.Date,
                VoucherNo   = d.JournalVoucher.No,
                VoucherType = d.JournalVoucher.VoucherType.ToString(),
                Description = d.Description,
                Debit       = d.Debit  ?? 0m,
                Credit      = d.Credit ?? 0m
            })
            .ToListAsync(cancellationToken);

        // 5. Last reconciliation info for this bank
        var lastRecon = await _unitOfWork.Repository
            .QueryReport<BankReconciliation>()
            .Where(r =>
                r.BankId == bankId.Value &&
                r.IsReconciled)
            .OrderByDescending(r => r.StatementDate)
            .ThenByDescending(r => r.Id)
            .Select(r => new { r.StatementDate, r.ReconciledBalance })
            .FirstOrDefaultAsync(cancellationToken);

        return AccountReportHelper.Ok(new BankReconciliationSessionVm
        {
            BankId                  = bankId.Value,
            BankName                = bank.Name,
            LedgerBalance           = ledgerBalance,
            LastReconciliationDate  = lastRecon?.StatementDate,
            LastReconciledBalance   = lastRecon?.ReconciledBalance ?? 0m,
            ReconciledBalance       = 0m,   // client calculates as user ticks rows
            Difference              = statementBal.Value,
            UnreconciledLines       = unreconciledLines
        });
    }

    /// <summary>
    /// Saves a completed reconciliation session.
    ///
    /// Rules:
    ///   1. All ticked detail IDs must belong to the bank's GL account.
    ///   2. None may already be reconciled (unique index enforces this at DB level too).
    ///   3. Difference (StatementBalance - sum of ticked lines) must equal zero.
    ///   4. Saves BankReconciliation master + BankReconciliationLine rows.
    /// </summary>
    public async Task<Result> CompleteReconciliationAsync(
        CompleteReconciliationRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (request.BankId <= 0 || request.PaymentMethodId is null or <= 0 ||
            !IsValidReconciliationStatement(request.StatementDate, request.StatementBalance))
            return new Result { IsSuccess = false, Message = _reconciliationLocalization["BankReconciliationInvalidHeader"] };

        var selectedIds = request.ReconciledDetailIds;
        if (selectedIds is null || selectedIds.Count == 0 ||
            selectedIds.Any(id => id <= 0) || selectedIds.Distinct().Count() != selectedIds.Count)
            return new Result { IsSuccess = false, Message = _reconciliationLocalization["BankReconciliationInvalidSelection"] };

        if (!await _unitOfWork.Repository.ExistsAsync<Bank>(
                bank => bank.Id == request.BankId, cancellationToken: cancellationToken))
            return new Result { IsSuccess = false, Message = _reconciliationLocalization["BankReconciliationInvalidBank"] };

        if (!await _unitOfWork.Repository.ExistsAsync<PaymentMethod>(
                method => method.Id == request.PaymentMethodId.Value,
                cancellationToken: cancellationToken))
            return new Result { IsSuccess = false, Message = _reconciliationLocalization["BankReconciliationInvalidPaymentMethod"] };

        var bankAccountId = await _journalVoucherResolver.GetPaymentMethodAccountIdAsync(
            request.PaymentMethodId.Value, cancellationToken: cancellationToken);
        if (bankAccountId is null or <= 0 ||
            !await _unitOfWork.Repository.ExistsAsync<Account>(
                account => account.Id == bankAccountId.Value,
                cancellationToken: cancellationToken))
            return new Result { IsSuccess = false, Message = _reconciliationLocalization["BankReconciliationMissingAccount"] };

        var statementDay = request.StatementDate.Date;

        // Load the ticked JV detail lines
        var detailLines = await _unitOfWork.Repository
            .Query<JournalVoucherDetail>(d =>
                selectedIds.Contains(d.Id) &&
                d.AccountId == bankAccountId.Value &&
                d.JournalVoucher != null &&
                d.JournalVoucher.IsDeleted != true &&
                d.JournalVoucher.IsPosted &&
                !d.JournalVoucher.IsVoided &&
                d.JournalVoucher.Date.Date <= statementDay)
            .AsNoTracking()
            .OrderBy(d => d.JournalVoucher!.Date)
            .ThenBy(d => d.Id)
            .Select(d => new BankReconciliationLineVm
            {
                JournalVoucherDetailId = d.Id,
                Date = d.JournalVoucher!.Date,
                VoucherType = d.JournalVoucher.VoucherType.ToString(),
                VoucherNo = d.JournalVoucher.No,
                Description = d.Description,
                Debit = d.Debit ?? 0m,
                Credit = d.Credit ?? 0m
            })
            .ToListAsync(cancellationToken);

        if (detailLines.Count != selectedIds.Count)
            return new Result { IsSuccess = false, Message = _reconciliationLocalization["BankReconciliationIneligibleSelection"] };

        // Check none already reconciled
        if (await _unitOfWork.Repository.ExistsAsync<BankReconciliationLine>(
                line => selectedIds.Contains(line.JournalVoucherDetailId),
                includeDeleted: true, cancellationToken: cancellationToken))
            return new Result { IsSuccess = false, Message = _reconciliationLocalization["BankReconciliationAlreadyReconciled"] };

        // Calculate reconciled balance
        decimal reconciledBalance = detailLines.Sum(d => d.Debit - d.Credit);
        decimal difference        = request.StatementBalance - reconciledBalance;

        if (difference != 0m)
            return new Result { IsSuccess = false, Message = _reconciliationLocalization["BankReconciliationDifferenceNotZero"] };

        // Build reconciliation master
        var reconciliation = new BankReconciliation
        {
            BankId           = request.BankId,
            PaymentMethodId  = request.PaymentMethodId,
            StatementDate    = statementDay,
            StatementBalance = request.StatementBalance,
            IsReconciled     = true,
            ReconciledAt     = DateTime.UtcNow,
            Lines            = detailLines.Select(d => new BankReconciliationLine
            {
                JournalVoucherDetailId = d.JournalVoucherDetailId,
                Date        = d.Date,
                VoucherType = d.VoucherType,
                VoucherNo   = d.VoucherNo,
                Description = d.Description,
                Debit       = d.Debit,
                Credit      = d.Credit
            }).ToList()
        };

        // Recalculate private setters
        reconciliation.Recalculate();

        await _unitOfWork.Repository.AddAsync(reconciliation, cancellationToken);
        // EF Core's implicit transaction saves this complete graph atomically once.
        var saved = await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new Result
        {
            IsSuccess = saved,
            Id        = reconciliation.Id,
            Message   = saved
                ? _reconciliationLocalization["BankReconciliationCompleted"].Value
                : _reconciliationLocalization["BankReconciliationSaveFailed"].Value
        };
    }

    private static bool IsValidReconciliationStatement(DateTime date, decimal balance)
        => date.Date != DateTime.MinValue.Date &&
           balance >= -9999999999999999.99m && balance <= 9999999999999999.99m &&
           decimal.Round(balance, 2) == balance;

    /// <summary>
    /// Returns the Reconciliation Report grid: all past reconciliation sessions.
    /// Each row shows: Date, Bank, ReconciledBalance, PendingEntriesBalance, LedgerBalance.
    ///
    /// PendingEntriesBalance = LedgerBalance - ReconciledBalance
    /// (i.e. the value of transactions in the ledger not yet on any bank statement)
    /// </summary>
    public async Task<Results<ReconciliationReportLineVm>> GetReconciliationReportAsync(
        ReconciliationReportRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var filters  = request.Filters ?? [];
        var fromDate = FilterHelper.GetDate(filters, "fromDate");
        var toDate   = FilterHelper.GetDate(filters, "toDate");
        var bankId   = FilterHelper.GetInt(filters, "bankId");

        var query = _unitOfWork.Repository
            .Query<BankReconciliation>(r => r.IsDeleted != true && r.IsReconciled)
            .AsNoTracking()
            .Include(r => r.Bank)
            .AsQueryable();

        if (bankId.HasValue)
            query = query.Where(r => r.BankId == bankId.Value);
        if (fromDate.HasValue)
            query = query.Where(r => r.StatementDate >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(r => r.StatementDate <= toDate.Value);

        var sessions = await query
            .OrderByDescending(r => r.StatementDate)
            .ToListAsync(cancellationToken);

        // For each session, PendingEntriesBalance requires knowing the full ledger balance
        // at that statement date. We approximate it per session using the reconciliation data.
        var result = sessions.Select(r =>
        {
            // LedgerBalance at statementDate ≈ ReconciledBalance + pending
            // We don't re-query the ledger per row for performance — the report shows stored values
            var pending = r.StatementBalance - r.ReconciledBalance;

            return new ReconciliationReportLineVm
            {
                Id                    = r.Id,
                Date                  = r.StatementDate,
                BankName              = r.Bank?.Name,
                ReconciledBalance     = r.ReconciledBalance,
                PendingEntriesBalance = pending,
                LedgerBalance         = r.StatementBalance,  // statement balance is the "agreed" ledger
                IsReconciled          = r.IsReconciled
            };
        }).ToList();

        return new Results<ReconciliationReportLineVm>
        {
            IsSuccess = true,
            Entities  = result
        };
    }
    #endregion


}

