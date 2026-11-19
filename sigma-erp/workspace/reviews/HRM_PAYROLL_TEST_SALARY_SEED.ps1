$ErrorActionPreference = 'Stop'
$reviewDirectory = 'F:/My Work/Sigma/reviews'
$sourceText = [IO.File]::ReadAllText('F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs')
$matchedConnection = [regex]::Match($sourceText, '(?m)^\s*optionsBuilder\.UseSqlServer\("([^"\r\n]+)"\)')
if (-not $matchedConnection.Success) { throw 'Active connection missing.' }
$connectionOptions = [System.Data.SqlClient.SqlConnectionStringBuilder]::new($matchedConnection.Groups[1].Value)
if ($connectionOptions.DataSource -ne 'SQL5106.site4now.net' -or $connectionOptions.InitialCatalog -ne 'db_a82a9c_sigmaoperations1') {
    throw 'Connection differs from the authorized test target.'
}
$connectionOptions['Connect Timeout'] = 15
$connection = [System.Data.SqlClient.SqlConnection]::new($connectionOptions.ConnectionString)
$transaction = $null
$committed = $false

function Read-Records([System.Data.SqlClient.SqlCommand] $Command) {
    $reader = $Command.ExecuteReader()
    try {
        $records = [Collections.Generic.List[object]]::new()
        while ($reader.Read()) {
            $record = [ordered]@{}
            for ($index = 0; $index -lt $reader.FieldCount; $index++) {
                $value = if ($reader.IsDBNull($index)) { $null } else { $reader.GetValue($index) }
                if ($value -is [DateTime]) { $value = $value.ToString('O', [Globalization.CultureInfo]::InvariantCulture) }
                if ($value -is [Guid]) { $value = $value.ToString() }
                $record[$reader.GetName($index)] = $value
            }
            $records.Add([pscustomobject]$record)
        }
        return ,$records.ToArray()
    } finally { $reader.Close() }
}

try {
    $connection.Open()
    $transaction = $connection.BeginTransaction([Data.IsolationLevel]::Serializable)
    $command = $connection.CreateCommand()
    $command.Transaction = $transaction
    $command.CommandTimeout = 30
    $command.CommandText = @'
SET XACT_ABORT ON;
SET LOCK_TIMEOUT 15000;
IF EXISTS (SELECT 1 FROM sys.triggers WHERE parent_id IN (OBJECT_ID('dbo.SalaryPackage'),OBJECT_ID('dbo.Staff'),OBJECT_ID('dbo.Partner')) AND is_disabled=0)
    THROW 50001, 'Enabled triggers require a new review.', 1;
DECLARE @lockCount bigint;
SELECT @lockCount=COUNT_BIG(*) FROM dbo.SalaryPackage WITH (TABLOCKX,HOLDLOCK);
SELECT s.Id AS StaffId,p.SubscriptionId,p.No,s.DateOfJoining,p.IsActive,p.IsInactive
INTO #StaffScope FROM dbo.Staff s WITH (UPDLOCK,HOLDLOCK)
JOIN dbo.Partner p WITH (UPDLOCK,HOLDLOCK) ON p.Id=s.Id WHERE ISNULL(p.IsDeleted,0)=0;
IF (SELECT COUNT(*) FROM #StaffScope)<>30 OR EXISTS (SELECT 1 FROM #StaffScope WHERE SubscriptionId<=0 OR DateOfJoining>'20261001')
    THROW 50002, 'Employee scope changed; review before seeding.', 1;
IF EXISTS (SELECT 1 FROM dbo.SalaryPackage sp JOIN #StaffScope s ON s.StaffId=sp.StaffId WHERE sp.SubscriptionId<>s.SubscriptionId)
    THROW 50003, 'Salary tenant ownership mismatch.', 1;
IF EXISTS (SELECT 1 FROM dbo.SalaryPackage sp JOIN #StaffScope s ON s.StaffId=sp.StaffId
    WHERE ISNULL(sp.IsDeleted,0)=0 AND ISNULL(sp.IsActive,1)=1 AND sp.ApplicableFrom IS NULL AND sp.CreatedAt IS NULL)
    THROW 50004, 'Undated salary requires separate review.', 1;
IF EXISTS (SELECT 1 FROM dbo.PayrollRun WITH (UPDLOCK,HOLDLOCK) WHERE ISNULL(IsDeleted,0)=0 AND PeriodStart='20261001' AND IsPaid=1)
    THROW 50005, 'October payroll is paid; setup cannot proceed.', 1;
SELECT sp.* INTO #OriginalSalary FROM dbo.SalaryPackage sp;
SELECT s.StaffId,s.SubscriptionId,s.No,s.DateOfJoining,s.IsActive,s.IsInactive,
    effective.EffectiveDate,state.PackageCount,state.RequiredCount,state.DistinctCount,state.BadCount,
    state.Basic,state.Allowances,state.Gross
INTO #SalaryState
FROM #StaffScope s
OUTER APPLY (SELECT MAX(CAST(COALESCE(sp.ApplicableFrom,sp.CreatedAt) AS date)) AS EffectiveDate FROM dbo.SalaryPackage sp
    WHERE sp.StaffId=s.StaffId AND sp.SubscriptionId=s.SubscriptionId AND ISNULL(sp.IsDeleted,0)=0 AND ISNULL(sp.IsActive,1)=1
    AND CAST(COALESCE(sp.ApplicableFrom,sp.CreatedAt) AS date)<'20261101') effective
OUTER APPLY (SELECT COUNT(*) AS PackageCount,
    COUNT(DISTINCT CONCAT(sp.SalaryType,':',sp.Type)) AS DistinctCount,
    COUNT(DISTINCT CASE WHEN (sp.SalaryType=2 AND sp.Type IN (0,1,2)) OR (sp.SalaryType=0 AND sp.Type=0) OR (sp.SalaryType=1 AND sp.Type IN (0,1))
        THEN CONCAT(sp.SalaryType,':',sp.Type) END) AS RequiredCount,
    COALESCE(SUM(CASE WHEN sp.Amount<0 OR sp.SalaryType NOT IN (0,1,2) OR (sp.SalaryType=0 AND sp.Type<>0)
        OR (sp.SalaryType=1 AND sp.Type NOT IN (0,1)) OR (sp.SalaryType=2 AND NOT(sp.Type BETWEEN 0 AND 11 OR sp.Type BETWEEN 13 AND 21 OR sp.Type BETWEEN 100 AND 117)) THEN 1 ELSE 0 END),0) AS BadCount,
    COALESCE(SUM(CASE WHEN sp.SalaryType=2 AND sp.Type=0 THEN sp.Amount ELSE 0 END),0) AS Basic,
    COALESCE(SUM(CASE WHEN sp.SalaryType=2 AND sp.Type BETWEEN 1 AND 11 THEN sp.Amount ELSE 0 END),0) AS Allowances,
    COALESCE(SUM(CASE WHEN sp.SalaryType=0 AND sp.Type=0 THEN sp.Amount ELSE 0 END),0) AS Gross
    FROM dbo.SalaryPackage sp WHERE sp.StaffId=s.StaffId AND sp.SubscriptionId=s.SubscriptionId
    AND ISNULL(sp.IsDeleted,0)=0 AND ISNULL(sp.IsActive,1)=1 AND CAST(COALESCE(sp.ApplicableFrom,sp.CreatedAt) AS date)=effective.EffectiveDate) state;
SELECT * INTO #Candidates FROM #SalaryState WHERE RequiredCount<>6 OR PackageCount<>DistinctCount OR BadCount<>0 OR Gross<>Basic+Allowances;
IF (SELECT COUNT(*) FROM #Candidates)<>27 OR (SELECT COUNT(*) FROM #SalaryState)- (SELECT COUNT(*) FROM #Candidates)<>3
    THROW 50006, 'Salary candidate count changed; review before seeding.', 1;
IF EXISTS (SELECT 1 FROM dbo.SalaryPackage sp JOIN #Candidates s ON s.StaffId=sp.StaffId
    WHERE ISNULL(sp.IsDeleted,0)=0 AND ISNULL(sp.IsActive,1)=1 AND CAST(COALESCE(sp.ApplicableFrom,sp.CreatedAt) AS date)>='20261001')
    THROW 50007, 'A current/future candidate revision requires separate review.', 1;
'@
    [void]$command.ExecuteNonQuery()
    $command.CommandText = 'SELECT * FROM #OriginalSalary ORDER BY Id;'
    $originalRows = Read-Records $command
    $command.CommandText = 'SELECT * FROM #SalaryState ORDER BY StaffId;'
    $staffRows = Read-Records $command
    $command.CommandText = 'SELECT StaffId,SubscriptionId,No,IsInactive FROM #Candidates ORDER BY StaffId;'
    $candidates = Read-Records $command
    if ($originalRows.Count -ne 31 -or $staffRows.Count -ne 30 -or $candidates.Count -ne 27) { throw 'Backup scope changed.' }
    $capturedUtc = [DateTime]::UtcNow
    $backupPath = Join-Path $reviewDirectory ('HRM_PAYROLL_TEST_SALARY_SEED_' + $capturedUtc.ToString('yyyyMMddTHHmmssfffZ') + '_BACKUP.json')
    $backup = [ordered]@{
        Server = 'SQL5106.site4now.net'; Database = 'db_a82a9c_sigmaoperations1'; CapturedUtc = $capturedUtc.ToString('O')
        EffectiveFrom = '2026-10-01'; Values = @{ Basic=2000;Housing=350;Transport=250;Gross=2600;OvertimeNormal=10;OvertimeHoliday=20 }
        SalaryPackageRows = $originalRows; StaffSalaryInputs = $staffRows; Candidates = $candidates
    }
    $originalJson = ConvertTo-Json -InputObject @($originalRows) -Depth 8 -Compress
    $utf8 = [Text.UTF8Encoding]::new($false)
    [IO.File]::WriteAllText($backupPath, (ConvertTo-Json -InputObject $backup -Depth 10), $utf8)
    $backupRead = Get-Content -LiteralPath $backupPath -Raw | ConvertFrom-Json
    if (@($backupRead.SalaryPackageRows).Count -ne 31 -or @($backupRead.Candidates).Count -ne 27) { throw 'Backup verification failed.' }
    $backupHash = (Get-FileHash -LiteralPath $backupPath -Algorithm SHA256).Hash

    $command.CommandText = @'
CREATE TABLE #Inserted (Id int NOT NULL,StaffId int NOT NULL,SubscriptionId int NOT NULL);
INSERT dbo.SalaryPackage (SalaryType,Type,Amount,StaffId,SubscriptionId,IsDeleted,GUID,IsActive,IsValid,IsChanged,DeletedAt,DeletedBy,CreatedAt,CreatedBy,No,ApplicableFrom)
OUTPUT inserted.Id,inserted.StaffId,inserted.SubscriptionId INTO #Inserted
SELECT valuesToSeed.SalaryType,valuesToSeed.Type,valuesToSeed.Amount,s.StaffId,s.SubscriptionId,0,NEWID(),1,1,1,NULL,NULL,SYSUTCDATETIME(),N'SigmaTestPayrollSeed',
    CONCAT(N'TEST-PAY-202610-',s.StaffId,N'-',valuesToSeed.SalaryType,N'-',valuesToSeed.Type),CAST('20261001' AS date)
FROM #Candidates s CROSS JOIN (VALUES (2,0,CAST(2000 AS decimal(18,2))),(0,0,CAST(2600 AS decimal(18,2))),
    (2,2,CAST(250 AS decimal(18,2))),(2,1,CAST(350 AS decimal(18,2))),(1,0,CAST(10 AS decimal(18,2))),(1,1,CAST(20 AS decimal(18,2)))) valuesToSeed(SalaryType,Type,Amount);
IF (SELECT COUNT(*) FROM #Inserted)<>162 OR (SELECT COUNT(DISTINCT StaffId) FROM #Inserted)<>27
    THROW 50008, 'Inserted salary count failed.', 1;
IF EXISTS (SELECT 1 FROM #Inserted i JOIN #StaffScope s ON s.StaffId=i.StaffId WHERE i.SubscriptionId<>s.SubscriptionId)
    THROW 50009, 'Inserted ownership failed.', 1;
IF EXISTS (SELECT 1 FROM #Candidates c LEFT JOIN dbo.SalaryPackage sp ON sp.StaffId=c.StaffId AND sp.SubscriptionId=c.SubscriptionId
    AND ISNULL(sp.IsDeleted,0)=0 AND ISNULL(sp.IsActive,1)=1 AND sp.ApplicableFrom='20261001'
    GROUP BY c.StaffId HAVING COUNT(sp.Id)<>6 OR COUNT(DISTINCT CONCAT(sp.SalaryType,':',sp.Type))<>6
    OR SUM(CASE WHEN sp.SalaryType=2 AND sp.Type=0 THEN sp.Amount ELSE 0 END)<>2000
    OR SUM(CASE WHEN sp.SalaryType=2 AND sp.Type=1 THEN sp.Amount ELSE 0 END)<>350
    OR SUM(CASE WHEN sp.SalaryType=2 AND sp.Type=2 THEN sp.Amount ELSE 0 END)<>250
    OR SUM(CASE WHEN sp.SalaryType=0 AND sp.Type=0 THEN sp.Amount ELSE 0 END)<>2600
    OR SUM(CASE WHEN sp.SalaryType=1 AND sp.Type=0 THEN sp.Amount ELSE 0 END)<>10
    OR SUM(CASE WHEN sp.SalaryType=1 AND sp.Type=1 THEN sp.Amount ELSE 0 END)<>20)
    THROW 50010, 'Seeded components failed.', 1;
IF EXISTS (SELECT * FROM #OriginalSalary EXCEPT SELECT sp.* FROM dbo.SalaryPackage sp JOIN #OriginalSalary old ON old.Id=sp.Id)
    THROW 50011, 'Original salary rows changed.', 1;
IF (SELECT COUNT(*) FROM dbo.SalaryPackage)<>193 THROW 50012, 'Final salary row count failed.', 1;
'@
    [void]$command.ExecuteNonQuery()
    $command.CommandText = 'SELECT sp.* FROM dbo.SalaryPackage sp JOIN #OriginalSalary old ON old.Id=sp.Id ORDER BY sp.Id;'
    $unchangedRows = Read-Records $command
    if ((ConvertTo-Json -InputObject @($unchangedRows) -Depth 8 -Compress) -cne $originalJson) { throw 'Original salary snapshot comparison failed.' }
    $command.CommandText = 'SELECT Id,StaffId,SubscriptionId FROM #Inserted ORDER BY Id;'
    $insertedRows = Read-Records $command
    $transaction.Commit()
    $committed = $true
    $outcome = [ordered]@{
        Committed = $true; EffectiveFrom = '2026-10-01'; AddedStaff = $candidates.Count; AddedRows = $insertedRows.Count
        ExistingRowsUnchanged = $originalRows.Count; PreservedCompleteStaff = 3; ActiveStaffUpdated = @($candidates | Where-Object IsInactive -eq $false).Count
        BackupPath = $backupPath; BackupSHA256 = $backupHash; InsertedRows = $insertedRows
    }
    $outcomePath = Join-Path $reviewDirectory 'HRM_PAYROLL_TEST_SALARY_SEED_OUTCOME.json'
    [IO.File]::WriteAllText($outcomePath, (ConvertTo-Json -InputObject $outcome -Depth 8), $utf8)
    $outcome.Remove('InsertedRows')
    ConvertTo-Json -InputObject $outcome -Depth 5 -Compress
} catch {
    if ($transaction -and -not $committed) { try { $transaction.Rollback() } catch {} }
    Write-Output ('Salary seed failed; committed=' + $committed + '; type=' + $_.Exception.GetType().Name)
    if ($_.Exception.InnerException -is [System.Data.SqlClient.SqlException]) {
        foreach ($sqlError in $_.Exception.InnerException.Errors) { Write-Output ($sqlError.Number.ToString() + ': ' + $sqlError.Message) }
    } elseif ($_.Exception -is [Management.Automation.RuntimeException]) { Write-Output $_.Exception.Message }
    exit 1
} finally {
    if ($transaction) { $transaction.Dispose() }
    $connection.Dispose()
}
