namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollRunListVm
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Type { get; set; } = "Payroll";
    public decimal Amount { get; set; }
    public bool IsApproved { get; set; }
    public bool IsPaid { get; set; }
    public int RevisionNumber { get; set; }
    public string Version { get; set; } = string.Empty;
}
