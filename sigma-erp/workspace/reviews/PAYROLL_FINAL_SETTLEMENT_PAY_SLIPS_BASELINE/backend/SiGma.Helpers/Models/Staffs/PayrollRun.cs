using SiGma.Helpers.EntityBases;

namespace SiGma.Helpers.Models.Staffs;

public class PayrollRun : EntityBase
{
    public string Type { get; set; } = "Payroll";
    public int? StaffId { get; set; }
    public Staff? Staff { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public int CurrentRevision { get; set; }
    public int? ApprovedRevisionNumber { get; set; }
    // Set only by the separate disbursement workflow, in its payment transaction.
    public bool IsPaid { get; set; }
    public DateTime? PaidAt { get; set; }
    public ICollection<PayrollRunRevision> Revisions { get; set; } = [];
    public ICollection<PayrollRunLog> Logs { get; set; } = [];
}
