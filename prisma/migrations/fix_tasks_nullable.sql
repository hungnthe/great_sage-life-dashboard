-- Make result and requested_by nullable
ALTER TABLE tasks MODIFY COLUMN result VARCHAR(500) NULL;
ALTER TABLE tasks MODIFY COLUMN requested_by VARCHAR(100) NULL;
