PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_savings_goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`target_amount` real NOT NULL,
	`current_amount` real DEFAULT 0 NOT NULL,
	`target_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_savings_goals`("id", "user_id", "account_id", "name", "target_amount", "current_amount", "target_date", "created_at") SELECT "id", "user_id", "account_id", "name", "target_amount", "current_amount", "target_date", "created_at" FROM `savings_goals`;--> statement-breakpoint
DROP TABLE `savings_goals`;--> statement-breakpoint
ALTER TABLE `__new_savings_goals` RENAME TO `savings_goals`;--> statement-breakpoint
PRAGMA foreign_keys=ON;