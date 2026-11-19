using SiGma.ViewModels.ViewModels.PayrollRun;

namespace SiGma.Business.IServices;

public interface IPayrollRunService
{
    Task<Result<PayrollRunVm>> CalculateAsync(PayrollCalculateVm request, CancellationToken cancellationToken = default);
    Task<Result<PayrollRunVm>> SaveAsync(PayrollSaveVm request, CancellationToken cancellationToken = default);
    Task<Result<PayrollRunVm>> GetAsync(int id, int? revisionNumber = null, CancellationToken cancellationToken = default);
    Task<Result<List<PayrollRevisionSummaryVm>>> RevisionsAsync(int id, CancellationToken cancellationToken = default);
    Task<Results<PayrollRunListVm>> ListAsync(ListSmBase request, CancellationToken cancellationToken = default);
    Task<Result<PayrollRunVm>> ApproveAsync(int id, PayrollApproveVm request, CancellationToken cancellationToken = default);
    Task<Result<List<PayrollRunLogVm>>> LogsAsync(int id, CancellationToken cancellationToken = default);
}
