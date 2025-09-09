-- Add innovative budget features to budget_categories table
ALTER TABLE budget_categories ADD COLUMN priority INTEGER DEFAULT 1;
ALTER TABLE budget_categories ADD COLUMN budget_type TEXT DEFAULT 'monthly';
ALTER TABLE budget_categories ADD COLUMN alert_threshold REAL DEFAULT 0.8;
ALTER TABLE budget_categories ADD COLUMN rollover_enabled INTEGER DEFAULT 0;
ALTER TABLE budget_categories ADD COLUMN rollover_amount REAL DEFAULT 0;
ALTER TABLE budget_categories ADD COLUMN savings_goal REAL;
ALTER TABLE budget_categories ADD COLUMN spending_pattern TEXT;
ALTER TABLE budget_categories ADD COLUMN last_reset_date TEXT;
ALTER TABLE budget_categories ADD COLUMN average_spending REAL DEFAULT 0;
ALTER TABLE budget_categories ADD COLUMN spending_variance REAL DEFAULT 0;
ALTER TABLE budget_categories ADD COLUMN updated_at TEXT;

-- Create budget_insights table
CREATE TABLE IF NOT EXISTS budget_insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  budget_category_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data TEXT,
  severity TEXT DEFAULT 'info',
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (budget_category_id) REFERENCES budget_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create budget_achievements table
CREATE TABLE IF NOT EXISTS budget_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  budget_category_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  unlocked_at TEXT NOT NULL,
  data TEXT,
  FOREIGN KEY (budget_category_id) REFERENCES budget_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
