internal sealed record RepairUser(int Id, string UserName, string Email, int BranchId,
    Guid? RegistrationId, string? IdentityId, bool Active, bool IsActive);
