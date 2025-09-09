CREATE TABLE `budget_achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_category_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`achievement_type` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`unlocked_at` text NOT NULL,
	`data` text,
	FOREIGN KEY (`budget_category_id`) REFERENCES `budget_categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `budget_insights` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_category_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`insight_type` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`data` text,
	`severity` text DEFAULT 'info' NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`budget_category_id`) REFERENCES `budget_categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transaction_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`bg_color` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DROP TABLE `avatar_tokens`;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `auto_categorize_filters` text;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `priority` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `budget_type` text DEFAULT 'monthly' NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `alert_threshold` real DEFAULT 0.8 NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `rollover_enabled` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `rollover_amount` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `savings_goal` real;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `spending_pattern` text;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `last_reset_date` text;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `average_spending` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `spending_variance` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_categories` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP;