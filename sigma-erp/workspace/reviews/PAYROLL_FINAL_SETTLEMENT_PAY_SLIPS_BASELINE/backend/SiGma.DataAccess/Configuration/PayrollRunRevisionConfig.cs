namespace SiGma.DataAccess.Configuration;

public sealed class PayrollRunRevisionConfig : IEntityTypeConfiguration<PayrollRunRevision>
{
    public void Configure(EntityTypeBuilder<PayrollRunRevision> builder)
    {
        builder.ToTable(nameof(PayrollRunRevision));
        builder.Property(x => x.RequestVersion).HasMaxLength(64).IsRequired();
        builder.Property(x => x.SourceVersion).HasMaxLength(64).IsRequired();
        builder.Property(x => x.PolicyVersion).HasMaxLength(50).IsRequired();
        builder.Property(x => x.OvertimePeriod).HasColumnType("date");
        builder.Property(x => x.ApprovedBy).HasMaxLength(300);
        builder.HasIndex(x => new { x.PayrollRunId, x.RevisionNumber }).IsUnique();
        builder.HasIndex(x => new { x.PayrollRunId, x.RequestVersion }).IsUnique();
        builder.HasOne(x => x.PayrollRun).WithMany(x => x.Revisions)
            .HasForeignKey(x => x.PayrollRunId).OnDelete(DeleteBehavior.Restrict);
    }
}
