CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206210540_InitialCreate') THEN
    CREATE TABLE "Accounts" (
        "Id" INTEGER NOT NULL,
        "AccountNumber" TEXT NOT NULL,
        "Balance" TEXT NOT NULL,
        "OwnerName" TEXT NOT NULL,
        CONSTRAINT "PK_Accounts" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206210540_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260206210540_InitialCreate', '9.0.2');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206213225_AddCustomerAndTransaction') THEN
    ALTER TABLE "Accounts" ADD "CustomerId" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206213225_AddCustomerAndTransaction') THEN
    CREATE TABLE "Customers" (
        "Id" INTEGER NOT NULL,
        "FirstName" TEXT NOT NULL,
        "LastName" TEXT NOT NULL,
        "Email" TEXT NOT NULL,
        "Phone" TEXT NOT NULL,
        "Address" TEXT NOT NULL,
        "DateOfBirth" TEXT NOT NULL,
        "CreatedAt" TEXT NOT NULL,
        CONSTRAINT "PK_Customers" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206213225_AddCustomerAndTransaction') THEN
    CREATE TABLE "Transactions" (
        "Id" INTEGER NOT NULL,
        "AccountId" INTEGER NOT NULL,
        "Type" INTEGER NOT NULL,
        "Amount" TEXT NOT NULL,
        "Description" TEXT NOT NULL,
        "BalanceBefore" TEXT NOT NULL,
        "BalanceAfter" TEXT NOT NULL,
        "Timestamp" TEXT NOT NULL,
        CONSTRAINT "PK_Transactions" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Transactions_Accounts_AccountId" FOREIGN KEY ("AccountId") REFERENCES "Accounts" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206213225_AddCustomerAndTransaction') THEN
    CREATE INDEX "IX_Accounts_CustomerId" ON "Accounts" ("CustomerId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206213225_AddCustomerAndTransaction') THEN
    CREATE INDEX "IX_Transactions_AccountId" ON "Transactions" ("AccountId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206213225_AddCustomerAndTransaction') THEN
    ALTER TABLE "Accounts" ADD CONSTRAINT "FK_Accounts_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE CASCADE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260206213225_AddCustomerAndTransaction') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260206213225_AddCustomerAndTransaction', '9.0.2');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Transactions" ALTER COLUMN "Type" TYPE integer USING "Type"::integer;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Transactions" ALTER COLUMN "Timestamp" TYPE timestamp with time zone USING "Timestamp"::timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Transactions" ALTER COLUMN "Description" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Transactions" ALTER COLUMN "BalanceBefore" TYPE numeric(18,2) USING "BalanceBefore"::numeric(18,2);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Transactions" ALTER COLUMN "BalanceAfter" TYPE numeric(18,2) USING "BalanceAfter"::numeric(18,2);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Transactions" ALTER COLUMN "Amount" TYPE numeric(18,2) USING "Amount"::numeric(18,2);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Transactions" ALTER COLUMN "AccountId" TYPE integer USING "AccountId"::integer;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Transactions" ALTER COLUMN "Id" TYPE integer USING "Id"::integer;
    ALTER TABLE "Transactions" ALTER COLUMN "Id" DROP DEFAULT;
    ALTER TABLE "Transactions" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Customers" ALTER COLUMN "Phone" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Customers" ALTER COLUMN "LastName" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Customers" ALTER COLUMN "FirstName" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Customers" ALTER COLUMN "Email" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Customers" ALTER COLUMN "DateOfBirth" TYPE timestamp with time zone USING "DateOfBirth"::timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Customers" ALTER COLUMN "CreatedAt" TYPE timestamp with time zone USING "CreatedAt"::timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Customers" ALTER COLUMN "Address" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Customers" ALTER COLUMN "Id" TYPE integer USING "Id"::integer;
    ALTER TABLE "Customers" ALTER COLUMN "Id" DROP DEFAULT;
    ALTER TABLE "Customers" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Accounts" ALTER COLUMN "OwnerName" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Accounts" ALTER COLUMN "CustomerId" TYPE integer USING "CustomerId"::integer;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Accounts" ALTER COLUMN "Balance" TYPE numeric(18,2) USING "Balance"::numeric(18,2);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Accounts" ALTER COLUMN "AccountNumber" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    ALTER TABLE "Accounts" ALTER COLUMN "Id" TYPE integer USING "Id"::integer;
    ALTER TABLE "Accounts" ALTER COLUMN "Id" DROP DEFAULT;
    ALTER TABLE "Accounts" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260211212249_PostgreSQLMigration') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260211212249_PostgreSQLMigration', '9.0.2');
    END IF;
END $EF$;
COMMIT;

