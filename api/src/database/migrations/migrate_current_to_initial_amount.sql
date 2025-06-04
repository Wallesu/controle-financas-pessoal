-- Backup the Accounts table
CREATE TABLE IF NOT EXISTS Accounts_Backup AS SELECT * FROM Accounts;

-- Add Initial_Amount column (using proper MySQL syntax)
SET @dbname = DATABASE();
SET @tablename = "Accounts";
SET @columnname = "Initial_Amount";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE Accounts ADD COLUMN Initial_Amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Copy data from Current_Amount to Initial_Amount
UPDATE Accounts
SET Initial_Amount = Current_Amount;

-- Remove Current_Amount column
ALTER TABLE Accounts
DROP COLUMN Current_Amount;

-- In case of failure, here's how to rollback:
-- ALTER TABLE Accounts ADD COLUMN Current_Amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00;
-- UPDATE Accounts SET Current_Amount = Initial_Amount;
-- ALTER TABLE Accounts DROP COLUMN Initial_Amount;
-- Or restore from backup:
-- DROP TABLE IF EXISTS Accounts;
-- RENAME TABLE Accounts_Backup TO Accounts; 