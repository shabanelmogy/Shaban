namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollCalculateVm
{
    [Required, RegularExpression(@"^\d{4}-(0[1-9]|1[0-2])$")]
    public string Period { get; set; } = string.Empty;
    [MaxLength(32)]
    public string Type { get; set; } = "Payroll";
    [Range(1, int.MaxValue)]
    public int? StaffId { get; set; }
}
