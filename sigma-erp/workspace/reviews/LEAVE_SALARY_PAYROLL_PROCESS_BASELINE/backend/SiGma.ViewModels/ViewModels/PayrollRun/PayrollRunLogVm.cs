namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollRunLogVm
{
    public int Id { get; set; }
    public string Operation { get; set; } = string.Empty;
    public int RevisionNumber { get; set; }
    public int? PreviousRevisionNumber { get; set; }
    public DateTime OccurredAt { get; set; }
    public string PerformedBy { get; set; } = string.Empty;
    public decimal? PreviousAmount { get; set; }
    public decimal Amount { get; set; }
}
