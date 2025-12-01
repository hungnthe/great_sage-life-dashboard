-- Add missing fields to projects table
ALTER TABLE `projects` 
ADD COLUMN `end_date` date DEFAULT NULL AFTER `start_date`,
ADD COLUMN `target_hours` decimal(10,2) NOT NULL DEFAULT '0.00' AFTER `end_date`,
ADD COLUMN `completed_hours` decimal(10,2) NOT NULL DEFAULT '0.00' AFTER `target_hours`;
