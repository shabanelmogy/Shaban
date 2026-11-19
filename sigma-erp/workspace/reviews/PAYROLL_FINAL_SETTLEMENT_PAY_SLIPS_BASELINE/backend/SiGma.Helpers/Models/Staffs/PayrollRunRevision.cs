using SiGma.Helpers.EntityBases;

namespace SiGma.Helpers.Models.Staffs;

public class PayrollRunRevision : EntityBase
{
    public int PayrollRunId { get; set; }
    public PayrollRun? PayrollRun { get; set; }
    public int RevisionNumber { get; set; }
    public string RequestVersion { get; set; } = string.Empty;
    public string SourceVersion { get; set; } = string.Empty;
    public string PolicyVersion { get; set; } = string.Empty;
    public DateTime OvertimePeriod { get; set; }
    public int DecimalPlaces { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedBy { get; set; }
    public decimal TotalBasic { get; set; }
    public decimal TotalAllowances { get; set; }
    public decimal TotalGross { get; set; }
    public decimal TotalOvertime { get; set; }
    public decimal TotalAdditional { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal TotalNet { get; set; }
    public ICollection<PayrollLine> Lines { get; set; } = [];
}
