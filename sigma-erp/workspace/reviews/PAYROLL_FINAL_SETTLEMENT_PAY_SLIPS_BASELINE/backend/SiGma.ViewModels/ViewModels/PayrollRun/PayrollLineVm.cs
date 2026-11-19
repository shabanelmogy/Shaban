namespace SiGma.ViewModels.ViewModels.PayrollRun;

public sealed class PayrollLineVm
{
    public int StaffId { get; set; }
    public string? Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Basic { get; set; }
    public decimal Allowances { get; set; }
    public decimal Gross { get; set; }
    public decimal Overtime { get; set; }
    public decimal Additional { get; set; }
    public decimal Deductions { get; set; }
    public decimal NetPay { get; set; }
    public decimal NetPayDifference { get; set; }
    public List<string> Issues { get; set; } = [];
}
