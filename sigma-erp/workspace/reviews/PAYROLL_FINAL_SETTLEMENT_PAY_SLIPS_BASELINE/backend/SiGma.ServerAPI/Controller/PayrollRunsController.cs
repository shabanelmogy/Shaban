using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiGma.Business.IServices;
using SiGma.Helpers.Results;
using SiGma.Helpers.Request;
using SiGma.ViewModels.ViewModels.PayrollRun;

namespace SiGma.ServerAPI.Controller;

[ApiController, Authorize, Route("[controller]")]
public sealed class PayrollRunsController : ControllerBase
{
    private readonly IPayrollRunService _service;
    public PayrollRunsController(IPayrollRunService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] ListSmBase request, CancellationToken cancellationToken)
        => Response(await _service.ListAsync(request, cancellationToken));

    [HttpPost("{id:int}/approve")]
    public async Task<IActionResult> Approve(int id, PayrollApproveVm request, CancellationToken cancellationToken)
        => Response(await _service.ApproveAsync(id, request, cancellationToken));

    [HttpGet("{id:int}/logs")]
    public async Task<IActionResult> Logs(int id, CancellationToken cancellationToken)
        => Response(await _service.LogsAsync(id, cancellationToken));

    [HttpPost("calculate")]
    public async Task<IActionResult> Calculate(PayrollCalculateVm request, CancellationToken cancellationToken)
        => Response(await _service.CalculateAsync(request, cancellationToken));

    [HttpGet("leave-salary-staff")]
    public async Task<IActionResult> LeaveSalaryStaff(CancellationToken cancellationToken)
        => Response(await _service.LeaveSalaryStaffAsync(cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Save(PayrollSaveVm request, CancellationToken cancellationToken)
        => Response(await _service.SaveAsync(request, cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken cancellationToken)
        => Response(await _service.GetAsync(id, cancellationToken: cancellationToken));

    [HttpGet("{id:int}/revisions")]
    public async Task<IActionResult> Revisions(int id, CancellationToken cancellationToken)
        => Response(await _service.RevisionsAsync(id, cancellationToken));

    [HttpGet("{id:int}/revisions/{revisionNumber:int}")]
    public async Task<IActionResult> Revision(int id, int revisionNumber, CancellationToken cancellationToken)
        => Response(await _service.GetAsync(id, revisionNumber, cancellationToken));

    private IActionResult Response(Result result)
        => result.IsSuccess ? Ok(result) : StatusCode(result.StatusCode ?? 400, result);
}
