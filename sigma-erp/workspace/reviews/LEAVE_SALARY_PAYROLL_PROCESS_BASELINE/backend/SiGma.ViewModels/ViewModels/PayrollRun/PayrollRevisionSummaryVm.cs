namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollRevisionSummaryVm
{
    public int RevisionNumber { get; set; }
    public DateTime? SavedAt { get; set; }
    public decimal TotalNet { get; set; }
}
