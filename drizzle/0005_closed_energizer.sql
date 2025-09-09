ALTER TABLE `budget_categories` ADD `is_tracked` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `is_goal_less` integer DEFAULT false NOT NULL;