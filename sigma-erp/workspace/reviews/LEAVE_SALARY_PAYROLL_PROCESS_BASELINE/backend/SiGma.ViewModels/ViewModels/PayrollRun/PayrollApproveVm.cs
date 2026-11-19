namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollApproveVm
{
    [Required, RegularExpression(@"^[A-F0-9]{64}$")]
    public string ExpectedVersion { get; set; } = string.Empty;
}
