-- Read-only metadata diagnostics. Run in the database where the migration failed.
-- No constraint, table, migration-history or business-data changes.
SELECT DB_NAME() AS CurrentDatabase;

-- All actual CustomerId FK definitions, regardless of constraint/schema naming.
SELECT
    SCHEMA_NAME(t.schema_id) AS TableSchema,
    t.name AS TableName,
    c.name AS ColumnName,
    fk.name AS ForeignKeyName,
    SCHEMA_NAME(rt.schema_id) AS ReferencedSchema,
    rt.name AS ReferencedTable,
    rc.name AS ReferencedColumn,
    fk.delete_referential_action_desc AS DeleteAction,
    fk.is_disabled,
    fk.is_not_trusted
FROM sys.foreign_keys AS fk
JOIN sys.foreign_key_columns AS fkc ON fkc.constraint_object_id = fk.object_id
JOIN sys.tables AS t ON t.object_id = fkc.parent_object_id
JOIN sys.columns AS c ON c.object_id = t.object_id AND c.column_id = fkc.parent_column_id
JOIN sys.tables AS rt ON rt.object_id = fkc.referenced_object_id
JOIN sys.columns AS rc ON rc.object_id = rt.object_id AND rc.column_id = fkc.referenced_column_id
WHERE t.name = N'CustomerRequest' AND c.name = N'CustomerId'
ORDER BY TableSchema, ForeignKeyName;

-- Current columns/defaults touched by the pending combined migration.
SELECT
    SCHEMA_NAME(t.schema_id) AS TableSchema,
    t.name AS TableName,
    c.name AS ColumnName,
    TYPE_NAME(c.user_type_id) AS DataType,
    c.max_length AS MaxLengthBytes,
    c.is_nullable,
    dc.definition AS DefaultDefinition
FROM sys.tables AS t
JOIN sys.columns AS c ON c.object_id = t.object_id
LEFT JOIN sys.default_constraints AS dc ON dc.object_id = c.default_object_id
WHERE (t.name = N'CustomerRequest' AND c.name IN (N'CustomerId', N'Status'))
   OR (t.name = N'Country' AND c.name = N'Name')
ORDER BY TableSchema, TableName, ColumnName;

-- Current index definitions required by this migration, with key column order.
SELECT
    SCHEMA_NAME(t.schema_id) AS TableSchema,
    t.name AS TableName,
    i.name AS IndexName,
    i.is_unique,
    i.filter_definition,
    ic.key_ordinal,
    c.name AS ColumnName
FROM sys.tables AS t
JOIN sys.indexes AS i ON i.object_id = t.object_id
JOIN sys.index_columns AS ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns AS c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE (t.name = N'Branch' AND i.name = N'IX_Branch_SubscriptionId_Name')
   OR (t.name = N'Country' AND i.name = N'IX_Country_SubscriptionId_Name')
   OR (t.name = N'CustomerRequest' AND i.name = N'IX_CustomerRequest_SubscriptionId_Status_Id')
ORDER BY TableSchema, TableName, IndexName, ic.key_ordinal;

-- Confirm whether either newly generated migration is recorded as applied.
IF OBJECT_ID(N'dbo.__EFMigrationsHistory', N'U') IS NOT NULL
BEGIN
    SELECT MigrationId, ProductVersion
    FROM dbo.__EFMigrationsHistory
    WHERE MigrationId LIKE N'20261014%'
    ORDER BY MigrationId;
END;
