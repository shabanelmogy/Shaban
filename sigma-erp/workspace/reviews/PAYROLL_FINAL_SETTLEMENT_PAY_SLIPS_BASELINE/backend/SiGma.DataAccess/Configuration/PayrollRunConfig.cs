namespace SiGma.DataAccess.Configuration;

public sealed class PayrollRunConfig : IEntityTypeConfiguration<PayrollRun>
{
    public void Configure(EntityTypeBuilder<PayrollRun> builder)
    {
        builder.ToTable(nameof(PayrollRun));
        builder.Property(x => x.Type).HasMaxLength(32).IsRequired().HasDefaultValue("Payroll");
        builder.Property(x => x.PeriodStart).HasColumnType("date");
        builder.Property(x => x.PeriodEnd).HasColumnType("date");
        builder.Property(x => x.CurrentRevision).IsConcurrencyToken();
        builder.Property(x => x.IsPaid).IsConcurrencyToken();
        builder.Property(x => x.ApprovedRevisionNumber).IsConcurrencyToken();
        // Payroll history is never silently deleted or replaced.
        builder.HasIndex(x => new { x.SubscriptionId, x.PeriodStart, x.Type, x.StaffId })
            .IsUnique().HasFilter(null);
        builder.HasOne(x => x.Staff).WithMany().HasForeignKey(x => x.StaffId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
