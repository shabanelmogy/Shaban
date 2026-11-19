using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SiGma.Security.Authorization;
using SiGma.Security.IServices;
using SiGma.Security.Options;
using SiGma.Security.Services;
using SiGma.Security.ViewModels;

const int subscription = 1007;
const int administratorErpId = 24;
const string companyCode = "101007";
const string actor = "OwnerAuthorizedIdentityDataRepair";
const string root = @"F:\My Work\Sigma\SigmaBackend";
const string receiptRoot = @"F:\My Work\Sigma\reviews\Authorization";
int[] permittedIds = [5, 9, 14, 15, 16, 17, 18];
var apply = args.Contains("--apply", StringComparer.Ordinal);
var aliasApproved = args.Contains("--alias-14", StringComparer.Ordinal);
var idsIndex = Array.IndexOf(args, "--ids");
if (idsIndex < 0 || idsIndex + 1 >= args.Length) throw new InvalidOperationException("Explicit --ids is required.");
var ids = args[idsIndex + 1].Split(',').Select(int.Parse).Distinct().Order().ToArray();
if (ids.Length == 0 || ids.Any(id => !permittedIds.Contains(id))) throw new InvalidOperationException("Only the reviewed ERP users are permitted.");
var receipt = Path.Combine(receiptRoot, $"USER_IDENTITY_LINK_RECEIPT_20261115_{string.Join('-', ids)}.json");

var securityConfig = Configuration("SiGma.Security");
var erpConfig = Configuration("SiGma.ServerAPI");
var securityConnection = CheckedConnection(securityConfig, "db34823.public.databaseasp.net", "db34823");
var erpConnection = CheckedConnection(erpConfig, "SQL5106.site4now.net", "db_a82a9c_sigmaoperations1");
var services = new ServiceCollection();
services.AddLogging();
services.Configure<SubscriptionAccessOptions>(securityConfig.GetSection(SubscriptionAccessOptions.SectionName));
services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(securityConnection));
services.AddIdentityCore<ApplicationUser>(options => options.User.RequireUniqueEmail = true)
    .AddRoles<IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>();
services.AddScoped<ISubscriptionCodeResolver, SubscriptionCodeResolver>();
await using var provider = services.BuildServiceProvider();
await using var scope = provider.CreateAsyncScope();
var security = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
var codeResolver = scope.ServiceProvider.GetRequiredService<ISubscriptionCodeResolver>();
if (await codeResolver.ResolveAsync(companyCode) != subscription || await codeResolver.CodeForAsync(subscription) != companyCode)
    throw new InvalidOperationException("The actual company-code owner does not recognize the reviewed company.");

await using var erp = new SqlConnection(erpConnection);
await erp.OpenAsync();
var owner = await LoadOwner();
var admin = await users.FindByIdAsync(owner.IdentityId!) ?? throw new InvalidOperationException("The administrator identity is missing.");
if (admin.SubscriptionId != subscription || admin.ErpUserId != administratorErpId || admin.IdentityRegistrationId != owner.RegistrationId ||
    string.IsNullOrWhiteSpace(admin.PasswordHash) || !await users.IsInRoleAsync(admin, UserRoles.Admin) || await users.IsLockedOutAsync(admin))
    throw new InvalidOperationException("The reviewed administrator relationship or credential is not valid.");
var adminStamp = admin.SecurityStamp;
var adminConcurrency = admin.ConcurrencyStamp;
var rows = await LoadUsers(null);
ValidateRows(rows);
await ValidateSecurity(rows);
Console.WriteLine(JsonSerializer.Serialize(new { Phase = "PreflightPassed", Apply = apply, CompanyCode = companyCode,
    Users = rows.Select(row => new { row.Id, row.UserName, row.BranchId, AlreadyLinked = row.IdentityId != null }),
    PasswordSource = "Existing administrator credential, retained only in memory", Alias14Approved = aliasApproved }));
if (!apply) return;

// ERP preparation is resumable. No ERP transaction remains open during Identity writes.
await using (var transaction = (SqlTransaction)await erp.BeginTransactionAsync(IsolationLevel.Serializable))
{
    var locked = await LoadUsers(transaction);
    if (!locked.SequenceEqual(rows)) throw new InvalidOperationException("ERP rows changed since preflight.");
    var prepared = new List<RepairUser>();
    foreach (var row in locked)
    {
        var registration = row.RegistrationId ?? Guid.NewGuid();
        var email = EffectiveEmail(row);
        if (row.IdentityId != null && !string.Equals(email, row.Email, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("An already linked email must not be renamed by this repair.");
        await using var update = Command(transaction, """
            UPDATE dbo.[User] SET IdentityRegistrationId=@registration, EmailAddress=@email
            WHERE SubscriptionId=@subscription AND Id=@id AND IsDeleted=0;
            IF @@ROWCOUNT<>1 THROW 51001,'ERP user ownership changed.',1;
            IF NOT EXISTS (SELECT 1 FROM dbo.Branch WITH (UPDLOCK,HOLDLOCK)
                WHERE SubscriptionId=@subscription AND Id=@branch AND IsDeleted=0 AND ISNULL(IsActive,1)=1)
                THROW 51002,'The selected branch is no longer active.',1;
            IF EXISTS (SELECT 1 FROM dbo.UserBranchAccess WITH (UPDLOCK,HOLDLOCK)
                WHERE SubscriptionId=@subscription AND UserId=@id AND BranchId=@branch AND IsDeleted=0)
                UPDATE dbo.UserBranchAccess SET CanView=1, AccessVersion=NEWID(), IsChanged=1
                WHERE SubscriptionId=@subscription AND UserId=@id AND BranchId=@branch AND IsDeleted=0;
            ELSE
                INSERT dbo.UserBranchAccess(UserId,BranchId,CanView,CanTransact,CanTransfer,AccessVersion,
                    SubscriptionId,IsDeleted,GUID,IsActive,IsValid,IsChanged,CreatedAt,CreatedBy)
                VALUES(@id,@branch,1,0,0,NEWID(),@subscription,0,NEWID(),1,1,0,SYSUTCDATETIME(),@actor);
            IF EXISTS(SELECT 1 FROM dbo.UserAccessRevision WITH (UPDLOCK,HOLDLOCK)
                WHERE SubscriptionId=@subscription AND UserId=@id AND IsDeleted=0)
                UPDATE dbo.UserAccessRevision SET Version=NEWID(),IsChanged=1
                WHERE SubscriptionId=@subscription AND UserId=@id AND IsDeleted=0;
            ELSE
                INSERT dbo.UserAccessRevision(UserId,Version,SubscriptionId,IsDeleted,GUID,IsActive,IsValid,IsChanged,CreatedAt,CreatedBy)
                VALUES(@id,NEWID(),@subscription,0,NEWID(),1,1,0,SYSUTCDATETIME(),@actor);
            """, ("@id", row.Id), ("@registration", registration), ("@email", email), ("@branch", row.BranchId), ("@actor", actor));
        await update.ExecuteNonQueryAsync();
        prepared.Add(row with { RegistrationId = registration, Email = email });
    }
    await transaction.CommitAsync();
    rows = prepared;
}
await SaveReceipt("ErpPrepared", rows);

await using (var transaction = await security.Database.BeginTransactionAsync(IsolationLevel.Serializable))
{
    if (!await roles.RoleExistsAsync(UserRoles.User)) Ensure(await roles.CreateAsync(new IdentityRole(UserRoles.User)));
    foreach (var row in rows)
    {
        var identity = await users.Users.SingleOrDefaultAsync(user => user.SubscriptionId == subscription && user.ErpUserId == row.Id);
        if (identity == null)
        {
            identity = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(), UserName = row.UserName, Email = row.Email,
                SubscriptionId = subscription, ErpUserId = row.Id, IdentityRegistrationId = row.RegistrationId,
                PasswordHash = admin.PasswordHash, SecurityStamp = Guid.NewGuid().ToString("N"),
                ConcurrencyStamp = Guid.NewGuid().ToString("N"), LockoutEnabled = true
            };
            Ensure(await users.CreateAsync(identity));
            Ensure(await users.AddToRoleAsync(identity, UserRoles.User));
        }
        if (!Matches(identity, row) || identity.PasswordHash != admin.PasswordHash || !await users.IsInRoleAsync(identity, UserRoles.User))
            throw new InvalidOperationException($"Identity ownership or credential mismatch for ERP user {row.Id}.");
    }
    await transaction.CommitAsync();
}
await SaveReceipt("IdentityPrepared", rows);

await using (var transaction = (SqlTransaction)await erp.BeginTransactionAsync(IsolationLevel.Serializable))
{
    foreach (var row in rows)
    {
        var identity = await users.Users.AsNoTracking().SingleAsync(user => user.SubscriptionId == subscription && user.ErpUserId == row.Id);
        if (!Matches(identity, row)) throw new InvalidOperationException("The prepared identity relationship changed.");
        await using var link = Command(transaction, """
            UPDATE u SET IdentityUserId=@identity,Password=NULL,PasswordRepeat=NULL
            FROM dbo.[User] u
            WHERE u.SubscriptionId=@subscription AND u.Id=@id AND u.IsDeleted=0
                AND u.IdentityRegistrationId=@registration AND u.UserName=@name AND u.EmailAddress=@email
                AND u.CurrentBranchId=@branch AND (u.IdentityUserId IS NULL OR u.IdentityUserId=@identity)
                AND EXISTS(SELECT 1 FROM dbo.UserBranchAccess g JOIN dbo.Branch b
                    ON b.SubscriptionId=g.SubscriptionId AND b.Id=g.BranchId
                    WHERE g.SubscriptionId=u.SubscriptionId AND g.UserId=u.Id AND g.BranchId=u.CurrentBranchId
                        AND g.IsDeleted=0 AND g.CanView=1 AND b.IsDeleted=0 AND ISNULL(b.IsActive,1)=1);
            IF @@ROWCOUNT<>1 THROW 51003,'ERP link prerequisites changed.',1;
            """, ("@id", row.Id), ("@identity", identity.Id), ("@registration", row.RegistrationId!),
            ("@name", row.UserName), ("@email", row.Email), ("@branch", row.BranchId));
        await link.ExecuteNonQueryAsync();
    }
    await transaction.CommitAsync();
}

var confirmed = await LoadUsers(null);
await ValidateSecurity(confirmed);
foreach (var row in confirmed)
{
    var identity = await users.Users.AsNoTracking().SingleAsync(user => user.SubscriptionId == subscription && user.ErpUserId == row.Id);
    if (row.IdentityId != identity.Id || identity.PasswordHash != admin.PasswordHash || identity.SecurityStamp == adminStamp ||
        !await users.IsInRoleAsync(identity, UserRoles.User)) throw new InvalidOperationException("Final link/credential verification failed.");
}
var unchangedAdmin = await users.Users.AsNoTracking().SingleAsync(user => user.Id == admin.Id);
if (unchangedAdmin.SecurityStamp != adminStamp || unchangedAdmin.ConcurrencyStamp != adminConcurrency || unchangedAdmin.PasswordHash != admin.PasswordHash)
    throw new InvalidOperationException("The administrator account changed during the repair.");
await SaveReceipt("LinkedVerified", confirmed);
Console.WriteLine(JsonSerializer.Serialize(new { Phase = "LinkedVerified", CompanyCode = companyCode, Count = confirmed.Count,
    Users = confirmed.Select(row => new { row.Id, row.UserName, row.BranchId }), AdministratorUnchanged = true }));

IConfigurationRoot Configuration(string project) => new ConfigurationBuilder().SetBasePath(Path.Combine(root, project))
    .AddJsonFile("appsettings.json").AddJsonFile("appsettings.Development.json", optional: true)
    .AddJsonFile("appsettings.Local.json", optional: true).Build();

static string CheckedConnection(IConfiguration config, string expectedServer, string expectedDatabase)
{
    var builder = new SqlConnectionStringBuilder(config.GetConnectionString("ConnStr"));
    if (!string.Equals(builder.DataSource, expectedServer, StringComparison.OrdinalIgnoreCase) || builder.InitialCatalog != expectedDatabase)
        throw new InvalidOperationException("The configured database is outside the reviewed target.");
    return builder.ConnectionString;
}

SqlCommand Command(SqlTransaction? transaction, string sql, params (string Name, object Value)[] parameters)
{
    var command = new SqlCommand(sql, erp, transaction) { CommandTimeout = 45 };
    command.Parameters.AddWithValue("@subscription", subscription);
    foreach (var parameter in parameters) command.Parameters.AddWithValue(parameter.Name, parameter.Value);
    return command;
}

async Task<RepairUser> LoadOwner()
{
    await using var command = Command(null, """
        SELECT u.Id,u.UserName,u.EmailAddress,u.CurrentBranchId,u.IdentityRegistrationId,u.IdentityUserId,u.Active,u.IsActive
        FROM dbo.[User] u WHERE u.SubscriptionId=@subscription AND u.Id=24 AND u.IsDeleted=0
          AND EXISTS(SELECT 1 FROM dbo.UserRoleAssignment a JOIN dbo.Role r ON r.SubscriptionId=a.SubscriptionId AND r.Id=a.RoleId
            WHERE a.SubscriptionId=u.SubscriptionId AND a.UserId=u.Id AND a.IsDeleted=0 AND r.IsDeleted=0
              AND r.Name='TenantAdmin' AND r.IsSystem=1 AND ISNULL(r.IsActive,1)=1);
        """);
    await using var reader = await command.ExecuteReaderAsync();
    if (!await reader.ReadAsync()) throw new InvalidOperationException("The protected ERP owner is missing.");
    var row = ReadUser(reader);
    if (!row.Active || !row.IsActive || row.IdentityId == null || row.RegistrationId == null)
        throw new InvalidOperationException("The ERP owner is not active and linked.");
    return row;
}

async Task<List<RepairUser>> LoadUsers(SqlTransaction? transaction)
{
    await using var command = Command(transaction, $"""
        SELECT Id,UserName,EmailAddress,CurrentBranchId,IdentityRegistrationId,IdentityUserId,Active,IsActive
        FROM dbo.[User] {(transaction != null ? "WITH (UPDLOCK,HOLDLOCK)" : "")}
        WHERE SubscriptionId=@subscription AND IsDeleted=0 AND Id IN ({string.Join(',', ids)}) ORDER BY Id;
        """);
    await using var reader = await command.ExecuteReaderAsync();
    var result = new List<RepairUser>();
    while (await reader.ReadAsync()) result.Add(ReadUser(reader));
    return result;
}

static RepairUser ReadUser(SqlDataReader reader) => new(reader.GetInt32(0),reader.GetString(1),reader.GetString(2),
    reader.IsDBNull(3) ? 0 : reader.GetInt32(3),reader.IsDBNull(4) ? null : reader.GetGuid(4),
    reader.IsDBNull(5) ? null : reader.GetString(5),reader.GetBoolean(6),!reader.IsDBNull(7) && reader.GetBoolean(7));

string EffectiveEmail(RepairUser row) => row.Id == 14 && aliasApproved ? "hamada.erp14@example.invalid" : row.Email;

void ValidateRows(List<RepairUser> targetRows)
{
    if (targetRows.Count != ids.Length || targetRows.Any(row => row.BranchId is not (2 or 4) || !row.Active || !row.IsActive || string.IsNullOrWhiteSpace(row.UserName)))
        throw new InvalidOperationException("ERP target rows differ from the reviewed active users/branches.");
    if (targetRows.GroupBy(row => EffectiveEmail(row), StringComparer.OrdinalIgnoreCase).Any(group => group.Count() > 1))
        throw new InvalidOperationException("The duplicate email decision is required before processing both users 14 and 15.");
}

async Task ValidateSecurity(List<RepairUser> targetRows)
{
    foreach (var row in targetRows)
    {
        var expected = row with { Email = EffectiveEmail(row) };
        var identity = await users.Users.AsNoTracking().SingleOrDefaultAsync(user => user.SubscriptionId == subscription && user.ErpUserId == row.Id);
        if (identity != null && (!Matches(identity, expected) || row.IdentityId != null && row.IdentityId != identity.Id))
            throw new InvalidOperationException($"The existing account link differs for ERP user {row.Id}.");
        var nameMatch = await users.FindByNameAsync(expected.UserName);
        var emailMatch = await users.FindByEmailAsync(expected.Email);
        if (nameMatch != null && nameMatch.Id != identity?.Id || emailMatch != null && emailMatch.Id != identity?.Id)
            throw new InvalidOperationException($"The login name or email is already owned by another account for ERP user {row.Id}.");
    }
}

static bool Matches(ApplicationUser identity, RepairUser row) => identity.SubscriptionId == subscription && identity.ErpUserId == row.Id &&
    identity.IdentityRegistrationId == row.RegistrationId && string.Equals(identity.UserName,row.UserName,StringComparison.OrdinalIgnoreCase) &&
    string.Equals(identity.Email,row.Email,StringComparison.OrdinalIgnoreCase);

static void Ensure(IdentityResult result)
{
    if (!result.Succeeded) throw new InvalidOperationException("Identity validation failed: " + string.Join(',',result.Errors.Select(error => error.Code)));
}

Task SaveReceipt(string phase, List<RepairUser> targetRows) => File.WriteAllTextAsync(receipt,
    JsonSerializer.Serialize(new { Phase=phase, CompanyCode=companyCode, SubscriptionId=subscription, TimeUtc=DateTime.UtcNow,
        IdentityPasswordSourceUserId=administratorErpId, BranchScope="View current branch only; existing default retained", Users=targetRows },
        new JsonSerializerOptions { WriteIndented=true }));
