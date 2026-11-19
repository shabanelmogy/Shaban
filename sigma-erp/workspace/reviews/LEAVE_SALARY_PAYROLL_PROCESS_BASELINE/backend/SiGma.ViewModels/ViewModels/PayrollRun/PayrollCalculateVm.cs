namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollCalculateVm
{
    [Required, RegularExpression(@"^\d{4}-(0[1-9]|1[0-2])$")]
    public string Period { get; set; } = string.Empty;
}
