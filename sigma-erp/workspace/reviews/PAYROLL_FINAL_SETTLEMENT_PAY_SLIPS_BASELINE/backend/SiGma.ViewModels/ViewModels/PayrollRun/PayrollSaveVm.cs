namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollSaveVm
{
    [Required, RegularExpression(@"^\d{4}-(0[1-9]|1[0-2])$")]
    public string Period { get; set; } = string.Empty;
    [MaxLength(32)]
    public string Type { get; set; } = "Payroll";
    [Range(1, int.MaxValue)]
    public int? StaffId { get; set; }
    [Required, RegularExpression(@"^[A-F0-9]{64}$")]
    public string ExpectedVersion { get; set; } = string.Empty;
}
