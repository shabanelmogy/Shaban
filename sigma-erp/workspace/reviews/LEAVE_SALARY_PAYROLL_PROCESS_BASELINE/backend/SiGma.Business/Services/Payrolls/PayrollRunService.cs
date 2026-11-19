using System.Data;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using SiGma.Business.Resolver;
using SiGma.Helpers.Helpers;
using SiGma.ViewModels.ViewModels.PayrollRun;

namespace SiGma.Business.Services.Payrolls;

// A stateful payroll workspace deliberately has no generic amount/status CRUD surface.
public sealed class PayrollRunService : IPayrollRunService
{
    private const string PolicyVersion = "MonthlySalarySnapshot-v1";
    private readonly IUnitOfWork<SiGmaDbContext> _unitOfWork;
    private readonly FinancialNumberPolicyResolver _moneyPolicy;
    private readonly IStringLocalizer<GeneralMessage> _localization;
    private readonly IHttpContextAccessor _httpContext;

    public PayrollRunService(IUnitOfWork<SiGmaDbContext> unitOfWork,
        FinancialNumberPolicyResolver moneyPolicy, IStringLocalizer<GeneralMessage> localization,
        IHttpContextAccessor httpContext)
    {
        _unitOfWork = unitOfWork;
        _moneyPolicy = moneyPolicy;
        _localization = localization;
        _httpContext = httpContext;
    }

    public async Task<Result<PayrollRunVm>> CalculateAsync(PayrollCalculateVm request,
        CancellationToken cancellationToken = default)
    {
        if (!TryPeriod(request.Period, out var start))
            return new() { Message = _localization["PayrollPeriodInvalid"] };
        // One consistent read across mutable salary/time/deduction inputs.
        await using var transaction = await _unitOfWork.Context.Database
            .BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);
        var run = await _unitOfWork.Repository.Query<PayrollRun>(x => x.PeriodStart == start)
            .AsNoTracking().SingleOrDefaultAsync(cancellationToken);
        var calculated = await CalculateCoreAsync(start, run, cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return calculated.Result;
    }

    public async Task<Result<PayrollRunVm>> SaveAsync(PayrollSaveVm request,
        CancellationToken cancellationToken = default)
    {
        if (!TryPeriod(request.Period, out var start) || string.IsNullOrWhiteSpace(request.ExpectedVersion))
            return new() { Message = _localization["PayrollPeriodInvalid"] };

        Result<PayrollRunVm>? response = null;
        try
        {
            // Source writers do not all share the payroll lock. Serializable protects their
            // rows/ranges during source revalidation and the single aggregate save.
            await using var transaction = await _unitOfWork.Context.Database
                .BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);
            var guarded = await _unitOfWork.ExecuteUniqueWriteAsync<PayrollRun>(async () =>
            {
                var run = await _unitOfWork.Repository.Query<PayrollRun>(x => x.PeriodStart == start)
                    .SingleOrDefaultAsync(cancellationToken);
                var current = run is null ? null : await LoadRevisionAsync(run, run.CurrentRevision, cancellationToken);
                if (current is not null && current.RequestVersion == request.ExpectedVersion)
                {
                    response = new() { IsSuccess = true, Entity = ToVm(run!, current) };
                    return response;
                }
                if (run?.IsPaid == true)
                {
                    response = new() { Message = _localization["PayrollPaidRequiresSettlement"], ErrorStatusCode = 409 };
                    return response;
                }

                var calculated = await CalculateCoreAsync(start, run, cancellationToken);
                var preview = calculated.Result.Entity;
                if (!calculated.Result.IsSuccess || preview is null)
                    return response = calculated.Result;
                if (!string.Equals(preview.Version, request.ExpectedVersion, StringComparison.Ordinal))
                {
                    response = new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
                    return response;
                }
                if (preview.IsSaved && current is not null)
                {
                    response = new() { IsSuccess = true, Entity = ToVm(run!, current) };
                    return response;
                }
                if (!preview.CanSave)
                {
                    response = new() { Message = _localization["PayrollResolveIssues"] };
                    return response;
                }

                if (run is null)
                {
                    run = new PayrollRun { PeriodStart = start, PeriodEnd = start.AddMonths(1) };
                    await _unitOfWork.Repository.AddAsync(run, cancellationToken);
                }
                var revision = new PayrollRunRevision
                {
                    RevisionNumber = checked(run.CurrentRevision + 1),
                    RequestVersion = preview.Version,
                    SourceVersion = calculated.SourceVersion,
                    PolicyVersion = preview.PolicyVersion,
                    OvertimePeriod = calculated.OvertimePeriod,
                    DecimalPlaces = preview.DecimalPlaces,
                    TotalBasic = preview.TotalBasic, TotalAllowances = preview.TotalAllowances,
                    TotalGross = preview.TotalGross, TotalOvertime = preview.TotalOvertime,
                    TotalAdditional = preview.TotalAdditional, TotalDeductions = preview.TotalDeductions,
                    TotalNet = preview.TotalNet, Lines = calculated.Lines
                };
                run.Revisions.Add(revision);
                run.Logs.Add(new PayrollRunLog
                {
                    Operation = run.CurrentRevision == 0 ? "Created" : "Recalculated",
                    RevisionNumber = revision.RevisionNumber,
                    PreviousRevisionNumber = run.CurrentRevision == 0 ? null : run.CurrentRevision,
                    PreviousAmount = current?.TotalNet, Amount = revision.TotalNet,
                    OccurredAt = DateTime.UtcNow, PerformedBy = Actor()
                });
                run.CurrentRevision = revision.RevisionNumber;
                run.ApprovedRevisionNumber = null;
                if (!await _unitOfWork.SaveChangesAsync(cancellationToken))
                {
                    response = new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
                    return response;
                }
                response = new()
                {
                    IsSuccess = true, Id = run.Id, Entity = ToVm(run, revision),
                    Message = _localization["PayrollSaved"]
                };
                return response;
            }, cancellationToken);
            if (guarded.IsSuccess)
                await transaction.CommitAsync(cancellationToken);
            return response ?? new Result<PayrollRunVm>
            { Message = guarded.Message, ErrorStatusCode = guarded.ErrorStatusCode };
        }
        catch (DbUpdateConcurrencyException)
        {
            return new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
        }
        catch (SqlException exception) when (exception.Number == 1205)
        {
            return new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 2601 or 2627 or 1205 })
        {
            return new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
        }
    }

    public async Task<Result<PayrollRunVm>> GetAsync(int id, int? revisionNumber = null,
        CancellationToken cancellationToken = default)
    {
        var run = await _unitOfWork.Repository.Query<PayrollRun>(x => x.Id == id)
            .AsNoTracking().SingleOrDefaultAsync(cancellationToken);
        var revision = run is null ? null : await LoadRevisionAsync(run, revisionNumber ?? run.CurrentRevision, cancellationToken);
        return run is null || revision is null
            ? new() { Message = _localization["PayrollNotFound"], ErrorStatusCode = 404 }
            : new() { IsSuccess = true, Entity = ToVm(run, revision) };
    }

    public async Task<Result<List<PayrollRevisionSummaryVm>>> RevisionsAsync(int id,
        CancellationToken cancellationToken = default)
    {
        if (!await _unitOfWork.Repository.Query<PayrollRun>(x => x.Id == id).AnyAsync(cancellationToken))
            return new() { Message = _localization["PayrollNotFound"], ErrorStatusCode = 404 };
        var rows = await _unitOfWork.Repository.Query<PayrollRunRevision>(x => x.PayrollRunId == id)
            .AsNoTracking().OrderByDescending(x => x.RevisionNumber)
            .Select(x => new PayrollRevisionSummaryVm
            { RevisionNumber = x.RevisionNumber, SavedAt = x.CreatedAt, TotalNet = x.TotalNet })
            .ToListAsync(cancellationToken);
        return new() { IsSuccess = true, Entity = rows };
    }

    public async Task<Result<List<PayrollRunLogVm>>> LogsAsync(int id, CancellationToken cancellationToken = default)
    {
        if (!await _unitOfWork.Repository.Query<PayrollRun>(x => x.Id == id).AnyAsync(cancellationToken))
            return new() { Message = _localization["PayrollNotFound"], ErrorStatusCode = 404 };
        var rows = await _unitOfWork.Repository.Query<PayrollRunLog>(x => x.PayrollRunId == id)
            .AsNoTracking().OrderBy(x => x.OccurredAt).ThenBy(x => x.Id)
            .Select(x => new PayrollRunLogVm
            {
                Id = x.Id, Operation = x.Operation, RevisionNumber = x.RevisionNumber,
                PreviousRevisionNumber = x.PreviousRevisionNumber, OccurredAt = x.OccurredAt,
                PerformedBy = x.PerformedBy, PreviousAmount = x.PreviousAmount, Amount = x.Amount
            }).ToListAsync(cancellationToken);
        foreach (var row in rows)
            row.OccurredAt = DateTime.SpecifyKind(row.OccurredAt, DateTimeKind.Utc);
        return new() { IsSuccess = true, Entity = rows };
    }

    public async Task<Result<PayrollRunVm>> ApproveAsync(int id, PayrollApproveVm request,
        CancellationToken cancellationToken = default)
    {
        Result<PayrollRunVm>? response = null;
        try
        {
            var guarded = await _unitOfWork.ExecuteUniqueWriteAsync<PayrollRun>(async () =>
            {
                var run = await _unitOfWork.Repository.Query<PayrollRun>(x => x.Id == id)
                    .SingleOrDefaultAsync(cancellationToken);
                var revision = run is null ? null : await _unitOfWork.Repository.Query<PayrollRunRevision>(x =>
                        x.PayrollRunId == id && x.RevisionNumber == run.CurrentRevision)
                    .Include(x => x.Lines.Where(line => line.SubscriptionId == run.SubscriptionId && line.IsDeleted != true))
                    .SingleOrDefaultAsync(cancellationToken);
                if (run is null || revision is null)
                    return response = new() { Message = _localization["PayrollNotFound"], ErrorStatusCode = 404 };
                if (run.IsPaid)
                    return response = new() { Message = _localization["PayrollPaidRequiresSettlement"], ErrorStatusCode = 409 };
                if (run.ApprovedRevisionNumber.HasValue && run.ApprovedRevisionNumber != run.CurrentRevision ||
                    revision.ApprovedAt.HasValue != (run.ApprovedRevisionNumber == run.CurrentRevision) ||
                    revision.ApprovedAt.HasValue != !string.IsNullOrWhiteSpace(revision.ApprovedBy))
                    return response = new() { Message = _localization["PayrollHistoryInvalid"], ErrorStatusCode = 409 };
                var version = Version(revision.SourceVersion, run);
                var repeatedApproval = run.ApprovedRevisionNumber == run.CurrentRevision &&
                    request.ExpectedVersion == StateVersion(revision.SourceVersion, run.Id, run.CurrentRevision, false, null);
                if (request.ExpectedVersion != version && !repeatedApproval)
                    return response = new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
                if (run.ApprovedRevisionNumber == run.CurrentRevision)
                    return response = new() { IsSuccess = true, Entity = ToVm(run, revision) };
                if (revision.Lines.Count == 0 || revision.Lines.Any(x => x.NetPay < 0m) ||
                    revision.TotalNet != revision.Lines.Sum(x => x.NetPay))
                    return response = new() { Message = _localization["PayrollHistoryInvalid"], ErrorStatusCode = 409 };
                revision.ApprovedAt = DateTime.UtcNow;
                revision.ApprovedBy = Actor();
                run.ApprovedRevisionNumber = run.CurrentRevision;
                run.Logs.Add(new PayrollRunLog
                {
                    Operation = "Approved", RevisionNumber = run.CurrentRevision,
                    OccurredAt = revision.ApprovedAt.Value, PerformedBy = revision.ApprovedBy,
                    Amount = revision.TotalNet
                });
                if (!await _unitOfWork.SaveChangesAsync(cancellationToken))
                    return response = new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
                return response = new() { IsSuccess = true, Entity = ToVm(run, revision), Message = _localization["PayrollApproved"] };
            }, cancellationToken);
            return response ?? new Result<PayrollRunVm> { Message = guarded.Message, ErrorStatusCode = guarded.ErrorStatusCode };
        }
        catch (DbUpdateConcurrencyException)
        {
            return new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
        }
        catch (SqlException exception) when (exception.Number == 1205)
        {
            return new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 2601 or 2627 or 1205 })
        {
            return new() { Message = _localization["PayrollCalculationChanged"], ErrorStatusCode = 409 };
        }
    }

    public async Task<Results<PayrollRunListVm>> ListAsync(ListSmBase request, CancellationToken cancellationToken = default)
    {
        var filters = request.Filters ?? [];
        var dateFrom = FilterHelper.GetDate(filters, "dateFrom");
        var dateTo = FilterHelper.GetDate(filters, "dateTo");
        var type = FilterHelper.GetString(filters, "type");
        var pending = FilterHelper.GetBool(filters, "pendingApproval");
        var sort = FilterHelper.GetString(filters, "sortField") ?? "date";
        var order = FilterHelper.GetInt(filters, "sortOrder") ?? -1;
        if (filters.ContainsKey("dateFrom") && !dateFrom.HasValue || filters.ContainsKey("dateTo") && !dateTo.HasValue ||
            dateFrom > dateTo || type is not (null or "Payroll") ||
            filters.ContainsKey("pendingApproval") && !pending.HasValue ||
            sort is not ("date" or "amount" or "isApproved" or "revisionNumber") || order is not (1 or -1))
            return new() { Message = _localization["PayrollFiltersInvalid"], Entities = [] };
        var query = from run in _unitOfWork.Repository.Query<PayrollRun>()
                    join revision in _unitOfWork.Repository.Query<PayrollRunRevision>()
                        on new { RunId = run.Id, Number = run.CurrentRevision }
                        equals new { RunId = revision.PayrollRunId, Number = revision.RevisionNumber }
                    select new
                    {
                        run.Id, Date = run.PeriodEnd.AddDays(-1), run.CurrentRevision,
                        run.IsPaid, run.ApprovedRevisionNumber,
                        IsApproved = run.ApprovedRevisionNumber == run.CurrentRevision,
                        Amount = revision.TotalNet, revision.SourceVersion
                    };
        if (dateFrom.HasValue) query = query.Where(x => x.Date >= dateFrom.Value);
        if (dateTo.HasValue) query = query.Where(x => x.Date <= dateTo.Value);
        if (pending == true) query = query.Where(x => !x.IsApproved);
        var total = await query.CountAsync(cancellationToken);
        var size = Math.Clamp(request.PageSize ?? 10, 1, 100);
        var pages = (int)Math.Ceiling(total / (double)size);
        var page = Math.Clamp(request.PageNo ?? 1, 1, Math.Max(1, pages));
        var ordered = (sort, order) switch
        {
            ("amount", 1) => query.OrderBy(x => x.Amount),
            ("amount", -1) => query.OrderByDescending(x => x.Amount),
            ("isApproved", 1) => query.OrderBy(x => x.IsApproved),
            ("isApproved", -1) => query.OrderByDescending(x => x.IsApproved),
            ("revisionNumber", 1) => query.OrderBy(x => x.CurrentRevision),
            ("revisionNumber", -1) => query.OrderByDescending(x => x.CurrentRevision),
            ("date", 1) => query.OrderBy(x => x.Date),
            _ => query.OrderByDescending(x => x.Date)
        };
        var rows = await ordered.ThenBy(x => x.Id).AsNoTracking().Skip((page - 1) * size).Take(size).ToListAsync(cancellationToken);
        return new()
        {
            IsSuccess = true, PageNo = page, PageSize = size, TotalCount = total, TotalPages = pages,
            Entities = rows.Select(x => new PayrollRunListVm
            {
                Id = x.Id, Date = x.Date, Amount = x.Amount, IsApproved = x.IsApproved,
                IsPaid = x.IsPaid, RevisionNumber = x.CurrentRevision,
                Version = StateVersion(x.SourceVersion, x.Id, x.CurrentRevision, x.IsPaid, x.ApprovedRevisionNumber)
            }).ToList()
        };
    }

    private Task<PayrollRunRevision?> LoadRevisionAsync(PayrollRun run, int revisionNumber, CancellationToken ct)
        => _unitOfWork.Repository.Query<PayrollRunRevision>(x => x.PayrollRunId == run.Id && x.RevisionNumber == revisionNumber)
            .AsNoTracking().Include(x => x.Lines.Where(line => line.IsDeleted != true &&
                line.SubscriptionId == run.SubscriptionId)).SingleOrDefaultAsync(ct);

    private async Task<(Result<PayrollRunVm> Result, string SourceVersion, DateTime OvertimePeriod, List<PayrollLine> Lines)>
        CalculateCoreAsync(DateTime start, PayrollRun? run, CancellationToken ct)
    {
        var settings = await _unitOfWork.Repository.Query<HrmSetting>().AsNoTracking().Take(2).ToListAsync(ct);
        if (settings.Count > 1 || settings.Any(x => x.IsPreviousMonthSalesCommissionForPayrollProcess || x.IsBusinessUnitsWisePayrollProcess))
            return (new() { Message = _localization["PayrollSettingsUnsupported"] }, string.Empty, start, []);
        var previousOvertime = settings.FirstOrDefault()?.IsPreviousMonthOvertimeForPayrollProcess == true;
        if (previousOvertime && start.Year == 1 && start.Month == 1)
            return (new() { Message = _localization["PayrollPeriodInvalid"] }, string.Empty, start, []);
        var overtimeStart = previousOvertime ? start.AddMonths(-1) : start;
        var end = start.AddMonths(1);
        var overtimeEnd = overtimeStart.AddMonths(1);
        var precision = await _moneyPolicy.GetBaseCurrencyDecimalPlacesAsync(ct);
        if (precision.Error is not null)
            return (new() { Message = precision.Error.Message, ErrorStatusCode = precision.Error.ErrorStatusCode }, string.Empty, start, []);
        var decimalPlaces = precision.DecimalPlaces;
        var tenant = _unitOfWork.Repository.SubscriptionId;
        var staff = await _unitOfWork.Repository.Query<Staff>(x => x.IsInactive != true &&
                x.IsActive != false && x.DateOfJoining < end)
            .AsNoTracking().Include(x => x.SalaryPackages!.Where(p => p.IsDeleted != true && p.SubscriptionId == tenant))
            .OrderBy(x => x.Id).ToListAsync(ct);
        var ids = staff.Select(x => x.Id).ToList();
        var overtime = await _unitOfWork.Repository.Query<Overtime>(x => x.IsActive != false && x.StaffId.HasValue && ids.Contains(x.StaffId.Value) &&
                x.Month >= overtimeStart && x.Month < overtimeEnd).AsNoTracking().OrderBy(x => x.Id).ToListAsync(ct);
        var deductions = await _unitOfWork.Repository.Query<Deduction>(x => x.IsActive != false && x.StaffId.HasValue && ids.Contains(x.StaffId.Value) &&
                x.Status != DeductionStatus.Completed && x.PassOverDeductionForThisMonth != true &&
                (!x.StartDate.HasValue || x.StartDate < end)).AsNoTracking().OrderBy(x => x.Id).ToListAsync(ct);
        var absent = await _unitOfWork.Repository.Query<Attendance>(x => x.StaffId.HasValue && ids.Contains(x.StaffId.Value) &&
                x.Date >= start && x.Date < end && x.IsAbsent).AsNoTracking().OrderBy(x => x.Id).ToListAsync(ct);
        var overtimeByStaff = overtime.ToLookup(x => x.StaffId!.Value);
        var deductionsByStaff = deductions.ToLookup(x => x.StaffId!.Value);
        var absentByStaff = absent.ToLookup(x => x.StaffId!.Value);
        var rows = new List<PayrollLineVm>();
        var lines = new List<PayrollLine>();
        foreach (var employee in staff)
        {
            var packages = (employee.SalaryPackages ?? []).Where(x => x.IsActive != false &&
                    (x.ApplicableFrom ?? x.CreatedAt)?.Date < end).OrderBy(x => x.Id).ToList();
            var effective = packages.Select(x => (x.ApplicableFrom ?? x.CreatedAt)?.Date).Max();
            var latest = packages.Where(x => (x.ApplicableFrom ?? x.CreatedAt)?.Date == effective).ToList();
            var ot = overtimeByStaff[employee.Id].ToList();
            var deduction = deductionsByStaff[employee.Id].ToList();
            var attendance = absentByStaff[employee.Id].ToList();
            var name = string.IsNullOrWhiteSpace(employee.Name)
                ? string.Join(" ", new[] { employee.FirstName, employee.MiddleName, employee.LastName }
                    .Where(value => !string.IsNullOrWhiteSpace(value)))
                : employee.Name.Trim();
            var row = new PayrollLineVm { StaffId = employee.Id, Code = employee.No, Name = name };
            CalculateSalary(row, latest, decimalPlaces);
            if ((employee.SalaryPackages ?? []).Any(x => x.IsActive != false && !x.ApplicableFrom.HasValue && !x.CreatedAt.HasValue))
                row.Issues.Add("payrollProcess.issues.invalidSalary");
            if (employee.DateOfJoining.Date > start || effective?.Date > start)
                row.Issues.Add("payrollProcess.issues.prorationRequired");
            if (attendance.Count > 0) row.Issues.Add("payrollProcess.issues.absencePolicyRequired");
            if (ot.Any(x => x.OvertimeAmount < 0m || x.TotalOTHours < 0m || x.NormalOTHours < 0m || x.HolidayOTHours < 0m ||
                !x.OvertimeAmount.HasValue && (x.TotalOTHours != 0m || x.NormalOTHours != 0m || x.HolidayOTHours != 0m) || x.Month.Date < employee.DateOfJoining.Date))
                row.Issues.Add("payrollProcess.issues.invalidOvertime");
            if (ot.GroupBy(x => x.Month.Date).Any(group => group.Count() > 1))
                row.Issues.Add("payrollProcess.issues.duplicateOvertime");
            row.Overtime = Money(ot.Sum(x => x.OvertimeAmount ?? 0m), decimalPlaces);
            foreach (var item in deduction)
            {
                if (!item.StartDate.HasValue || item.StartDate.Value == default || !item.TotalAmount.HasValue ||
                    item.TotalAmount < 0m || item.NumberOfDeductions is null or <= 0 ||
                    !item.PaidInstallments.HasValue || item.PaidInstallments < 0 || item.PaidInstallments > item.NumberOfDeductions)
                {
                    row.Issues.Add("payrollProcess.issues.invalidDeduction");
                    continue;
                }
                var monthIndex = (start.Year - item.StartDate.Value.Year) * 12 + start.Month - item.StartDate.Value.Month;
                var count = item.NumberOfDeductions.Value;
                if (monthIndex < (item.PaidInstallments ?? 0) || monthIndex < 0 || monthIndex >= count) continue;
                var total = Money(item.TotalAmount.Value, decimalPlaces);
                var installment = FinancialNumberPolicy.FloorMoney(total / count, decimalPlaces);
                row.Deductions += monthIndex == count - 1 ? total - installment * (count - 1) : installment;
            }
            row.NetPay = row.Gross + row.Overtime + row.Additional - row.Deductions;
            if (row.NetPay < 0m) row.Issues.Add("payrollProcess.issues.negativeNet");
            if ((row.Code?.Length ?? 0) > 100 || row.Name.Length > 300)
                row.Issues.Add("payrollProcess.issues.invalidIdentity");
            row.Issues = row.Issues.Distinct().ToList();
            rows.Add(row);
            lines.Add(new PayrollLine
            {
                StaffId = row.StaffId, Code = row.Code, Name = row.Name, SalaryEffectiveFrom = effective,
                Basic = row.Basic, Allowances = row.Allowances, Gross = row.Gross, Overtime = row.Overtime,
                Additional = row.Additional, Deductions = row.Deductions, NetPay = row.NetPay,
                SourceSnapshot = JsonSerializer.Serialize(new
                {
                    employee.Id, employee.No, Name = name, employee.DateOfJoining,
                    Salary = latest.Select(x => new { x.Id, x.SalaryType, x.Type, x.Amount, x.ApplicableFrom, x.CreatedAt }),
                    Overtime = ot.Select(x => new { x.Id, x.Month, x.NormalOTHours, x.HolidayOTHours, x.TotalOTHours, x.OvertimeRate, x.OvertimeAmount }),
                    Deductions = deduction.Select(x => new { x.Id, x.TotalAmount, x.StartDate, x.NumberOfDeductions, x.PaidInstallments, x.Status, x.PassOverDeductionForThisMonth }),
                    Absences = attendance.Select(x => new { x.Id, x.Date }),
                    UndatedSalary = (employee.SalaryPackages ?? []).Where(x => x.IsActive != false &&
                            !x.ApplicableFrom.HasValue && !x.CreatedAt.HasValue).OrderBy(x => x.Id)
                        .Select(x => new { x.Id, x.SalaryType, x.Type, x.Amount }),
                    row.Issues
                })
            });
        }
        var sourceVersion = Hash(JsonSerializer.Serialize(new
        { PolicyVersion, Period = start, OvertimePeriod = overtimeStart, DecimalPlaces = decimalPlaces,
            Sources = lines.Select(x => x.SourceSnapshot) }));
        var saved = run is null ? null : await LoadRevisionAsync(run, run.CurrentRevision, ct);
        if (run is not null && saved is null)
            return (new() { Message = _localization["PayrollHistoryInvalid"], ErrorStatusCode = 409 }, string.Empty, start, []);
        var savedByStaff = saved?.Lines.ToDictionary(x => x.StaffId) ?? new Dictionary<int, PayrollLine>();
        foreach (var row in rows)
            row.NetPayDifference = row.NetPay - (savedByStaff.TryGetValue(row.StaffId, out var previous) ? previous.NetPay : 0m);
        // A paid employee who left the eligible set still needs a visible difference.
        // Keep those comparison-only rows out of the new snapshot/calculation source.
        if (run?.IsPaid == true && saved is not null)
        {
            var currentIds = rows.Select(x => x.StaffId).ToHashSet();
            rows.AddRange(saved.Lines.Where(x => !currentIds.Contains(x.StaffId)).Select(x => new PayrollLineVm
            { StaffId = x.StaffId, Code = x.Code, Name = x.Name, NetPayDifference = -x.NetPay }));
            rows = rows.OrderBy(x => x.StaffId).ToList();
        }
        var vm = new PayrollRunVm
        {
            Id = run?.Id, Period = Period(start), Version = Version(sourceVersion, run),
            RevisionNumber = run?.CurrentRevision ?? 0, IsPaid = run?.IsPaid ?? false,
            IsCurrentRevision = true, IsApproved = run is not null && run.ApprovedRevisionNumber == run.CurrentRevision,
            ApprovedAt = Utc(saved?.ApprovedAt), ApprovedBy = saved?.ApprovedBy,
            IsSaved = saved?.SourceVersion == sourceVersion, PolicyVersion = PolicyVersion,
            OvertimePeriod = Period(overtimeStart), DecimalPlaces = decimalPlaces, Rows = rows,
            TotalBasic = rows.Sum(x => x.Basic), TotalAllowances = rows.Sum(x => x.Allowances),
            TotalGross = rows.Sum(x => x.Gross), TotalOvertime = rows.Sum(x => x.Overtime),
            TotalAdditional = rows.Sum(x => x.Additional), TotalDeductions = rows.Sum(x => x.Deductions),
            TotalNet = rows.Sum(x => x.NetPay)
        };
        vm.SettlementTotal = vm.TotalNet - (saved?.TotalNet ?? 0m);
        vm.RequiresSettlement = vm.IsPaid && rows.Any(x => x.NetPayDifference != 0m);
        // Approval applies to the saved figures, never to a changed unsaved preview.
        vm.IsApproved = vm.IsSaved && vm.IsApproved;
        if (!vm.IsSaved) { vm.ApprovedAt = null; vm.ApprovedBy = null; }
        vm.CanSave = !vm.IsPaid && !vm.IsSaved && rows.Count > 0 && rows.All(x => x.Issues.Count == 0);
        // All persisted money columns use the shared decimal(18,2) convention.
        const decimal storageLimit = 9999999999999999.99m;
        if (new[] { vm.TotalBasic, vm.TotalAllowances, vm.TotalGross, vm.TotalOvertime,
                vm.TotalAdditional, vm.TotalDeductions, vm.TotalNet }
            .Any(value => value < -storageLimit || value > storageLimit))
            return (new() { Message = _localization["PayrollAmountOutOfRange"] }, string.Empty, start, []);
        return (new() { IsSuccess = true, Entity = vm }, sourceVersion, overtimeStart, lines);
    }

    private static void CalculateSalary(PayrollLineVm row, List<SalaryPackage> packages, int decimals)
    {
        if (packages.Count == 0)
        {
            row.Issues.Add("payrollProcess.issues.missingSalary");
            return;
        }
        if (packages.GroupBy(x => new { x.SalaryType, x.Type }).Any(group => group.Count() > 1))
            row.Issues.Add("payrollProcess.issues.ambiguousSalary");
        if (packages.Any(x => x.Amount < 0m || !Enum.IsDefined(typeof(SalaryType), x.SalaryType) ||
            x.SalaryType == SalaryType.Overtime && x.Type is not (0 or 1) ||
            x.SalaryType != SalaryType.Overtime && !Enum.IsDefined(typeof(SalaryComponentType), x.Type)))
            row.Issues.Add("payrollProcess.issues.invalidSalary");
        row.Basic = Money(packages.Where(x => x.SalaryType == SalaryType.OtherIncentive && x.Type == 0).Sum(x => x.Amount), decimals);
        row.Allowances = Money(packages.Where(x => x.SalaryType == SalaryType.OtherIncentive && x.Type is >= 1 and <= 11).Sum(x => x.Amount), decimals);
        row.Gross = Money(packages.Where(x => x.SalaryType == SalaryType.GrossSalary && x.Type == 0).Sum(x => x.Amount), decimals);
        row.Additional = Money(packages.Where(x => x.SalaryType == SalaryType.OtherIncentive && x.Type is >= 13 and <= 21).Sum(x => x.Amount), decimals);
        row.Deductions = Money(packages.Where(x => x.SalaryType == SalaryType.OtherIncentive && x.Type is >= 100 and <= 117).Sum(x => x.Amount), decimals);
        if (!packages.Any(x => x.SalaryType == SalaryType.OtherIncentive && x.Type == 0) ||
            !packages.Any(x => x.SalaryType == SalaryType.GrossSalary && x.Type == 0))
            row.Issues.Add("payrollProcess.issues.missingSalary");
        if (row.Gross != row.Basic + row.Allowances || packages.Any(x =>
            x.SalaryType == SalaryType.GrossSalary && x.Type != 0 ||
            x.SalaryType == SalaryType.OtherIncentive && x.Type == (int)SalaryComponentType.Overtime))
            row.Issues.Add("payrollProcess.issues.invalidSalary");
    }

    private static PayrollRunVm ToVm(PayrollRun run, PayrollRunRevision revision)
        => new()
        {
            Id = run.Id, Period = Period(run.PeriodStart), Version = Version(revision.SourceVersion, run),
            RevisionNumber = revision.RevisionNumber, IsSaved = true,
            IsPaid = run.IsPaid && run.CurrentRevision == revision.RevisionNumber,
            IsCurrentRevision = run.CurrentRevision == revision.RevisionNumber,
            IsApproved = revision.ApprovedAt.HasValue, ApprovedAt = Utc(revision.ApprovedAt), ApprovedBy = revision.ApprovedBy,
            PolicyVersion = revision.PolicyVersion, OvertimePeriod = Period(revision.OvertimePeriod),
            DecimalPlaces = revision.DecimalPlaces, TotalBasic = revision.TotalBasic,
            TotalAllowances = revision.TotalAllowances, TotalGross = revision.TotalGross,
            TotalOvertime = revision.TotalOvertime, TotalAdditional = revision.TotalAdditional,
            TotalDeductions = revision.TotalDeductions, TotalNet = revision.TotalNet,
            Rows = revision.Lines.OrderBy(x => x.StaffId).Select(x => new PayrollLineVm
            {
                StaffId = x.StaffId, Code = x.Code, Name = x.Name, Basic = x.Basic, Allowances = x.Allowances,
                Gross = x.Gross, Overtime = x.Overtime, Additional = x.Additional, Deductions = x.Deductions, NetPay = x.NetPay
            }).ToList()
        };

    private static bool TryPeriod(string? period, out DateTime start)
        => DateTime.TryParseExact(period, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out start)
            && start.Year < 9999;
    private static string Period(DateTime date) => date.ToString("yyyy-MM", CultureInfo.InvariantCulture);
    private static decimal Money(decimal value, int decimals) => FinancialNumberPolicy.RoundMoney(value, decimals);
    private static DateTime? Utc(DateTime? value)
        => value.HasValue ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null;
    private static string Hash(string input) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(input)));
    private static string Version(string source, PayrollRun? run)
        => StateVersion(source, run?.Id ?? 0, run?.CurrentRevision ?? 0, run?.IsPaid ?? false, run?.ApprovedRevisionNumber);
    private static string StateVersion(string source, int id, int revision, bool paid, int? approved)
        => Hash(FormattableString.Invariant($"{source}|{id}|{revision}|{paid}|{approved}"));
    private string Actor()
    {
        var name = _httpContext.HttpContext?.User.Identity?.Name;
        return string.IsNullOrWhiteSpace(name) ? "System" : name;
    }
}
