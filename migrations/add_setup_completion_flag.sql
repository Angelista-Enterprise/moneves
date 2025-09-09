-- Add setup completion flag to users table
ALTER TABLE users ADD COLUMN setup_completed INTEGER DEFAULT 0;
