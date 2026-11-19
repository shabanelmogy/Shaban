namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollRunVm
{
    public int? Id { get; set; }
    public string Period { get; set; } = string.Empty;
    public string Type { get; set; } = "Payroll";
    public int? StaffId { get; set; }
    public string Version { get; set; } = string.Empty;
    public int RevisionNumber { get; set; }
    public bool IsSaved { get; set; }
    public bool IsPaid { get; set; }
    public bool IsApproved { get; set; }
    public bool IsCurrentRevision { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedBy { get; set; }
    public bool CanSave { get; set; }
    public bool RequiresSettlement { get; set; }
    public decimal SettlementTotal { get; set; }
    public string PolicyVersion { get; set; } = string.Empty;
    public string OvertimePeriod { get; set; } = string.Empty;
    public int DecimalPlaces { get; set; }
    public List<PayrollLineVm> Rows { get; set; } = [];
    public decimal TotalBasic { get; set; }
    public decimal TotalAllowances { get; set; }
    public decimal TotalGross { get; set; }
    public decimal TotalOvertime { get; set; }
    public decimal TotalAdditional { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal TotalNet { get; set; }
}
