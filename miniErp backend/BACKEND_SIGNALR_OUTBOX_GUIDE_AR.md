# دليل نقل SignalR + Outbox إلى مشروع Backend آخر

هذا الدليل يشرح نقل نفس فكرة التحديث اللحظي الموجودة في MiniERP إلى مشروع ASP.NET Core آخر، بحيث يصل للعميل إشعار عند أي `Add` أو `Update` أو `Delete` ناجح، من غير أن نحقن SignalR داخل كل Service ومن غير أن ننشئ circular dependencies بين طبقات المشروع.

> الأمثلة تستخدم `CompanyId` لعزل بيانات كل شركة. إذا كان المشروع يستخدم `TenantId` فاستبدل الاسم فقط. وإذا كان المشروع غير متعدد الشركات، راجع قسم **المشروع Single-Tenant**.

## النتيجة المطلوبة

مسار العملية يكون كالتالي:

```text
Service / Command Handler
        |
        | SaveChanges
        v
EF Core ChangeTracker
        |
        | ينشئ Outbox message داخل نفس transaction
        v
Business data + RealtimeOutboxMessages
        |
        | بعد نجاح الـ commit
        v
RealtimeOutboxDispatcher
        |
        | SignalR: entityChanged
        v
company:{companyId}
        |
        v
Frontend يعيد تحميل البيانات المتأثرة
```

الضمان المهم هنا:

- إذا فشل حفظ البيانات أو حدث `Rollback` فلن يوجد إشعار.
- إذا نجح حفظ البيانات فسيظل الإشعار محفوظًا حتى ينجح إرساله.
- الـ Service لا يعرف شيئًا عن SignalR أو الـ Hub.
- الـ Domain والـ Application لا يعتمدان على Infrastructure أو API.
- كل شركة تستقبل أحداثها فقط.

## توزيع المسؤوليات بين المشاريع

التوزيع المقترح في Clean Architecture:

```text
YourApp.Domain
  Entities فقط

YourApp.Application
  Common/Realtime/RealtimeChangeNotification.cs
  Common/Authentication/CompanyClaimResolver.cs

YourApp.Infrastructure
  Persistence/Realtime/RealtimeOutboxMessage.cs
  Persistence/Configurations/RealtimeOutboxMessageConfiguration.cs
  Persistence/Interceptors/RealtimeChangeCollector.cs
  Persistence/ApplicationDbContext.cs

YourApp.Api
  Realtime/UpdatesHub.cs
  Realtime/RealtimeHubGroups.cs
  Realtime/RealtimeOutboxDispatcher.cs
  Program.cs
```

اتجاه الاعتماد الصحيح:

```text
Domain <- Application <- Infrastructure <- API
```

لا تضع `IHubContext` داخل Application Service؛ لأن هذا يربط منطق العمل بطريقة الإرسال، ويجعل المعاملة غير مضمونة، وقد يؤدي إلى اعتماد دائري بين الطبقات.

---

## 1. تعريف شكل الحدث

أنشئ الملف:

`YourApp.Application/Common/Realtime/RealtimeChangeNotification.cs`

```csharp
namespace YourApp.Application.Common.Realtime;

public static class RealtimeEventNames
{
    public const string EntityChanged = "entityChanged";
}

public sealed record RealtimeEntityChange(
    string Resource,
    string Action,
    string? EntityId,
    IReadOnlyList<int> StoreIds);

public sealed record RealtimeChangeNotification(
    Guid EventId,
    DateTime OccurredAtUtc,
    IReadOnlyList<RealtimeEntityChange> Changes);
```

معنى الحقول:

| الحقل | المعنى |
|---|---|
| `EventId` | رقم فريد للحدث، ويستخدمه العميل لمنع معالجة نفس الحدث مرتين |
| `OccurredAtUtc` | وقت حدوث التعديل بتوقيت UTC |
| `Resource` | اسم الـ Entity مثل `Invoice` أو `Item` أو `CashboxTransfer` |
| `Action` | إحدى القيم `Added`, `Updated`, `Deleted` |
| `EntityId` | المفتاح الأساسي كسلسلة، أو `null` في بعض عمليات الإضافة ذات الرقم المولد من قاعدة البيانات |
| `StoreIds` | أرقام المخازن المرتبطة بالتعديل، ويمكن حذفها إذا لم يحتجها المشروع |

مثال الرسالة التي تصل إلى العميل:

```json
{
  "eventId": "e3270156-0790-48c1-a391-dfb0ca305f34",
  "occurredAtUtc": "2026-08-09T11:30:00Z",
  "changes": [
    {
      "resource": "Invoice",
      "action": "Updated",
      "entityId": "1254",
      "storeIds": [3]
    },
    {
      "resource": "ItemStoreBalance",
      "action": "Updated",
      "entityId": "890",
      "storeIds": [3]
    }
  ]
}
```

الرسالة ليست نسخة كاملة من البيانات. هي رسالة **إبطال Cache / طلب Refresh**؛ عند وصولها يعيد العميل استدعاء الـ API المناسب.

---

## 2. إنشاء جدول الـ Outbox

أنشئ الملف:

`YourApp.Infrastructure/Persistence/Realtime/RealtimeOutboxMessage.cs`

```csharp
namespace YourApp.Infrastructure.Persistence.Realtime;

public sealed class RealtimeOutboxMessage
{
    public Guid Id { get; set; }

    public int CompanyId { get; set; }

    public DateTime OccurredAtUtc { get; set; }

    public string Payload { get; set; } = string.Empty;

    public DateTime? DispatchedAtUtc { get; set; }

    public int AttemptCount { get; set; }

    public DateTime? NextAttemptAtUtc { get; set; }

    public string? LastError { get; set; }
}
```

ثم إعداد EF Core:

`YourApp.Infrastructure/Persistence/Configurations/RealtimeOutboxMessageConfiguration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YourApp.Infrastructure.Persistence.Realtime;

namespace YourApp.Infrastructure.Persistence.Configurations;

public sealed class RealtimeOutboxMessageConfiguration
    : IEntityTypeConfiguration<RealtimeOutboxMessage>
{
    public void Configure(EntityTypeBuilder<RealtimeOutboxMessage> builder)
    {
        builder.ToTable("RealtimeOutboxMessages");

        builder.HasKey(message => message.Id);

        builder.Property(message => message.CompanyId)
            .IsRequired();

        builder.Property(message => message.OccurredAtUtc)
            .IsRequired();

        builder.Property(message => message.Payload)
            .IsRequired();

        builder.Property(message => message.LastError)
            .HasMaxLength(2_000);

        builder.HasIndex(message => new
            {
                message.DispatchedAtUtc,
                message.NextAttemptAtUtc,
                message.OccurredAtUtc
            })
            .HasDatabaseName("IX_RealtimeOutboxMessages_Dispatch");

        builder.HasIndex(message => new
            {
                message.CompanyId,
                message.OccurredAtUtc
            });
    }
}
```

أضف إلى `ApplicationDbContext`:

```csharp
public DbSet<RealtimeOutboxMessage> RealtimeOutboxMessages =>
    Set<RealtimeOutboxMessage>();
```

وتأكد أن الإعدادات تُقرأ:

```csharp
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);
    builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
}
```

أنشئ وطبّق Migration:

```powershell
dotnet ef migrations add AddRealtimeOutbox `
  --project src/YourApp.Infrastructure `
  --startup-project src/YourApp.Api

dotnet ef database update `
  --project src/YourApp.Infrastructure `
  --startup-project src/YourApp.Api
```

عدّل أسماء ومسارات المشاريع حسب الـ solution الآخر.

---

## 3. قراءة CompanyId من الـ JWT

لا تقبل `CompanyId` من اتصال SignalR أو query string؛ المستخدم قد يغيره ويشترك في شركة أخرى. استخرجه من الـ JWT الموثق على الخادم.

مثال:

```csharp
using System.Globalization;
using System.Security.Claims;

namespace YourApp.Application.Common.Authentication;

public static class CustomClaimTypes
{
    public const string CompanyId = "company_id";
}

public static class CompanyClaimResolver
{
    public static bool TryGetCompanyId(
        ClaimsPrincipal? principal,
        out int companyId)
    {
        companyId = 0;
        if (principal?.Identity?.IsAuthenticated != true)
        {
            return false;
        }

        var claims = principal.FindAll(CustomClaimTypes.CompanyId).ToArray();

        return claims.Length == 1 &&
            int.TryParse(
                claims[0].Value,
                NumberStyles.None,
                CultureInfo.InvariantCulture,
                out companyId) &&
            companyId > 0;
    }
}
```

وجود claim واحدة فقط مقصود: يمنع قبول token غامض يحتوي أكثر من قيمة للشركة الحالية. يجب كذلك أن تستمر آلية التحقق الحالية في التأكد أن المستخدم ما زال عضوًا في الشركة.

---

## 4. التقاط Add / Update / Delete من EF Core

أنشئ الملف:

`YourApp.Infrastructure/Persistence/Interceptors/RealtimeChangeCollector.cs`

> الاسم `Collector` أدق من `Interceptor` هنا لأننا نستدعيه من overrides الخاصة بـ `SaveChanges`. يمكن الاحتفاظ باسم `RealtimeChangeInterceptor` إذا أردت مطابقة MiniERP حرفيًا.

```csharp
using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using YourApp.Application.Common.Authentication;
using YourApp.Application.Common.Realtime;
using YourApp.Infrastructure.Persistence.Realtime;

namespace YourApp.Infrastructure.Persistence.Interceptors;

public sealed class RealtimeChangeCollector(
    IHttpContextAccessor httpContextAccessor,
    TimeProvider timeProvider)
{
    private static readonly JsonSerializerOptions SerializerOptions =
        new(JsonSerializerDefaults.Web);

    public void EnqueueNotifications(DbContext? dbContext)
    {
        if (dbContext is null || dbContext.ChangeTracker
                .Entries<RealtimeOutboxMessage>()
                .Any(entry => entry.State == EntityState.Added))
        {
            return;
        }

        dbContext.ChangeTracker.DetectChanges();

        var entries = dbContext.ChangeTracker
            .Entries()
            .Where(IsBusinessChange)
            .ToArray();

        if (entries.Length == 0)
        {
            return;
        }

        var fallbackCompanyIds = ResolveFallbackCompanyIds(entries);
        var changesByCompany = new Dictionary<
            int,
            Dictionary<string, RealtimeEntityChange>>();

        foreach (var entry in entries)
        {
            var companyIds = ResolveCompanyIds(entry, fallbackCompanyIds);
            if (companyIds.Count == 0)
            {
                continue;
            }

            var change = BuildChange(entry);
            var changeKey = BuildChangeKey(change);

            foreach (var companyId in companyIds)
            {
                if (!changesByCompany.TryGetValue(companyId, out var changes))
                {
                    changes = new Dictionary<string, RealtimeEntityChange>(
                        StringComparer.Ordinal);
                    changesByCompany.Add(companyId, changes);
                }

                changes.TryAdd(changeKey, change);
            }
        }

        var occurredAtUtc = timeProvider.GetUtcNow().UtcDateTime;

        foreach (var (companyId, changes) in changesByCompany)
        {
            if (changes.Count == 0)
            {
                continue;
            }

            var eventId = Guid.NewGuid();
            var notification = new RealtimeChangeNotification(
                EventId: eventId,
                OccurredAtUtc: occurredAtUtc,
                Changes: changes.Values.ToArray());

            dbContext.Add(new RealtimeOutboxMessage
            {
                Id = eventId,
                CompanyId = companyId,
                OccurredAtUtc = occurredAtUtc,
                Payload = JsonSerializer.Serialize(
                    notification,
                    SerializerOptions)
            });
        }
    }

    private static bool IsBusinessChange(EntityEntry entry)
    {
        if (entry.State is not (
                EntityState.Added or
                EntityState.Modified or
                EntityState.Deleted))
        {
            return false;
        }

        // مهم: غيّر YourApp.Domain.Entities إلى namespace الـ Entities في المشروع الآخر.
        var entityNamespace = entry.Metadata.ClrType.Namespace;
        return entityNamespace?.StartsWith(
            "YourApp.Domain.Entities.",
            StringComparison.Ordinal) == true;
    }

    private IReadOnlySet<int> ResolveFallbackCompanyIds(
        IReadOnlyCollection<EntityEntry> entries)
    {
        var companyIds = entries
            .Select(TryGetCompanyId)
            .Where(companyId => companyId.HasValue)
            .Select(companyId => companyId!.Value)
            .ToHashSet();

        if (CompanyClaimResolver.TryGetCompanyId(
                httpContextAccessor.HttpContext?.User,
                out var currentCompanyId))
        {
            companyIds.Add(currentCompanyId);
        }

        return companyIds;
    }

    private static IReadOnlySet<int> ResolveCompanyIds(
        EntityEntry entry,
        IReadOnlySet<int> fallbackCompanyIds)
    {
        var companyId = TryGetCompanyId(entry);
        if (companyId.HasValue)
        {
            return new HashSet<int> { companyId.Value };
        }

        return fallbackCompanyIds;
    }

    private static int? TryGetCompanyId(EntityEntry entry)
    {
        var companyProperty = entry.Metadata.FindProperty("CompanyId");
        if (companyProperty is null)
        {
            return null;
        }

        var value = entry.Property(companyProperty.Name).CurrentValue;
        return value is int companyId && companyId > 0
            ? companyId
            : null;
    }

    private static RealtimeEntityChange BuildChange(EntityEntry entry) =>
        new(
            Resource: entry.Metadata.ClrType.Name,
            Action: ResolveAction(entry),
            EntityId: ResolveEntityId(entry),
            StoreIds: ResolveStoreIds(entry));

    private static string ResolveAction(EntityEntry entry)
    {
        if (entry.State == EntityState.Added)
        {
            return "Added";
        }

        if (entry.State == EntityState.Deleted || BecameSoftDeleted(entry))
        {
            return "Deleted";
        }

        return "Updated";
    }

    private static bool BecameSoftDeleted(EntityEntry entry)
    {
        var propertyMetadata = entry.Metadata.FindProperty("IsDeleted");
        if (propertyMetadata is null)
        {
            return false;
        }

        var property = entry.Property(propertyMetadata.Name);
        return entry.State == EntityState.Modified &&
            property.IsModified &&
            property.OriginalValue is false &&
            property.CurrentValue is true;
    }

    private static string? ResolveEntityId(EntityEntry entry)
    {
        var primaryKey = entry.Metadata.FindPrimaryKey();
        if (primaryKey is null)
        {
            return null;
        }

        var values = new List<string>(primaryKey.Properties.Count);

        foreach (var propertyMetadata in primaryKey.Properties)
        {
            var property = entry.Property(propertyMetadata.Name);
            var value = property.CurrentValue;

            if (value is null ||
                property.IsTemporary ||
                entry.State == EntityState.Added && IsDefaultValue(value))
            {
                return null;
            }

            values.Add(Convert.ToString(
                value,
                CultureInfo.InvariantCulture)!);
        }

        return string.Join(':', values);
    }

    private static bool IsDefaultValue(object value) => value switch
    {
        int intValue => intValue == 0,
        long longValue => longValue == 0,
        Guid guidValue => guidValue == Guid.Empty,
        _ => false
    };

    private static IReadOnlyList<int> ResolveStoreIds(EntityEntry entry) =>
        entry.Properties
            .Where(property => property.Metadata.Name.EndsWith(
                "StoreId",
                StringComparison.Ordinal))
            .Select(property => property.CurrentValue)
            .OfType<int>()
            .Where(storeId => storeId > 0)
            .Distinct()
            .Order()
            .ToArray();

    private static string BuildChangeKey(RealtimeEntityChange change) =>
        string.Join(
            '|',
            change.Resource,
            change.Action,
            change.EntityId ?? string.Empty,
            string.Join(',', change.StoreIds));
}
```

### ما الذي يجب تخصيصه في الـ Collector؟

1. غيّر `YourApp.Domain.Entities.` إلى namespace المشروع الآخر.
2. إذا كانت بعض Entities خارج هذا namespace مثل Identity entities، أضفها صراحة إلى `IsBusinessChange`.
3. إذا كان اسم الشركة `TenantId` فاستبدل `CompanyId`.
4. إذا كانت الـ Entity الرئيسية `Company` لا تحتوي `CompanyId`، عالجها بشكل خاص باستخدام `Company.Id`.
5. إذا لم يوجد `StoreId` في المشروع، احذف `StoreIds` و`ResolveStoreIds`.
6. إذا كان الحذف المنطقي يستخدم اسمًا غير `IsDeleted`، عدّل `BecameSoftDeleted`.

الـ collector يجمع التغييرات المتكررة داخل `SaveChanges` واحدة، ثم ينشئ رسالة واحدة لكل شركة تحتوي كل الـ resources المتأثرة.

---

## 5. ربط الـ Collector بـ DbContext

عدّل constructor والـ `SaveChanges` overloads كلها:

```csharp
using Microsoft.EntityFrameworkCore;
using YourApp.Infrastructure.Persistence.Interceptors;
using YourApp.Infrastructure.Persistence.Realtime;

namespace YourApp.Infrastructure.Persistence;

public sealed class ApplicationDbContext : DbContext
{
    private readonly RealtimeChangeCollector? realtimeChangeCollector;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        RealtimeChangeCollector? realtimeChangeCollector = null)
        : base(options)
    {
        this.realtimeChangeCollector = realtimeChangeCollector;
    }

    public DbSet<RealtimeOutboxMessage> RealtimeOutboxMessages =>
        Set<RealtimeOutboxMessage>();

    public override int SaveChanges()
    {
        realtimeChangeCollector?.EnqueueNotifications(this);
        return base.SaveChanges();
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        realtimeChangeCollector?.EnqueueNotifications(this);
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        realtimeChangeCollector?.EnqueueNotifications(this);
        return base.SaveChangesAsync(cancellationToken);
    }

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        realtimeChangeCollector?.EnqueueNotifications(this);
        return base.SaveChangesAsync(
            acceptAllChangesOnSuccess,
            cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly);
    }
}
```

لماذا يتم إنشاء الـ Outbox قبل `base.SaveChanges`؟ لأن EF Core سيحفظ تعديل الـ Entity ورسالة الـ Outbox في نفس العملية ونفس transaction. إذا فشل أحدهما يفشل الاثنان.

جعل الـ collector اختياريًا مفيد للـ design-time migration وبعض الاختبارات. في runtime سيتم حقنه من DI.

---

## 6. إنشاء Hub وعزل الشركات

أنشئ:

`YourApp.Api/Realtime/RealtimeHubGroups.cs`

```csharp
namespace YourApp.Api.Realtime;

internal static class RealtimeHubGroups
{
    public static string Company(int companyId) => $"company:{companyId}";
}
```

ثم:

`YourApp.Api/Realtime/UpdatesHub.cs`

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using YourApp.Application.Common.Authentication;

namespace YourApp.Api.Realtime;

[Authorize]
public sealed class UpdatesHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        if (!CompanyClaimResolver.TryGetCompanyId(
                Context.User,
                out var companyId))
        {
            Context.Abort();
            return;
        }

        await Groups.AddToGroupAsync(
            Context.ConnectionId,
            RealtimeHubGroups.Company(companyId));

        await base.OnConnectedAsync();
    }
}
```

لا تنشئ Hub method مثل `JoinCompany(companyId)` يأخذ رقم الشركة من العميل. الاشتراك يتم تلقائيًا من الـ claim الموثقة.

---

## 7. إنشاء عامل إرسال الـ Outbox

أنشئ:

`YourApp.Api/Realtime/RealtimeOutboxDispatcher.cs`

```csharp
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using YourApp.Application.Common.Realtime;
using YourApp.Infrastructure.Persistence;
using YourApp.Infrastructure.Persistence.Realtime;

namespace YourApp.Api.Realtime;

public sealed class RealtimeOutboxDispatcher(
    IServiceScopeFactory scopeFactory,
    IHubContext<UpdatesHub> hubContext,
    TimeProvider timeProvider,
    ILogger<RealtimeOutboxDispatcher> logger) : BackgroundService
{
    private const int BatchSize = 100;
    private const int RetentionDays = 7;
    private static readonly TimeSpan IdleDelay = TimeSpan.FromSeconds(1);
    private static readonly JsonSerializerOptions SerializerOptions =
        new(JsonSerializerDefaults.Web);

    private DateTime nextCleanupAtUtc = DateTime.MinValue;

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var dispatched = await DispatchBatchAsync(stoppingToken);
                if (dispatched > 0)
                {
                    continue;
                }
            }
            catch (OperationCanceledException) when (
                stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception exception)
            {
                logger.LogError(
                    exception,
                    "Realtime outbox dispatch failed.");
            }

            await Task.Delay(IdleDelay, stoppingToken);
        }
    }

    private async Task<int> DispatchBatchAsync(
        CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var dbContext = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var now = timeProvider.GetUtcNow().UtcDateTime;

        var messages = await dbContext.RealtimeOutboxMessages
            .Where(message =>
                message.DispatchedAtUtc == null &&
                (message.NextAttemptAtUtc == null ||
                    message.NextAttemptAtUtc <= now))
            .OrderBy(message => message.OccurredAtUtc)
            .ThenBy(message => message.Id)
            .Take(BatchSize)
            .ToListAsync(cancellationToken);

        foreach (var message in messages)
        {
            await DispatchAsync(message, now, cancellationToken);
        }

        if (messages.Count > 0)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        if (now >= nextCleanupAtUtc)
        {
            await dbContext.RealtimeOutboxMessages
                .Where(message =>
                    message.DispatchedAtUtc != null &&
                    message.DispatchedAtUtc < now.AddDays(-RetentionDays))
                .ExecuteDeleteAsync(cancellationToken);

            nextCleanupAtUtc = now.AddHours(1);
        }

        return messages.Count;
    }

    private async Task DispatchAsync(
        RealtimeOutboxMessage message,
        DateTime now,
        CancellationToken cancellationToken)
    {
        try
        {
            var notification = JsonSerializer.Deserialize<
                RealtimeChangeNotification>(
                message.Payload,
                SerializerOptions)
                ?? throw new JsonException(
                    "Realtime outbox payload was empty.");

            await hubContext.Clients
                .Group(RealtimeHubGroups.Company(message.CompanyId))
                .SendAsync(
                    RealtimeEventNames.EntityChanged,
                    notification,
                    cancellationToken);

            message.DispatchedAtUtc = now;
            message.NextAttemptAtUtc = null;
            message.LastError = null;
        }
        catch (OperationCanceledException) when (
            cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            message.AttemptCount++;
            message.LastError = Truncate(exception.Message, 2_000);
            message.NextAttemptAtUtc = now.AddSeconds(
                Math.Min(
                    300,
                    Math.Pow(2, Math.Min(message.AttemptCount, 8))));

            logger.LogWarning(
                exception,
                "Realtime event {EventId} could not be dispatched on attempt {AttemptCount}.",
                message.Id,
                message.AttemptCount);
        }
    }

    private static string Truncate(string value, int maximumLength) =>
        value.Length <= maximumLength
            ? value
            : value[..maximumLength];
}
```

هذا العامل:

- يقرأ 100 رسالة في كل batch.
- يرسل الحدث باسم `entityChanged`.
- يسجل نجاح الإرسال في `DispatchedAtUtc`.
- يعيد المحاولة بتأخير تصاعدي حتى 5 دقائق.
- يحذف الرسائل الناجحة الأقدم من 7 أيام مرة كل ساعة.

---

## 8. إعداد JWT الخاص باتصال SignalR

عميل SignalR يمرر الـ access token في query string عند استخدام WebSockets. اجعل `JwtBearer` يقرأه **فقط** لمسار الـ Hub:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Primitives;

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // احتفظ بـ TokenValidationParameters الموجودة في المشروع.

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!StringValues.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/hubs/updates"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });
```

إذا كان المشروع لديه `JwtBearerEvents` بالفعل، لا تستبدلها وتفقد `OnTokenValidated` أو باقي الأحداث؛ ادمج `OnMessageReceived` معها.

اعتبارات أمنية مهمة:

- استخدم HTTPS دائمًا.
- لا تسجل query string لمسار الـ Hub لأن بها access token.
- اجعل شرط قراءة token مقصورًا على `/hubs/updates`.
- طبّق نفس فحوص صلاحية المستخدم والشركة المستخدمة في طلبات REST.

---

## 9. التسجيل في Dependency Injection وProgram.cs

في Infrastructure registration:

```csharp
services.AddHttpContextAccessor();
services.AddSingleton(TimeProvider.System);
services.AddScoped<RealtimeChangeCollector>();
```

إذا كان `TimeProvider` مسجلًا بالفعل فلا تسجله مرتين. يمكن استخدام:

```csharp
services.TryAddSingleton(TimeProvider.System);
```

وفي `Program.cs` الخاص بالـ API:

```csharp
builder.Services.AddSignalR();
builder.Services.AddHostedService<RealtimeOutboxDispatcher>();
```

ثم middleware بالترتيب:

```csharp
app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<UpdatesHub>("/hubs/updates");
```

لا تحتاج غالبًا إلى NuGet package منفصلة لسيرفر SignalR في مشروع `Microsoft.NET.Sdk.Web`؛ فهو ضمن ASP.NET Core shared framework. المشروع الذي يحتوي Infrastructure خارج Web SDK قد يحتاج:

```xml
<FrameworkReference Include="Microsoft.AspNetCore.App" />
```

بسبب استخدام `IHttpContextAccessor` وJWT abstractions.

### CORS للإنتاج

استخدم origins صريحة:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "https://app.example.com",
                "https://admin.example.com")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
```

لا تجمع `AllowAnyOrigin()` مع `AllowCredentials()`.

---

## 10. ماذا يحدث عند كل عملية؟

### Add

```csharp
dbContext.Invoices.Add(invoice);
await dbContext.SaveChangesAsync(cancellationToken);
```

سيُحفظ `Invoice` ورسالة Outbox في transaction واحدة. إذا كان `Invoice.Id` يولد من قاعدة البيانات، فقد يكون `EntityId = null` لأن الحدث يُجهز قبل تنفيذ INSERT. يظل `Resource = Invoice` و`Action = Added` كافيين لتحديث القائمة.

إذا كان لا بد من إرسال الرقم الجديد، توجد ثلاثة اختيارات:

1. استخدم GUID مولدًا من التطبيق قبل الحفظ.
2. أنشئ domain event بعد الحفظ مع الحفاظ على نفس transaction بتصميم أكثر تخصصًا.
3. اجعل العميل يعيد تحميل قائمة الـ resource عند حدث `Added` ولا يعتمد على `EntityId`.

الخيار الثالث هو الأبسط لهذه الميزة.

### Update

```csharp
invoice.ChangeDate(newDate);
await dbContext.SaveChangesAsync(cancellationToken);
```

يصل `Resource = Invoice`, `Action = Updated`, `EntityId = invoice.Id`.

### Delete

الحذف الحقيقي:

```csharp
dbContext.Invoices.Remove(invoice);
await dbContext.SaveChangesAsync(cancellationToken);
```

والحذف المنطقي:

```csharp
invoice.IsDeleted = true;
await dbContext.SaveChangesAsync(cancellationToken);
```

كلاهما يصل إلى العميل كـ `Deleted` إذا كان `BecameSoftDeleted` متوافقًا مع اسم حقل الحذف في المشروع.

### Transaction وRollback

```csharp
await using var transaction =
    await dbContext.Database.BeginTransactionAsync(cancellationToken);

dbContext.Invoices.Add(invoice);
await dbContext.SaveChangesAsync(cancellationToken);

await transaction.RollbackAsync(cancellationToken);
```

لن تبقى الفاتورة ولا رسالة الـ Outbox. هذه هي أهم فائدة مقارنة بإرسال SignalR مباشرة من الـ Service.

---

## 11. كيف يعرف العميل الـ Entity التي تغيرت؟

الـ backend يضع اسم نوع الـ Entity في `Resource`:

```csharp
Resource: entry.Metadata.ClrType.Name
```

أمثلة:

| العملية في Backend | الحدث |
|---|---|
| إضافة فاتورة | `Invoice / Added` |
| تعديل صنف | `Item / Updated` |
| حذف مخزن | `Store / Deleted` |
| تحويل بين خزائن | `CashboxTransfer / Added` وقد يصاحبه `Cashbox / Updated` |

يجب الاتفاق مع مطور العميل على أن أسماء `Resource` عقد ثابت. إذا تمت إعادة تسمية C# Entity فسيتغير الاسم. لتجنب ذلك في نظام كبير، استخدم mapping ثابتًا:

```csharp
private static string ResolveResource(EntityEntry entry) =>
    entry.Metadata.ClrType.Name switch
    {
        "Invoice" => "invoices",
        "Item" => "items",
        "CashboxTransfer" => "cashbox-transfers",
        _ => entry.Metadata.ClrType.Name
    };
```

ثم استخدم `ResolveResource(entry)` بدل `entry.Metadata.ClrType.Name`. الـ mapping الثابت أكثر أمانًا كـ public contract.

---

## 12. Single-Tenant بدون شركات

إذا كان المشروع غير متعدد الشركات:

- احذف `CompanyId` من جدول Outbox.
- احذف `CompanyClaimResolver`.
- لا تضف الاتصال إلى company group.
- أرسل إلى جميع العملاء الموثقين:

```csharp
await hubContext.Clients.All.SendAsync(
    RealtimeEventNames.EntityChanged,
    notification,
    cancellationToken);
```

أبقِ `[Authorize]` على الـ Hub حتى لا تصبح الأحداث عامة.

---

## 13. الاختبارات المطلوبة

لا تعتبر الميزة مكتملة قبل الاختبارات التالية:

### اختبار Add / Update / Delete

لكل عملية:

1. نفذ التعديل على Entity تحمل `CompanyId = 7`.
2. نفذ `SaveChanges`.
3. اقرأ `RealtimeOutboxMessages` باستخدام `IgnoreQueryFilters()` عند الحاجة.
4. فك JSON.
5. تحقق من كل property منفردة:
   - `CompanyId == 7`
   - `Resource == "Invoice"`
   - `Action` صحيحة
   - `EntityId` صحيحة عند توفرها
   - `StoreIds` صحيحة

### اختبار Rollback

1. افتح transaction.
2. أضف Entity ونفذ `SaveChanges`.
3. نفذ rollback.
4. تحقق أن عدد الـ Entities ورسائل الـ Outbox كلاهما صفر.

### اختبار عزل الشركات

1. أنشئ مستخدمًا للشركة 1 وآخر للشركة 2.
2. افتح اتصال SignalR لكل منهما.
3. عدّل Entity للشركة 1.
4. تحقق أن مستخدم الشركة 1 استقبل الحدث وأن مستخدم الشركة 2 لم يستقبله.

### اختبار الأمان

- اتصال من غير token يجب أن يفشل.
- token منتهية يجب أن تفشل.
- token بلا `CompanyId` يجب أن يتم abort لاتصالها.
- token تحتوي أكثر من company claim يجب رفضها.

### اختبار إعادة المحاولة

- اجعل الإرسال يفشل مؤقتًا.
- تحقق من زيادة `AttemptCount` وتعبئة `LastError` و`NextAttemptAtUtc`.
- عند نجاح الإرسال لاحقًا تحقق من تعبئة `DispatchedAtUtc`.

---

## 14. ضمانات الإرسال وحدودها

هذا التصميم يحقق **at-least-once delivery** وليس exactly-once.

قد يحدث التالي:

1. يرسل العامل الحدث بنجاح.
2. يتوقف السيرفر قبل حفظ `DispatchedAtUtc`.
3. بعد التشغيل يرسل نفس الحدث مرة أخرى.

لذلك يجب أن يحتفظ العميل مؤقتًا بآخر `EventId` التي عالجها ويتجاهل المكرر.

كذلك:

- الترتيب داخل batch يعتمد على `OccurredAtUtc` ثم `Id`، لكنه ليس ضمانًا مطلقًا عبر أكثر من instance.
- لا تضع منطقًا ماليًا أو تعديل بيانات داخل handler الخاص بالعميل؛ الحدث للتحديث فقط.
- إذا كانت الرسالة تالفة ستستمر المحاولة في النسخة الأساسية. في الإنتاج يفضل إضافة `MaxAttempts` و`DeadLetteredAtUtc` وتنبيه للمراقبة.

---

## 15. التشغيل على أكثر من API instance

هذه نقطة ضرورية قبل الـ production.

### أ. SignalR scale-out

إذا كان العملاء متصلين بأكثر من instance، فقد يعمل الـ dispatcher على instance مختلف عن اتصال العميل. استخدم واحدًا من:

- Azure SignalR Service.
- Redis backplane عبر `AddStackExchangeRedis`.

مثال Redis:

```csharp
builder.Services
    .AddSignalR()
    .AddStackExchangeRedis(
        builder.Configuration.GetConnectionString("Redis")!);
```

### ب. منع عاملين من أخذ نفس رسالة Outbox

الاستعلام البسيط في المثال مناسب لـ instance واحدة. مع أكثر من instance قد يقرأ عاملان نفس الرسالة ويرسلانها مرتين.

في الإنتاج أضف آلية claim/lease ذرية، مثل:

```text
ProcessingBy       nullable string
LeaseUntilUtc      nullable datetime
```

ثم كل instance يحجز batch داخل SQL statement/transaction قبل الإرسال. بدائل مقبولة:

- distributed lock.
- job queue موثوقة.
- SQL Server locking مثل `UPDLOCK, READPAST` بتطبيق مدروس.

حتى مع lease تظل دلالة الإرسال at-least-once، ولذلك يبقى deduplication باستخدام `EventId` مطلوبًا.

---

## 16. المراقبة والصيانة

استعلامات مفيدة لـ SQL Server:

عدد الرسائل المنتظرة:

```sql
SELECT COUNT(*) AS PendingCount
FROM RealtimeOutboxMessages
WHERE DispatchedAtUtc IS NULL;
```

أقدم رسالة منتظرة:

```sql
SELECT MIN(OccurredAtUtc) AS OldestPendingAtUtc
FROM RealtimeOutboxMessages
WHERE DispatchedAtUtc IS NULL;
```

أكثر الرسائل فشلًا:

```sql
SELECT TOP (50)
    Id,
    CompanyId,
    OccurredAtUtc,
    AttemptCount,
    NextAttemptAtUtc,
    LastError
FROM RealtimeOutboxMessages
WHERE DispatchedAtUtc IS NULL
ORDER BY AttemptCount DESC, OccurredAtUtc;
```

راقب على الأقل:

- عدد الرسائل المعلقة.
- عمر أقدم رسالة معلقة.
- عدد محاولات الفشل.
- زمن وصول الحدث من `OccurredAtUtc` حتى `DispatchedAtUtc`.
- عدد اتصالات SignalR الحالية.

---

## 17. أخطاء شائعة

| المشكلة | السبب المحتمل | الحل |
|---|---|---|
| REST يعمل وHub يعيد 401 | JWT لا يقرأ `access_token` لمسار Hub | أضف `OnMessageReceived` للمسار الصحيح |
| كل الشركات تستقبل الحدث | استخدام `Clients.All` أو قبول CompanyId من العميل | استخدم group مشتقة من claim |
| لا يتم إنشاء Outbox | namespace في `IsBusinessChange` خطأ أو collector غير مسجل | صحح namespace وسجل Scoped service |
| Outbox موجود ولا يُرسل | hosted service غير مسجلة أو dispatcher يفشل | سجلها وافحص logs و`LastError` |
| الحذف المنطقي يصل Updated | اسم/منطق `IsDeleted` مختلف | خصص `BecameSoftDeleted` |
| حدث Add بلا EntityId | المفتاح يولد داخل قاعدة البيانات | اجعل العميل يحدث القائمة أو استخدم GUID مولدًا مسبقًا |
| أحداث مكررة | at-least-once أو أكثر من dispatcher | deduplicate بـ EventId وأضف lease عند scale-out |
| يعمل على instance ولا يصل لعملاء الأخرى | لا يوجد SignalR backplane | استخدم Redis أو Azure SignalR |
| حدث غير صحيح من Background Job | لا يوجد HttpContext ولا CompanyId على Entity | اجعل كل Entity/command يحدد الشركة من سياق موثوق |

---

## 18. ترتيب التنفيذ المختصر

نفذ بالترتيب التالي:

1. أضف contracts الخاصة بالحدث إلى Application.
2. أضف `RealtimeOutboxMessage` وإعداد EF Core.
3. أضف `DbSet` وأنشئ Migration.
4. أضف `CompanyClaimResolver` أو استخدم tenant context الموجود.
5. أضف `RealtimeChangeCollector` وخصص namespace وCompanyId والحذف المنطقي.
6. استدعِ collector من كل overloads الخاصة بـ `SaveChanges`.
7. سجل collector و`TimeProvider` و`IHttpContextAccessor`.
8. أضف `UpdatesHub` وcompany group.
9. أضف `RealtimeOutboxDispatcher`.
10. فعّل قراءة JWT لمسار `/hubs/updates`.
11. سجل SignalR والـ hosted service واربط الـ Hub.
12. نفذ اختبارات Add/Update/Delete/Rollback/tenant isolation.
13. إذا كان هناك أكثر من instance، أضف backplane وoutbox lease قبل الإنتاج.
14. أضف monitoring وتنبيهًا للرسائل العالقة.

---

## 19. Checklist قبل التسليم

- [ ] الـ Hub عليه `[Authorize]`.
- [ ] CompanyId مأخوذة من JWT وليست من العميل.
- [ ] business data والـ Outbox يُحفظان في transaction واحدة.
- [ ] كل `SaveChanges` overloads مغطاة.
- [ ] Add وUpdate وDelete والحذف المنطقي مغطاة.
- [ ] الـ dispatcher لديه retry وlogging.
- [ ] العميل يعرف اسم الحدث `entityChanged` وشكل payload.
- [ ] العميل يمنع تكرار `EventId`.
- [ ] CORS مضبوط على origins الفعلية.
- [ ] HTTPS مفعل ولا يتم logging للـ access token.
- [ ] Migration مطبقة قبل تشغيل النسخة الجديدة.
- [ ] Redis/Azure SignalR وoutbox lease موجودان عند التشغيل متعدد الـ instances.
- [ ] توجد مراقبة للرسائل العالقة والفاشلة.

---

## 20. الملفات المرجعية في MiniERP

يمكن مقارنة التنفيذ الجديد بالملفات الحالية:

- [RealtimeChangeNotification.cs](src/MiniErp.Application/Common/Realtime/RealtimeChangeNotification.cs)
- [RealtimeOutboxMessage.cs](src/MiniErp.Infrastructure/Persistence/Realtime/RealtimeOutboxMessage.cs)
- [RealtimeOutboxMessageConfiguration.cs](src/MiniErp.Infrastructure/Persistence/Configurations/RealtimeOutboxMessageConfiguration.cs)
- [RealtimeChangeInterceptor.cs](src/MiniErp.Infrastructure/Persistence/Interceptors/RealtimeChangeInterceptor.cs)
- [ApplicationDbContext.cs](src/MiniErp.Infrastructure/Persistence/ApplicationDbContext.cs)
- [UpdatesHub.cs](src/MiniErp.Api/Realtime/UpdatesHub.cs)
- [RealtimeHubGroups.cs](src/MiniErp.Api/Realtime/RealtimeHubGroups.cs)
- [RealtimeOutboxDispatcher.cs](src/MiniErp.Api/Realtime/RealtimeOutboxDispatcher.cs)
- [Program.cs](src/MiniErp.Api/Program.cs)
- [RealtimeChangeInterceptorTests.cs](tests/MiniErp.Tests/Realtime/RealtimeChangeInterceptorTests.cs)

## الخلاصة

لا ترسل SignalR من كل Service. اجعل EF Core يسجل وصف التغيير داخل Outbox في نفس transaction، ثم اجعل BackgroundService مسؤولًا وحده عن الإرسال. بهذه الطريقة تظل طبقات المشروع منفصلة، لا توجد circular dependency، لا يصل إشعار عن عملية فشلت، ويمكن إعادة المحاولة بأمان مع عزل كل شركة عن الأخرى.
